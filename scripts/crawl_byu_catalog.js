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

// Required major Chemical Engineering curriculum courses to exclude from electives
const REQUIRED_MAJOR_COURSES = new Set([
  'CBE_170', 'CHEN_170',
  'CBE_191', 'CHEN_191',
  'CBE_263', 'CHEN_263',
  'CBE_291', 'CHEN_291',
  'CBE_273', 'CHEN_273',
  'CBE_285', 'CHEN_285',
  'CBE_311', 'CHEN_311',
  'CBE_345', 'CHEN_345',
  'CBE_373', 'CHEN_373',
  'CBE_374', 'CHEN_374',
  'CBE_376', 'CHEN_376',
  'CBE_378', 'CHEN_378',
  'CBE_385', 'CHEN_385',
  'CBE_386', 'CHEN_386',
  'CBE_391', 'CHEN_391',
  'CBE_436', 'CHEN_436',
  'CBE_445', 'CHEN_445',
  'CBE_451', 'CHEN_451',
  'CBE_476', 'CHEN_476',
  'CBE_479', 'CHEN_479',
  'MATH_112', 'MATH_113', 'MATH_302', 'MATH_303',
  'PHYS_121', 'CHEM_111', 'CHEM_112', 'CHEM_357', 'CHEM_467',
  'WRTG_316', 'STAT_121', 'ECON_110', 'UNIV_101', 'WRTG_150',
  'AHTG_100', 'LETT_100', 'CIV_100', 'RELA_121', 'RELA_250',
  'RELC_200', 'RELC_225'
]);

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
  console.log('🚀 Starting BYU Undergraduate Engineering Catalog Web Crawler (300-500 Level)...');

  const crawledCourses = [];
  const seenClassIds = new Set();

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

    for (const c of rawCourses) {
      if (!c || c.status === 'Inactive') continue;

      const codeStr = (c.code || c.subjectCode || '').trim();
      if (!codeStr) continue;

      const match = codeStr.match(/^([A-Z\s]+?)\s*(\d+[A-Z]?)$/);
      if (!match) continue;

      const deptCode = match[1].trim();
      const courseNum = match[2];
      const numVal = parseInt(courseNum, 10);

      // We focus on 300 to 599 level courses
      if (isNaN(numVal) || numVal < 300 || numVal >= 600) continue;

      const isEngineering = ENGINEERING_DEPTS.includes(deptCode);
      const isEMSB = EMSB_DEPTS.includes(deptCode);

      if (!isEngineering && !isEMSB) continue;

      // Exclude required major Chemical Engineering curriculum courses
      const courseKey = `${deptCode.replace(/\s+/g, '')}_${courseNum}`;
      if (REQUIRED_MAJOR_COURSES.has(courseKey)) {
        continue;
      }

      const classId = `crawled_${deptCode.replace(/\s+/g, '')}_${courseNum}`;
      if (seenClassIds.has(classId)) continue;
      seenClassIds.add(classId);

      const topic = (c.longName || c.name || `${deptCode} ${courseNum}`).trim();
      const description = (c.description || `${deptCode} ${courseNum} - 300+ Level Course from BYU Catalog.`).trim();
      
      let credits = 3;
      if (c.credits && typeof c.credits === 'object') {
        const val = c.credits.creditHours?.value || c.credits.creditHours?.min;
        if (typeof val === 'number' && val > 0) {
          credits = val;
        }
      }

      const category = isEngineering ? 'Eng' : 'EMSB';
      const abetCategory = isEngineering ? 'Eng' : 'Sci';
      const termsTaught = parseTermsTaught(c.courseTypicallyOffered);
      const subjectCategories = assignSubjectCategories(topic, description, deptCode);

      const courseObj = {
        classId: classId,
        classNumber: courseNum,
        deptCode: deptCode,
        typicalYear: courseNum.startsWith('3') ? 'Junior' : 'Senior',
        credits: credits,
        topic: topic,
        termsTaught: termsTaught,
        prereqs: [],
        concurrentPrereqs: [],
        category: category,
        genEdSets: [],
        substitutionAllowed: true,
        substitutionClassIds: [],
        abetCategory: abetCategory,
        subjectCategories: subjectCategories,
        description: description,
        source: 'BYU Catalog Crawler'
      };

      crawledCourses.push(courseObj);
    }

  } catch (err) {
    console.error('❌ Error during BYU catalog crawling:', err.message);
  }

  console.log(`✅ Scraped & indexed ${crawledCourses.length} UNIQUE 300+ level non-major engineering & math/science electives!`);

  const outputPath = path.resolve(__dirname, '../src/data/crawledElectives.json');
  fs.writeFileSync(outputPath, JSON.stringify(crawledCourses, null, 2));
  console.log(`💾 Saved catalog data to ${outputPath}`);
  return crawledCourses;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  crawlByuCatalog().catch(console.error);
}
