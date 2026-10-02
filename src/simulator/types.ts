export type Term = 'Fall' | 'Winter' | 'Spring' | 'Summer';
export type CourseCategory = 'Major' | 'Eng' | 'EMSB' | 'EPSEL' | 'Gen' | 'Rel';

export type SubjectCategory =
  | 'Catalysis & Reaction Engineering'
  | 'Polymers & Soft Matter'
  | 'Semiconductors & Microelectronics'
  | 'Numerical Methods & Simulation'
  | 'Nuclear Engineering'
  | 'Computation & Data Science'
  | 'Biomedical & Biological Engineering'
  | 'Energy & Environmental Engineering'
  | 'Energy & Transport Phenomena'
  | 'Materials & Nanoscience'
  | 'Business, Leadership & Management';

export interface Course {
  classId: string;
  classNumber: string;
  deptCode: string;
  typicalYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | string;
  credits: number;
  topic: string;
  termsTaught: Term[];
  prereqs: string[]; // List of classIDs
  concurrentPrereqs: string[]; // List of classIDs allowed concurrently
  category: CourseCategory;
  genEdSets: string[];
  substitutionAllowed: boolean;
  substitutionClassIds: string[];
  abetCategory?: string;
  isCriticalPath?: boolean;
  subjectCategories?: SubjectCategory[];
  description?: string;
  source?: 'Curriculum' | 'BYU Catalog Crawler' | 'Custom';
}

export interface TermSchedule {
  semesterNumber: number; // 1, 2, 3...
  year: number; // 1, 2, 3, 4, 5
  term: Term;
  courses: Course[];
  totalCredits: number;
  warnings: string[];
}

export interface StudentPlan {
  studentId: string;
  studentName: string;
  targetMaxCreditsPerTerm: number;
  includeSpringSummer: boolean;
  selectedElectiveIds: string[];
  completedCourseIds: string[];
  schedule: TermSchedule[];
  estimatedGraduationTerm: string; // e.g. "Winter 2028"
  totalTerms: number;
  totalCreditsCompleted: number;
  requirementsStatus: RequirementAudit;
}

export interface RequirementAudit {
  majorSatisfied: boolean;
  majorCreditsDone: number;
  majorCreditsEnrolled: number;
  majorCreditsRequired: number;

  engElectivesSatisfied: boolean;
  engElectivesCreditsDone: number;
  engElectivesCreditsEnrolled: number;
  engElectivesCreditsRequired: number;

  emsbSatisfied: boolean;
  emsbCreditsDone: number;
  emsbCreditsEnrolled: number;
  emsbCreditsRequired: number;

  epselSatisfied: boolean;
  epselCreditsDone: number;
  epselCreditsEnrolled: number;
  epselCreditsRequired: number;

  genEdSatisfied: boolean;
  genEdCreditsDone: number;
  genEdCreditsEnrolled: number;
  genEdCreditsRequired: number;

  religionSatisfied: boolean;
  religionCreditsDone: number;
  religionCreditsEnrolled: number;
  religionCreditsRequired: number;

  overallSatisfied: boolean;
  overallEnrolledSatisfied: boolean;
  unmetRequirements: string[];
}

export interface PrereqCheckResult {
  valid: boolean;
  missingPrereqs: { courseId: string; courseName: string; missingPrereqId: string; missingPrereqName: string }[];
  concurrentAllowed: { courseId: string; prereqId: string }[];
  offeringWarnings: { courseId: string; courseName: string; term: Term }[];
  creditOverload: boolean;
}

export interface Interventions {
  offeringOverrides: Record<string, Term[]>;
  relCreditsRequired: number; // default 14
  engCreditsRequired: number; // default 9
  emsbCreditsRequired: number; // default 4
  epselCreditsRequired: number; // default 3
  genEdSet: 1 | 2;
  creditOverrides: Record<string, number>;
  prereqOverrides: Record<string, string[]>;
  populationMeanCredits: number;
  populationStdDevCredits: number;
  enableSpringSummer: boolean;
}
