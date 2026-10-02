export type Term = 'Fall' | 'Winter' | 'Spring' | 'Summer';
export type CourseCategory = 'Major' | 'Eng' | 'EMSB' | 'EPSEL' | 'Gen' | 'Rel';

export interface Course {
  classId: string;
  classNumber: string;
  deptCode: string;
  typicalYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | string;
  credits: number;
  topic: string;
  termsTaught: Term[];
  prereqs: string[];
  concurrentPrereqs: string[];
  category: CourseCategory;
  genEdSets: string[];
  substitutionAllowed: boolean;
  substitutionClassIds: string[];
  abetCategory?: string;
  isCriticalPath?: boolean;
}

export interface StudentSemesterLog {
  semester: number;
  term: Term;
  targetCreditLimit: number;
  enrolledCourseIds: string[];
  totalCredits: number;
  bottleneckNotes: string[];
}

export interface Student {
  id: string;
  name: string;
  meanCreditHours: number;
  stdDevCreditHours: number;
  maxCreditHours: number; // sampled max credit hours student is willing to take (12 to 20)
  isWorking: boolean;
  workCreditPenalty: number;
  effectiveCreditLimit: number;
  currentSemester: number;
  currentTerm: Term;
  completedCourses: Set<string>;
  failedPrereqs: Array<{ courseId: string; missingPrereqId: string; semester: number }>;
  isGraduated: boolean;
  graduationSemester?: number;
  semesterHistory: StudentSemesterLog[];
}

export interface Interventions {
  // Course offering overrides (courseId -> Array of terms, e.g. '023' -> ['Fall', 'Winter'])
  offeringOverrides: Record<string, Term[]>;
  // Credit hour requirement reductions
  relCreditsRequired: number;     // default 14
  engCreditsRequired: number;     // default 9
  emsbCreditsRequired: number;    // default 4
  epselCreditsRequired: number;   // default 3
  // General Education Set selection
  genEdSet: 1 | 2;               // default 1 (Set 1 vs Set 2)
  // Specific course credit hour overrides (courseId -> credits)
  creditOverrides: Record<string, number>;
  // Prerequisite modifications (courseId -> allowed prereqs or empty to bypass)
  prereqOverrides: Record<string, string[]>;
  // Course requirement removals
  removeWrtg316: boolean;        // default false (remove WRTG 316)
  removeEcon110: boolean;        // default false (remove ECON 110)
  removeMath303: boolean;        // default false (remove MATH 303)
  removeChem464: boolean;        // default false (remove CHEM 464)
  removeStat121: boolean;        // default false (remove STAT 121)
  removeCbeSeminars: boolean;    // default false (remove CBE 191, 291, 391)
  // Student population parameters
  populationMeanCredits: number; // default 14.5
  populationStdDevCredits: number; // default 1.8
  workingPercentage: number;     // default 30% (0.3)
  workPenaltyCredits: number;    // default 2.5 credits
  enableSpringSummer: boolean;   // default false
  // Prerequisite Relaxation Interventions
  prereqMode: 'strict' | 'concurrentCore' | 'waiveMathChem' | 'none'; // default 'strict'
  relaxCbe273To374: boolean;     // default false
  relaxCbe374To376: boolean;     // default false
  relaxCbe376To476: boolean;     // default false
  relaxMath302ToCbe374: boolean; // default false
  relaxChem351ToCbe386: boolean; // default false
}

export interface BottleneckStat {
  courseId: string;
  courseName: string;
  category: CourseCategory;
  timesDelayed: number;
  totalSemestersDelayed: number;
  affectedStudentsCount: number;
  primaryReason: string;
}

export interface SimulationResult {
  cohortSize: number;
  averageGraduationSemesters: number;
  medianGraduationSemesters: number;
  minSemesters: number;
  maxSemesters: number;
  eightSemesterGradRate: number;  // % graduating in <= 8 sem
  tenSemesterGradRate: number;    // % graduating in <= 10 sem
  semesterDistribution: Record<number, number>; // semester -> count of students
  cumulativeGraduation: Array<{ semester: number; rate: number; count: number }>;
  bottlenecks: BottleneckStat[];
  students: Student[];
}

export interface ReferencePlanItem {
  classId: string;
  term: Term;
  semester: number;
}
