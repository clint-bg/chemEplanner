import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENGINEERING_DEPTS = [
  'CH EN', 'CBE',
  'CCE', 'CE', 'CE EN', 'CIV EN',
  'EC EN',
  'ME EN',
  'MFGEN',
  'C S',
  'ENG T'
];

const EMSB_DEPTS = [
  'CHEM', 'PHYS', 'MATH', 'STAT', 'NDFS', 'BIO', 'CELL', 'PWS', 'MMBIO'
];

const REQUIRED_MAJOR_COURSES = new Set([
  'CBE_170', 'CHEN_170', 'CH EN_170',
  'CBE_191', 'CHEN_191', 'CH EN_191',
  'CBE_263', 'CHEN_263', 'CH EN_263',
  'CBE_291', 'CHEN_291', 'CH EN_291',
  'CBE_273', 'CHEN_273', 'CH EN_273',
  'CBE_285', 'CHEN_285', 'CH EN_285',
  'CBE_311', 'CHEN_311', 'CH EN_311',
  'CBE_345', 'CHEN_345', 'CH EN_345',
  'CBE_373', 'CHEN_373', 'CH EN_373',
  'CBE_374', 'CHEN_374', 'CH EN_374',
  'CBE_376', 'CHEN_376', 'CH EN_376',
  'CBE_378', 'CHEN_378', 'CH EN_378',
  'CBE_385', 'CHEN_385', 'CH EN_385',
  'CBE_386', 'CHEN_386', 'CH EN_386',
  'CBE_391', 'CHEN_391', 'CH EN_391',
  'CBE_436', 'CHEN_436', 'CH EN_436',
  'CBE_445', 'CHEN_445', 'CH EN_445',
  'CBE_451', 'CHEN_451', 'CH EN_451',
  'CBE_476', 'CHEN_476', 'CH EN_476',
  'CBE_479', 'CHEN_479', 'CH EN_479',
  'MATH_112', 'MATH_113', 'MATH_302', 'MATH_303',
  'PHYS_121', 'CHEM_111', 'CHEM_112', 'CHEM_357', 'CHEM_467',
  'WRTG_316', 'STAT_121', 'ECON_110', 'UNIV_101', 'WRTG_150',
  'AHTG_100', 'LETT_100', 'CIV_100', 'RELA_121', 'RELA_250',
  'RELC_200', 'RELC_225'
]);

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

const SUBJECT_KEYWORD_MAP = [
  { category: 'Catalysis & Reaction Engineering', keywords: ['catalys', 'kinetics', 'reactor', 'reaction', 'surface', 'thermodynamic'] },
  { category: 'Polymers & Soft Matter', keywords: ['polymer', 'macromolec', 'soft matter', 'rheology', 'colloid', 'plastic', 'composite'] },
  { category: 'Semiconductors & Microelectronics', keywords: ['semiconductor', 'microelectron', 'cleanroom', 'photolithograph', 'solid state', 'device', 'wafer', 'circuit', 'micro'] },
  { category: 'Numerical Methods & Simulation', keywords: ['numerical', 'simulation', 'computational', 'cfd', 'finite element', 'differential', 'modeling', 'algorithm'] },
  { category: 'Nuclear Engineering', keywords: ['nuclear', 'radiation', 'fission', 'decay', 'isotope', 'reactor physics'] },
  { category: 'Computation & Data Science', keywords: ['data science', 'machine learning', 'algorithm', 'python', 'programming', 'deep learning', 'neural', 'software', 'database', 'computer'] },
  { category: 'Biomedical & Biological Engineering', keywords: ['biomedical', 'biology', 'tissue', 'cellular', 'biomaterial', 'drug delivery', 'biofluid', 'bio', 'medical'] },
  { category: 'Energy & Environmental Engineering', keywords: ['energy', 'renewable', 'solar', 'fuel cell', 'combustion', 'petroleum', 'fluid mechanics', 'heat transfer', 'environment', 'sustainable', 'water'] },
  { category: 'Materials & Nanoscience', keywords: ['material', 'nano', 'crystal', 'metallurgy', 'characterization', 'microstructure', 'composite', 'structure'] },
  { category: 'Business, Leadership & Management', keywords: ['management', 'accounting', 'finance', 'entrepreneur', 'innovation', 'project management', 'business', 'leadership'] }
];

function assignSubjectCategories(topic, description, deptCode) {
  const text = `${topic || ''} ${description || ''} ${deptCode || ''}`.toLowerCase();
  const matchedCategories = [];

  for (const group of SUBJECT_KEYWORD_MAP) {
    if (group.keywords.some(kw => text.includes(kw))) {
      matchedCategories.push(group.category);
    }
  }

  if (matchedCategories.length === 0) {
    if (ENGINEERING_DEPTS.includes(deptCode)) {
      matchedCategories.push('Numerical Methods & Simulation');
    } else {
      matchedCategories.push('Computation & Data Science');
    }
  }

  return matchedCategories;
}

function parseTermsTaught(offeredStr) {
  if (!offeredStr) return ['Fall', 'Winter'];
  const terms = [];
  const str = offeredStr.toLowerCase();
  if (str.includes('fall')) terms.push('Fall');
  if (str.includes('winter')) terms.push('Winter');
  if (str.includes('spring')) terms.push('Spring');
  if (str.includes('summer')) terms.push('Summer');
  return terms.length > 0 ? terms : ['Fall', 'Winter'];
}

export async function crawlByuCatalog() {
  console.log('🚀 Starting BYU Undergraduate Engineering Catalog Web Crawler (All Electives & Prerequisites)...');

  try {
    console.log('🌐 Fetching full BYU catalog courses list from Coursedog API...');
    const url = 'https://app.coursedog.com/api/v1/cm/byu/courses';
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://catalog.byu.edu',
        'Referer': 'https://catalog.byu.edu/'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} returned from Coursedog API`);
    }

    const data = await res.json();
    const rawCourses = Object.values(data);
    console.log(`📦 Fetched ${rawCourses.length} raw course entries from BYU catalog.`);

    // Build coursedogIdToInfoMap and codeToInfoMap for ALL courses in catalog
    const coursedogIdToInfoMap = new Map();
    const codeToInfoMap = new Map();

    for (const c of rawCourses) {
      if (!c || !c.code) continue;
      const rawCode = c.code.trim();
      const match = rawCode.match(/^([A-Z\s]+?)\s*(\d+[A-Z]?)$/);
      if (match) {
        const dept = match[1].trim();
        const num = match[2];
        const normalizedCode = `${dept} ${num}`;
        const deptClean = dept.replace(/\s+/g, '');
        const classId = COURSE_CODE_TO_ID[normalizedCode] || COURSE_CODE_TO_ID[`${deptClean}_${num}`] || `crawled_${deptClean}_${num}`;
        
        const info = { code: normalizedCode, dept, num, classId, raw: c };
        coursedogIdToInfoMap.set(c.id, info);
        if (c.courseNumber) coursedogIdToInfoMap.set(c.courseNumber, info);
        codeToInfoMap.set(normalizedCode, info);
        codeToInfoMap.set(`${deptClean} ${num}`, info);
        codeToInfoMap.set(`${deptClean}_${num}`, info);
      }
    }

    const catalogCourseMap = new Map();
    const neededPrereqClassIds = new Set();

    // Parse requisites and text references for all candidate courses
    for (const c of rawCourses) {
      if (!c || c.status === 'Inactive') continue;
      const codeStr = (c.code || c.subjectCode || '').trim();
      if (!codeStr) continue;

      const match = codeStr.match(/^([A-Z\s]+?)\s*(\d+[A-Z]?)$/);
      if (!match) continue;

      const deptCode = match[1].trim();
      const courseNum = match[2];
      const numVal = parseInt(courseNum, 10);

      const isEngineering = ENGINEERING_DEPTS.includes(deptCode);
      const isEMSB = EMSB_DEPTS.includes(deptCode);

      if (!isEngineering && !isEMSB) continue;

      const courseKey = `${deptCode.replace(/\s+/g, '')}_${courseNum}`;
      if (REQUIRED_MAJOR_COURSES.has(courseKey)) continue;

      const normalizedCode = `${deptCode} ${courseNum}`;
      const classId = COURSE_CODE_TO_ID[normalizedCode] || `crawled_${deptCode.replace(/\s+/g, '')}_${courseNum}`;

      const extractedPrereqIds = new Set();

      // 1. Parse requisitesSimple logic from Coursedog
      if (c.requisites && c.requisites.requisitesSimple) {
        for (const reqSimple of c.requisites.requisitesSimple) {
          if (reqSimple.rules) {
            for (const rule of reqSimple.rules) {
              if (rule.value && rule.value.values) {
                for (const valGroup of rule.value.values) {
                  if (valGroup.value && Array.isArray(valGroup.value)) {
                    for (const cid of valGroup.value) {
                      const info = coursedogIdToInfoMap.get(cid);
                      if (info && info.classId !== classId) {
                        extractedPrereqIds.add(info.classId);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // 2. Parse text description & prerequisite fields for course code references
      const fullText = `${c.prerequisite || ''} ${c.preAndCorequisites || ''} ${c.description || ''}`.toUpperCase();
      const codeRegex = /\b(MATH|CHEM|PHYS|CBE|CH EN|CHEN|STAT|ME EN|EC EN|CE EN|C S|BIOL|PWS|MMBIO)\s+(\d{3}[A-Z]?)\b/g;
      let textMatch;
      while ((textMatch = codeRegex.exec(fullText)) !== null) {
        const dept = textMatch[1].replace(/\s+/g, ' ');
        const num = textMatch[2];
        const matchedCode = `${dept} ${num}`;
        if (matchedCode !== `${deptCode} ${courseNum}`) {
          const info = codeToInfoMap.get(matchedCode);
          if (info && info.classId !== classId) {
            extractedPrereqIds.add(info.classId);
          }
        }
      }

      const isUpper = !isNaN(numVal) && numVal >= 300 && numVal < 600;

      catalogCourseMap.set(classId, {
        c,
        deptCode,
        courseNum,
        numVal,
        isEngineering,
        isEMSB,
        prereqIds: Array.from(extractedPrereqIds),
        isUpper
      });

      if (isUpper) {
        for (const pId of extractedPrereqIds) {
          neededPrereqClassIds.add(pId);
        }
      }
    }

    // Transitive pass: collect prerequisite IDs for lower-division courses needed as prerequisites
    let addedNew = true;
    while (addedNew) {
      addedNew = false;
      for (const pId of Array.from(neededPrereqClassIds)) {
        const entry = catalogCourseMap.get(pId);
        if (entry && entry.prereqIds) {
          for (const subPId of entry.prereqIds) {
            if (!neededPrereqClassIds.has(subPId)) {
              neededPrereqClassIds.add(subPId);
              addedNew = true;
            }
          }
        }
      }
    }

    // Build final output array
    const finalCourses = [];
    const addedIds = new Set();

    for (const [classId, entry] of catalogCourseMap.entries()) {
      const { c, deptCode, courseNum, numVal, isEngineering, isEMSB, prereqIds, isUpper } = entry;

      // Include all 300+ upper electives OR lower-division courses required as prerequisites
      if (!isUpper && !neededPrereqClassIds.has(classId)) continue;
      if (addedIds.has(classId)) continue;
      addedIds.add(classId);

      const topic = (c.longName || c.name || `${deptCode} ${courseNum}`).trim();
      const description = (c.description || `${deptCode} ${courseNum} - BYU Catalog.`).trim();

      let credits = 3;
      if (c.credits && typeof c.credits === 'object') {
        const val = c.credits.creditHours?.value || c.credits.creditHours?.min;
        if (typeof val === 'number' && val > 0) credits = val;
      }

      const category = isEngineering ? 'Eng' : 'EMSB';
      const abetCategory = isEngineering ? 'Eng' : 'Sci';
      const termsTaught = parseTermsTaught(c.courseTypicallyOffered);
      const subjectCategories = assignSubjectCategories(topic, description, deptCode);

      finalCourses.push({
        classId: classId,
        classNumber: courseNum,
        deptCode: deptCode,
        typicalYear: courseNum.startsWith('1') || courseNum.startsWith('2') ? 'Sophomore' : courseNum.startsWith('3') ? 'Junior' : 'Senior',
        credits: credits,
        topic: topic,
        termsTaught: termsTaught,
        prereqs: prereqIds.filter(id => id !== classId),
        concurrentPrereqs: [],
        category: category,
        genEdSets: [],
        substitutionAllowed: true,
        substitutionClassIds: [],
        abetCategory: abetCategory,
        subjectCategories: subjectCategories,
        description: description,
        source: isUpper ? 'BYU Catalog Crawler' : 'BYU Catalog Crawler (Prerequisite)'
      });
    }

    console.log(`✅ Indexed ${finalCourses.length} electives & prerequisite courses!`);

    const outputPath = path.resolve(__dirname, '../src/data/crawledElectives.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalCourses, null, 2));
    console.log(`💾 Saved catalog data to ${outputPath}`);
    return finalCourses;

  } catch (err) {
    console.error('❌ Error during BYU catalog crawling:', err.message);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  crawlByuCatalog().catch(console.error);
}
