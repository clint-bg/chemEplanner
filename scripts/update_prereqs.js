import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Internal class ID lookup map for major requirements & common foundation courses
const COURSE_CODE_TO_ID = {
  'CBE 170': '001', 'CHEN 170': '001', 'CH EN 170': '001',
  'CBE 191': '002', 'CHEN 191': '002', 'CH EN 191': '002',
  'CBE 263': '003', 'CHEN 263': '003', 'CH EN 263': '003',
  'CBE 273': '005', 'CHEN 273': '005', 'CH EN 273': '005',
  'CBE 285': '004', 'CHEN 285': '004', 'CH EN 285': '004',
  'CBE 311': '014', 'CHEN 311': '014', 'CH EN 311': '014',
  'CBE 345': '015', 'CHEN 345': '015', 'CH EN 345': '015',
  'CBE 373': '016', 'CHEN 373': '016', 'CH EN 373': '016',
  'CBE 374': '017', 'CHEN 374': '017', 'CH EN 374': '017',
  'CBE 376': '018', 'CHEN 376': '018', 'CH EN 376': '018',
  'CBE 378': '019', 'CHEN 378': '019', 'CH EN 378': '019',
  'CBE 386': '021', 'CHEN 386': '021', 'CH EN 386': '021',
  'CBE 436': '023', 'CHEN 436': '023', 'CH EN 436': '023',
  'CBE 476': '026', 'CHEN 476': '026', 'CH EN 476': '026',
  'CBE 479': '027', 'CHEN 479': '027', 'CH EN 479': '027',
  'MATH 112': '006',
  'MATH 113': '007',
  'PHYS 121': '008',
  'MATH 302': '009',
  'MATH 303': '010',
  'CHEM 111': '011',
  'CHEM 112': '012',
  'CHEM 357': '032',
  'CHEM 467': '033',
  'STAT 121': '036',
  'WRTG 316': '035',
  'ECON 110': '034'
};

export async function fetchAndExtractPrereqs() {
  console.log('🌐 Fetching full BYU catalog courses list from Coursedog API...');
  const res = await fetch('https://app.coursedog.com/api/v1/cm/byu/courses', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      'Origin': 'https://catalog.byu.edu',
      'Referer': 'https://catalog.byu.edu/'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch catalog: HTTP ${res.status}`);
  }

  const data = await res.json();
  const rawCoursesList = Object.values(data);
  console.log(`📦 Loaded ${rawCoursesList.length} courses from API.`);

  // 1. Build mapping from internal Coursedog IDs & course codes -> clean course name/code
  const coursedogIdToCodeMap = new Map();
  const coursedogIdToIdMap = new Map();

  for (const c of rawCoursesList) {
    if (!c || !c.code) continue;
    const rawCode = c.code.trim();
    const match = rawCode.match(/^([A-Z\s]+?)\s*(\d+[A-Z]?)$/);
    if (match) {
      const dept = match[1].trim();
      const num = match[2];
      const normalizedCode = `${dept} ${num}`;

      // Store by internal ID (e.g. "00995-001") and course code
      coursedogIdToCodeMap.set(c.id, normalizedCode);
      if (c.courseNumber) coursedogIdToCodeMap.set(c.courseNumber, normalizedCode);

      // Check if mapped to internal planner class ID
      const internalId = COURSE_CODE_TO_ID[normalizedCode] || COURSE_CODE_TO_ID[`${dept}_${num}`];
      if (internalId) {
        coursedogIdToIdMap.set(c.id, internalId);
      }
    }
  }

  console.log(`🗺️ Mapped ${coursedogIdToCodeMap.size} Coursedog IDs to course codes.`);

  // Read existing crawledElectives.json
  const filePath = path.resolve(__dirname, '../src/data/crawledElectives.json');
  const existingElectives = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let updatedCount = 0;

  // Process each elective course in existing list
  for (const courseObj of existingElectives) {
    const targetDept = courseObj.deptCode.replace(/\s+/g, '');
    const targetNum = courseObj.classNumber;

    // Find raw entry in Coursedog
    const rawEntry = rawCoursesList.find(c => {
      if (!c || !c.code) return false;
      const match = c.code.trim().match(/^([A-Z\s]+?)\s*(\d+[A-Z]?)$/);
      if (!match) return false;
      const dept = match[1].replace(/\s+/g, '');
      const num = match[2];
      return (dept === targetDept || dept === courseObj.deptCode) && num === targetNum;
    });

    if (!rawEntry) continue;

    const extractedPrereqIds = new Set();
    const extractedPrereqNames = new Set();

    // 1. Inspect requisitesSimple logic in rawEntry
    if (rawEntry.requisites && rawEntry.requisites.requisitesSimple) {
      for (const reqSimple of rawEntry.requisites.requisitesSimple) {
        if (reqSimple.rules) {
          for (const rule of reqSimple.rules) {
            if (rule.value && rule.value.values) {
              for (const valGroup of rule.value.values) {
                if (valGroup.value && Array.isArray(valGroup.value)) {
                  for (const cid of valGroup.value) {
                    const mappedCode = coursedogIdToCodeMap.get(cid);
                    if (mappedCode) {
                      extractedPrereqNames.add(mappedCode);
                      const mappedInternalId = COURSE_CODE_TO_ID[mappedCode] || COURSE_CODE_TO_ID[mappedCode.replace(' ', '_')];
                      if (mappedInternalId) {
                        extractedPrereqIds.add(mappedInternalId);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // 2. Parse text descriptions / notes for course references if prerequisites field is empty or partial
    const fullText = `${rawEntry.prerequisite || ''} ${rawEntry.preAndCorequisites || ''} ${rawEntry.description || ''}`.toUpperCase();

    // Regular expression to match department course codes (e.g. MATH 112, CHEM 111, CBE 273, PHYS 121)
    const codeRegex = /\b(MATH|CHEM|PHYS|CBE|CH EN|CHEN|STAT|ME EN|EC EN|CE EN|C S|BIOL|PWS|MMBIO)\s+(\d{3}[A-Z]?)\b/g;
    let textMatch;
    while ((textMatch = codeRegex.exec(fullText)) !== null) {
      const dept = textMatch[1].replace(/\s+/g, ' ');
      const num = textMatch[2];
      const matchedCode = `${dept} ${num}`;
      
      // Avoid self-reference
      if (matchedCode !== `${courseObj.deptCode} ${courseObj.classNumber}`) {
        const mappedInternalId = COURSE_CODE_TO_ID[matchedCode] || COURSE_CODE_TO_ID[`${dept}_${num}`] || COURSE_CODE_TO_ID[matchedCode.replace(' ', '_')];
        if (mappedInternalId) {
          extractedPrereqIds.add(mappedInternalId);
        }
      }
    }

    // Fallback based on level if no specific prerequisites detected
    if (extractedPrereqIds.size === 0) {
      const dept = courseObj.deptCode.toUpperCase();
      const num = parseInt(courseObj.classNumber, 10) || 0;

      if (dept === 'CBE' || dept === 'CH EN' || dept === 'CHEN') {
        if (num >= 500) extractedPrereqIds.add('018'); // CBE 376 Heat & Mass
        else if (num >= 300) extractedPrereqIds.add('005'); // CBE 273 Fluid Mechanics
      } else if (dept === 'CHEM') {
        if (num >= 300) extractedPrereqIds.add('012'); // CHEM 112
      } else if (dept === 'MATH' || dept === 'STAT') {
        if (num >= 300) extractedPrereqIds.add('007'); // MATH 113
      } else if (dept === 'PHYS' || dept === 'ME EN' || dept === 'CE EN' || dept === 'EC EN') {
        if (num >= 300) extractedPrereqIds.add('008'); // PHYS 121
      }
    }

    courseObj.prereqs = Array.from(extractedPrereqIds);
    if (rawEntry.description) courseObj.description = rawEntry.description;
    updatedCount++;
  }

  console.log(`✅ Extracted & assigned prerequisites for ${updatedCount} electives!`);

  // Write updated file
  fs.writeFileSync(filePath, JSON.stringify(existingElectives, null, 2));
  console.log(`💾 Saved updated prerequisites to ${filePath}`);
}

fetchAndExtractPrereqs().catch(console.error);
