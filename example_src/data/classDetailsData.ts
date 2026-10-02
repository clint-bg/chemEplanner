import { Course } from '../simulator/types';

export const INITIAL_COURSES: Course[] = [
  {
    "classId": "001",
    "classNumber": "170",
    "deptCode": "CBE",
    "typicalYear": "Freshman",
    "credits": 2,
    "topic": "Intro mass and energy balances",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "002",
    "classNumber": "191",
    "deptCode": "CBE",
    "typicalYear": "Freshman",
    "credits": 0.5,
    "topic": "Chemical engineering introduction seminar",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "003",
    "classNumber": "263",
    "deptCode": "CBE",
    "typicalYear": "Sophomore",
    "credits": 2,
    "topic": "Computational tools",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [
      "007",
      "001"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "004",
    "classNumber": "291",
    "deptCode": "CBE",
    "typicalYear": "Sophomore",
    "credits": 0.5,
    "topic": "Career Skills",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "005",
    "classNumber": "273",
    "deptCode": "CBE",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Material and Energy Balances",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [
      "001",
      "012",
      "008"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "006",
    "classNumber": "112",
    "deptCode": "MATH",
    "typicalYear": "Freshman",
    "credits": 4,
    "topic": "Calculus 1",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "007",
    "classNumber": "113",
    "deptCode": "MATH",
    "typicalYear": "Freshman",
    "credits": 4,
    "topic": "Calculus 2",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [
      "006"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "008",
    "classNumber": "121",
    "deptCode": "PHYS",
    "typicalYear": "Freshman",
    "credits": 3,
    "topic": "Newtonian Mechanics",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "009",
    "classNumber": "302",
    "deptCode": "MATH",
    "typicalYear": "Sophomore",
    "credits": 4,
    "topic": "Math for engineers",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "010",
    "classNumber": "303",
    "deptCode": "MATH",
    "typicalYear": "Sophomore",
    "credits": 4,
    "topic": "Math for engineers",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [
      "009"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "011",
    "classNumber": "111",
    "deptCode": "CHEM",
    "typicalYear": "Freshman",
    "credits": 4,
    "topic": "Chemistry principles 1",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "012",
    "classNumber": "112",
    "deptCode": "CHEM",
    "typicalYear": "Freshman",
    "credits": 3,
    "topic": "Chemistry principles 2",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [
      "011"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "013",
    "classNumber": "285",
    "deptCode": "CBE",
    "typicalYear": "Sophomore",
    "credits": 0.5,
    "topic": "Fluids lab",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "005",
      "017"
    ],
    "concurrentPrereqs": [
      "017"
    ],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "014",
    "classNumber": "311",
    "deptCode": "CBE",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Ethics, Safety, Environment",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "005"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "015",
    "classNumber": "345",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 0.5,
    "topic": "Reactions and Materials lab",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "008",
      "019",
      "021"
    ],
    "concurrentPrereqs": [
      "019",
      "021"
    ],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "016",
    "classNumber": "373",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Thermodynamics",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "033",
      "005"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "017",
    "classNumber": "374",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Fluid mechanics",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "009",
      "003",
      "005"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "018",
    "classNumber": "376",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Heat and mass transfer",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "014",
      "017"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "019",
    "classNumber": "378",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Material science",
    "termsTaught": [
      "Fall",
      "Spring"
    ],
    "prereqs": [
      "032"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "020",
    "classNumber": "385",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 0.5,
    "topic": "Heat and mass lab",
    "termsTaught": [
      "Winter",
      "016, 018"
    ],
    "prereqs": [
      "016",
      "018"
    ],
    "concurrentPrereqs": [
      "016",
      "018"
    ],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "021",
    "classNumber": "386",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Chemical reactions engineering (kinetics)",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "010",
      "005"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "022",
    "classNumber": "391",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 1,
    "topic": "Career skills 2",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "023",
    "classNumber": "436",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Process control",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "018",
      "021"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "024",
    "classNumber": "445",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 0.5,
    "topic": "Separations and process control lab",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "023",
      "026"
    ],
    "concurrentPrereqs": [
      "023",
      "026"
    ],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "025",
    "classNumber": "451",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 4,
    "topic": "Process design (capstone 1)",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "019",
      "023",
      "026"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "026",
    "classNumber": "476",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Separations",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "018",
      "016"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "027",
    "classNumber": "479",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 2,
    "topic": "Unit operations lab",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [
      "035",
      "018",
      "021"
    ],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "028",
    "classNumber": "221",
    "deptCode": "MMBio",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "micro or molecular biology",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "1"
    ],
    "substitutionAllowed": true,
    "substitutionClassIds": [
      "029",
      "030",
      "031"
    ],
    "abetCategory": "Sci"
  },
  {
    "classId": "029",
    "classNumber": "120",
    "deptCode": "CELL",
    "typicalYear": "Freshman",
    "credits": 3,
    "topic": "Cell biology",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "1"
    ],
    "substitutionAllowed": true,
    "substitutionClassIds": [
      "028",
      "030",
      "031"
    ],
    "abetCategory": "Sci"
  },
  {
    "classId": "030",
    "classNumber": "130",
    "deptCode": "BIO",
    "typicalYear": "Freshman",
    "credits": 3,
    "topic": "Biology",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "1"
    ],
    "substitutionAllowed": true,
    "substitutionClassIds": [
      "028",
      "029",
      "031"
    ],
    "abetCategory": "Sci"
  },
  {
    "classId": "031",
    "classNumber": "100",
    "deptCode": "BIO",
    "typicalYear": "Freshman",
    "credits": 3,
    "topic": "Biology, introductory",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "1"
    ],
    "substitutionAllowed": true,
    "substitutionClassIds": [
      "028",
      "029",
      "030"
    ],
    "abetCategory": "Sci"
  },
  {
    "classId": "032",
    "classNumber": "357",
    "deptCode": "CHEM",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Industrial organic chemistry",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "033",
    "classNumber": "467",
    "deptCode": "CHEM",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Physical chemistry",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "034",
    "classNumber": "110",
    "deptCode": "ECON",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Macro economics",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "035",
    "classNumber": "316",
    "deptCode": "WRTG",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Technical communication",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "036",
    "classNumber": "121",
    "deptCode": "STAT",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Statistical Data analysis",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "037",
    "classNumber": "353",
    "deptCode": "CHEM",
    "typicalYear": "Junior",
    "credits": 2,
    "topic": "Organic chemistry lab",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [
      "038"
    ],
    "abetCategory": "Sci"
  },
  {
    "classId": "038",
    "classNumber": "464",
    "deptCode": "CHEM",
    "typicalYear": "Senior",
    "credits": 2,
    "topic": "Physical chemistry lab",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Major",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [
      "037"
    ],
    "abetCategory": "Sci"
  },
  {
    "classId": "039",
    "classNumber": "433",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Energy Engineering",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "016",
      "017",
      "018"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "040",
    "classNumber": "400",
    "deptCode": "CEEN",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Advanced class in CEEN. This represents multiple classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "040",
    "classNumber": "500",
    "deptCode": "CEEN",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Advanced class in CEEN. This represents multiple classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "041",
    "classNumber": "541",
    "deptCode": "MEEN",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Computational Fluid Dynamics",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "042",
    "classNumber": "410",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Petroleum Engineering",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "016",
      "017"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "043",
    "classNumber": "330",
    "deptCode": "GEOL",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Engineering geology",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "044",
    "classNumber": "400",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 1,
    "topic": "Creative Skills in engineering",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "045",
    "classNumber": "481",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 2,
    "topic": "Intro to semiconductor processing",
    "termsTaught": [
      "Fall, every other year"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "046",
    "classNumber": "452",
    "deptCode": "ECE",
    "typicalYear": "Senior",
    "credits": 1,
    "topic": "Experiments in semiconductor processing lab",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "047",
    "classNumber": "450",
    "deptCode": "ECE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Introduction to Semiconductor devices",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "048",
    "classNumber": "281",
    "deptCode": "PHYS",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Solid state physics",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "049",
    "classNumber": "540",
    "deptCode": "CEEN",
    "typicalYear": "Senior",
    "credits": 1,
    "topic": "Geoenvironmental Engineering",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "050",
    "classNumber": "518",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Biomedical engineering",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "017",
      "018"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "051",
    "classNumber": "513",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Molecular modeling",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "052",
    "classNumber": "533",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Transport phenomena",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "018",
      "010"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "053",
    "classNumber": "536",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Machine Learning",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "023"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "054",
    "classNumber": "541",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Numerical methods",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "018",
      "010"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "055",
    "classNumber": "412",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Introduction to Nuclear Engineering",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "007",
      "012"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "056",
    "classNumber": "351",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Fundamentals of Biomedical Engineering",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "007",
      "008"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "057",
    "classNumber": "531",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Thermodynamics of multicomponents systems",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "016"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "058",
    "classNumber": "535",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Kinetics and Catalysis",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "021"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "059",
    "classNumber": "481",
    "deptCode": "CHEM",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Biochemistry",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "032",
      "030"
    ],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "060",
    "classNumber": "355",
    "deptCode": "NDFS",
    "typicalYear": "Junior",
    "credits": 4,
    "topic": "Food process engineering includes lab",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "006"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "061",
    "classNumber": "410",
    "deptCode": "MATH",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Introduction to numerical methods",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "007"
    ],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "062",
    "classNumber": "510",
    "deptCode": "MEEN",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Compressible fluid flow",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [
      "017"
    ],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "063",
    "classNumber": "199R",
    "deptCode": "CBE",
    "typicalYear": "Junior",
    "credits": 1,
    "topic": "Academic Internship - for students completing and internship",
    "termsTaught": [
      "Spring",
      "Summer"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "064",
    "classNumber": "300",
    "deptCode": "MFGEN",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "065",
    "classNumber": "200",
    "deptCode": "CS",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Eng",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Sci"
  },
  {
    "classId": "066",
    "classNumber": "200",
    "deptCode": "ACC",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "067",
    "classNumber": "300",
    "deptCode": "ACC",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "068",
    "classNumber": "200",
    "deptCode": "ENT",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "069",
    "classNumber": "300",
    "deptCode": "ENT",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "070",
    "classNumber": "200",
    "deptCode": "FIN",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "071",
    "classNumber": "300",
    "deptCode": "FIN",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "072",
    "classNumber": "200",
    "deptCode": "GSCM",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "073",
    "classNumber": "300",
    "deptCode": "GSCM",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "074",
    "classNumber": "200",
    "deptCode": "GCI",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "075",
    "classNumber": "300",
    "deptCode": "GCI",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "076",
    "classNumber": "200",
    "deptCode": "HRM",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "077",
    "classNumber": "300",
    "deptCode": "HRM",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "078",
    "classNumber": "200",
    "deptCode": "IS",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "079",
    "classNumber": "300",
    "deptCode": "IS",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "080",
    "classNumber": "200",
    "deptCode": "MKTG",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "081",
    "classNumber": "300",
    "deptCode": "MKTG",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "082",
    "classNumber": "200",
    "deptCode": "MPA",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "083",
    "classNumber": "300",
    "deptCode": "MPA",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "084",
    "classNumber": "200",
    "deptCode": "PSE",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "085",
    "classNumber": "300",
    "deptCode": "PSE",
    "typicalYear": "Junior",
    "credits": 3,
    "topic": "Various topics as this represents several possible classes students could take",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EMSB",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "086",
    "classNumber": "461",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Capstone projects",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [
      "023",
      "026"
    ],
    "concurrentPrereqs": [],
    "category": "EPSEL",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "087",
    "classNumber": "499",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Mentored research",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EPSEL",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "088",
    "classNumber": "495R",
    "deptCode": "CBE",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Global engineering outreach",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EPSEL",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "089",
    "classNumber": "475",
    "deptCode": "MEEN",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Mechanical engineering capstone 1",
    "termsTaught": [
      "Fall"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EPSEL",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "090",
    "classNumber": "476",
    "deptCode": "MEEN",
    "typicalYear": "Senior",
    "credits": 3,
    "topic": "Mechanical engineering capstone 2",
    "termsTaught": [
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "EPSEL",
    "genEdSets": [],
    "substitutionAllowed": true,
    "substitutionClassIds": [],
    "abetCategory": "Eng"
  },
  {
    "classId": "091",
    "classNumber": "101",
    "deptCode": "UNIV",
    "typicalYear": "Freshman",
    "credits": 2,
    "topic": "Gospel and College introduction principles",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "1",
      "2"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "092",
    "classNumber": "150",
    "deptCode": "WRTG",
    "typicalYear": "Freshman",
    "credits": 3,
    "topic": "Introduction to writing",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "1"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "093",
    "classNumber": "100",
    "deptCode": "AHTG",
    "typicalYear": "Freshman",
    "credits": 3,
    "topic": "American heritage",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "1"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "095",
    "classNumber": "100",
    "deptCode": "LETT",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Letters and global cultural awareness classes as part of general education to satisfy both letters and global cultural awareness at the same time",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "1"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "096",
    "classNumber": "100",
    "deptCode": "CIV",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Civilization and arts general requirements satisfied by any number of classes",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "1"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "097",
    "classNumber": "121",
    "deptCode": "RELA",
    "typicalYear": "Freshman",
    "credits": 2,
    "topic": "The book of mormon",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Rel",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "098",
    "classNumber": "250",
    "deptCode": "RELA",
    "typicalYear": "Sophomore",
    "credits": 2,
    "topic": "Christ and his gospel",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Rel",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "099",
    "classNumber": "200",
    "deptCode": "RELC",
    "typicalYear": "Sophomore",
    "credits": 2,
    "topic": "Role of the eternal family in the gospel of jesus christ",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Rel",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "100",
    "classNumber": "200",
    "deptCode": "REL",
    "typicalYear": "Sophomore",
    "credits": 2,
    "topic": "Religion elective",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Rel",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "101",
    "classNumber": "300",
    "deptCode": "REL",
    "typicalYear": "Junior",
    "credits": 2,
    "topic": "Religion elective",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Rel",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "102",
    "classNumber": "250",
    "deptCode": "REL",
    "typicalYear": "Sophomore",
    "credits": 2,
    "topic": "Religion elective",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Rel",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "103",
    "classNumber": "225",
    "deptCode": "RELC",
    "typicalYear": "Sophomore",
    "credits": 2,
    "topic": "Foundations of the restoration of the gospel of Jesus Christ",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Rel",
    "genEdSets": [],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "104",
    "classNumber": "102",
    "deptCode": "UNIV",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Great questions out of the best books",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "2"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "105",
    "classNumber": "103",
    "deptCode": "UNIV",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Inspired constitutional principles",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "2"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "106",
    "classNumber": "104",
    "deptCode": "UNIV",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Faith, family, and human flourishing",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "2"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "107",
    "classNumber": "105",
    "deptCode": "UNIV",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Stewardship and the natural world",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "2"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "108",
    "classNumber": "106",
    "deptCode": "UNIV",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Numeracy and Data",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "2"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "109",
    "classNumber": "107",
    "deptCode": "UNIV",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Effective communication",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "2"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "110",
    "classNumber": "108",
    "deptCode": "UNIV",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Languages and cultures",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "2"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  },
  {
    "classId": "111",
    "classNumber": "109",
    "deptCode": "UNIV",
    "typicalYear": "Sophomore",
    "credits": 3,
    "topic": "Arts, letters, and sciences",
    "termsTaught": [
      "Fall",
      "Winter"
    ],
    "prereqs": [],
    "concurrentPrereqs": [],
    "category": "Gen",
    "genEdSets": [
      "2"
    ],
    "substitutionAllowed": false,
    "substitutionClassIds": [],
    "abetCategory": ""
  }
];
