import { Course, TermSchedule, Term, RequirementAudit } from './types';
import { INITIAL_CURRICULUM_COURSES } from '../data/classDetailsParser';
import { CATEGORIZED_ELECTIVES } from '../data/electivesCatalog';
import { isCourseOffered } from './engine';

export const LAB_COREQUISITES: Record<string, string> = {
  '013': '017', // CBE 285 (Fluids lab) coreq with CBE 374 (Fluids lecture)
  '015': '021', // CBE 345 (Reactions lab) coreq with CBE 386 (Reactions lecture)
  '020': '018', // CBE 385 (Heat & mass lab) coreq with CBE 376 (Heat transfer)
  '024': '026', // CBE 445 (Separations lab) coreq with CBE 476 (Separations)
};

export function getAllAvailableCourses(customElectives: Course[] = []): Map<string, Course> {
  const map = new Map<string, Course>();
  for (const c of INITIAL_CURRICULUM_COURSES) {
    map.set(c.classId, c);
  }
  for (const c of CATEGORIZED_ELECTIVES) {
    if (!map.has(c.classId)) {
      map.set(c.classId, c);
    }
  }
  for (const c of customElectives) {
    map.set(c.classId, c);
  }
  return map;
}

export function validateSchedulePrerequisites(
  schedule: TermSchedule[],
  allCoursesMap: Map<string, Course>,
  priorCompletedCourseIds: Set<string> = new Set()
): {
  missingPrereqs: { courseId: string; courseName: string; missingPrereqId: string; missingPrereqName: string; termIndex: number }[];
  offeringWarnings: { courseId: string; courseName: string; term: Term; termIndex: number }[];
} {
  const missingPrereqs: { courseId: string; courseName: string; missingPrereqId: string; missingPrereqName: string; termIndex: number }[] = [];
  const offeringWarnings: { courseId: string; courseName: string; term: Term; termIndex: number }[] = [];

  const completedCourseIds = new Set<string>(priorCompletedCourseIds);

  schedule.forEach((termPlan, termIndex) => {
    const currentTermCourseIds = new Set(termPlan.courses.map(c => c.classId));

    for (const course of termPlan.courses) {
      // Check offering term per classdetails.csv / BYU catalog rules
      const isOffered = isCourseOffered(course, termPlan.term, termPlan.semesterNumber, true);
      if (!isOffered) {
        offeringWarnings.push({
          courseId: course.classId,
          courseName: `${course.deptCode} ${course.classNumber} - ${course.topic}`,
          term: termPlan.term,
          termIndex: termIndex + 1
        });
      }

      // Check prerequisites
      for (const reqId of course.prereqs) {
        const isCompletedEarlier = completedCourseIds.has(reqId);

        // Check if allowed concurrently in same term
        const isConcurrentInSameTerm = course.concurrentPrereqs && course.concurrentPrereqs.includes(reqId) && currentTermCourseIds.has(reqId);
        
        // Check corequisites
        const isCoreqLab = LAB_COREQUISITES[course.classId] === reqId && currentTermCourseIds.has(reqId);

        if (!isCompletedEarlier && !isConcurrentInSameTerm && !isCoreqLab) {
          const reqCourse = allCoursesMap.get(reqId);
          const reqName = reqCourse ? `${reqCourse.deptCode} ${reqCourse.classNumber} (${reqCourse.topic})` : reqId;

          missingPrereqs.push({
            courseId: course.classId,
            courseName: `${course.deptCode} ${course.classNumber}`,
            missingPrereqId: reqId,
            missingPrereqName: reqName,
            termIndex: termIndex + 1
          });
        }
      }
    }

    // Add current term courses to completed set for subsequent terms
    for (const c of termPlan.courses) {
      completedCourseIds.add(c.classId);
    }
  });

  return { missingPrereqs, offeringWarnings };
}

export function auditDegreeRequirements(
  completedCourseIds: Set<string> = new Set(),
  allEnrolledCourseIds: Set<string> = new Set(),
  allCoursesMap: Map<string, Course> = new Map(),
  relRequired = 14,
  engRequired = 9,
  emsbRequired = 4,
  epselRequired = 3
): RequirementAudit {
  const coursesMap = (!allCoursesMap || allCoursesMap.size === 0) ? getAllAvailableCourses() : allCoursesMap;
  const totalPlannedCourseIds = new Set<string>([...completedCourseIds, ...allEnrolledCourseIds]);

  let majorCreditsDone = 0;
  let majorCreditsEnrolled = 0;

  let engElectivesCreditsDone = 0;
  let engElectivesCreditsEnrolled = 0;

  let emsbCreditsDone = 0;
  let emsbCreditsEnrolled = 0;

  let epselCreditsDone = 0;
  let epselCreditsEnrolled = 0;

  let genEdCreditsDone = 0;
  let genEdCreditsEnrolled = 0;

  let religionCreditsDone = 0;
  let religionCreditsEnrolled = 0;

  const majorRequiredCourses = INITIAL_CURRICULUM_COURSES.filter(c => c.category === 'Major');
  const majorTotalRequiredCredits = majorRequiredCourses.reduce((sum, c) => sum + c.credits, 0);

  const completedMajorIds = new Set<string>();
  const plannedMajorIds = new Set<string>();

  for (const id of totalPlannedCourseIds) {
    const course = coursesMap.get(id);
    if (!course) continue;

    const isMarkedCompleted = completedCourseIds.has(id);

    if (course.category === 'Major') {
      plannedMajorIds.add(course.classId);
      majorCreditsEnrolled += course.credits;
      if (isMarkedCompleted) {
        completedMajorIds.add(course.classId);
        majorCreditsDone += course.credits;
      }
    } else if (course.category === 'Eng') {
      engElectivesCreditsEnrolled += course.credits;
      if (isMarkedCompleted) engElectivesCreditsDone += course.credits;
    } else if (course.category === 'EMSB') {
      emsbCreditsEnrolled += course.credits;
      if (isMarkedCompleted) emsbCreditsDone += course.credits;
    } else if (course.category === 'EPSEL') {
      epselCreditsEnrolled += course.credits;
      if (isMarkedCompleted) epselCreditsDone += course.credits;
    } else if (course.category === 'Gen') {
      genEdCreditsEnrolled += course.credits;
      if (isMarkedCompleted) genEdCreditsDone += course.credits;
    } else if (course.category === 'Rel') {
      religionCreditsEnrolled += course.credits;
      if (isMarkedCompleted) religionCreditsDone += course.credits;
    }
  }

  const unmetRequirements: string[] = [];

  const majorSatisfied = majorRequiredCourses.every(c => {
    if (completedMajorIds.has(c.classId)) return true;
    if (c.substitutionAllowed && c.substitutionClassIds.some(subId => completedCourseIds.has(subId))) return true;
    return false;
  });

  const majorEnrolledSatisfied = majorRequiredCourses.every(c => {
    if (plannedMajorIds.has(c.classId)) return true;
    if (c.substitutionAllowed && c.substitutionClassIds.some(subId => totalPlannedCourseIds.has(subId))) return true;
    return false;
  });

  if (!majorSatisfied) {
    const missingMajorCount = majorRequiredCourses.filter(c => !completedMajorIds.has(c.classId)).length;
    unmetRequirements.push(`${missingMajorCount} major core course(s) not yet marked completed`);
  }

  const engElectivesSatisfied = engElectivesCreditsDone >= engRequired;
  const engElectivesEnrolledSatisfied = engElectivesCreditsEnrolled >= engRequired;
  if (!engElectivesSatisfied) {
    unmetRequirements.push(`Engineering Electives: ${engElectivesCreditsDone}/${engRequired} cr completed`);
  }

  const emsbSatisfied = emsbCreditsDone >= emsbRequired;
  const emsbEnrolledSatisfied = emsbCreditsEnrolled >= emsbRequired;
  if (!emsbSatisfied) {
    unmetRequirements.push(`EMSB Electives: ${emsbCreditsDone}/${emsbRequired} cr completed`);
  }

  const epselSatisfied = epselCreditsDone >= epselRequired;
  const epselEnrolledSatisfied = epselCreditsEnrolled >= epselRequired;
  if (!epselSatisfied) {
    unmetRequirements.push(`EPSEL Electives: ${epselCreditsDone}/${epselRequired} cr completed`);
  }

  const genEdSatisfied = genEdCreditsDone >= 14;
  const genEdEnrolledSatisfied = genEdCreditsEnrolled >= 14;
  if (!genEdSatisfied) {
    unmetRequirements.push(`General Education: ${genEdCreditsDone}/14 cr completed`);
  }

  const religionSatisfied = religionCreditsDone >= relRequired;
  const religionEnrolledSatisfied = religionCreditsEnrolled >= relRequired;
  if (!religionSatisfied) {
    unmetRequirements.push(`Religion: ${religionCreditsDone}/${relRequired} cr completed`);
  }

  const overallSatisfied = majorSatisfied && engElectivesSatisfied && emsbSatisfied && epselSatisfied && genEdSatisfied && religionSatisfied;
  const overallEnrolledSatisfied = majorEnrolledSatisfied && engElectivesEnrolledSatisfied && emsbEnrolledSatisfied && epselEnrolledSatisfied && genEdEnrolledSatisfied && religionEnrolledSatisfied;

  return {
    majorSatisfied,
    majorCreditsDone,
    majorCreditsEnrolled,
    majorCreditsRequired: majorTotalRequiredCredits,

    engElectivesSatisfied,
    engElectivesCreditsDone,
    engElectivesCreditsEnrolled,
    engElectivesCreditsRequired: engRequired,

    emsbSatisfied,
    emsbCreditsDone,
    emsbCreditsEnrolled,
    emsbCreditsRequired: emsbRequired,

    epselSatisfied,
    epselCreditsDone,
    epselCreditsEnrolled,
    epselCreditsRequired: epselRequired,

    genEdSatisfied,
    genEdCreditsDone,
    genEdCreditsEnrolled,
    genEdCreditsRequired: 14,

    religionSatisfied,
    religionCreditsDone,
    religionCreditsEnrolled,
    religionCreditsRequired: relRequired,

    overallSatisfied,
    overallEnrolledSatisfied,
    unmetRequirements
  };
}
