import { Course, TermSchedule, Term, StudentPlan, RequirementAudit } from './types';
import { INITIAL_CURRICULUM_COURSES } from '../data/classDetailsParser';
import { CATEGORIZED_ELECTIVES } from '../data/electivesCatalog';
import { auditDegreeRequirements, getAllAvailableCourses } from './prereqChecker';

// Downstream dependency depth for prioritizing critical path major courses
function computeDownstreamWeights(coursesMap: Map<string, Course>): Map<string, number> {
  const weightMap = new Map<string, number>();

  for (const [id] of coursesMap.entries()) {
    const dependents = new Set<string>();
    const stack = [id];

    while (stack.length > 0) {
      const current = stack.pop()!;
      for (const [otherId, otherCourse] of coursesMap.entries()) {
        if (otherCourse.prereqs.includes(current) && !dependents.has(otherId)) {
          dependents.add(otherId);
          stack.push(otherId);
        }
      }
    }
    weightMap.set(id, dependents.size);
  }
  return weightMap;
}

export function isCourseOffered(c: Course, currentTerm: Term, sem: number, includeSpringSummer = true): boolean {
  // Check if currentTerm is explicitly listed in termsTaught (per classdetails.csv / BYU catalog)
  for (const t of c.termsTaught) {
    if (t === currentTerm || t.startsWith(currentTerm)) {
      if (t.toLowerCase().includes('every other')) {
        const academicYear = Math.ceil(sem / 2);
        return academicYear % 2 === 1;
      }
      return true;
    }
  }

  // General Education and Religion courses are broadly offered in Spring/Summer
  if (includeSpringSummer && (currentTerm === 'Spring' || currentTerm === 'Summer')) {
    if (c.category === 'Gen' || c.category === 'Rel') {
      return true;
    }
  }

  return false;
}

function calculateCalendarYear(startYear: number, sequenceIndex: number): number {
  // 4 terms per year: Fall (year), Winter (year + 1), Spring (year + 1), Summer (year + 1)
  return startYear + Math.floor((sequenceIndex + 3) / 4);
}

export function generateBestGraduationPath(
  targetMaxCredits = 15,
  includeSpringSummer = true,
  selectedElectiveIds: string[] = ['058', '054', '045', '038'], // Default sample electives
  completedCourseIds: string[] = [],
  disabledSpringSummerTerms: string[] = [] // e.g. ['Spring Year 1', 'Summer Year 1']
): StudentPlan {
  const allCoursesMap = getAllAvailableCourses();
  const downstreamWeights = computeDownstreamWeights(allCoursesMap);

  const completed = new Set<string>(completedCourseIds);
  const disabledSet = new Set<string>(disabledSpringSummerTerms);
  const schedule: TermSchedule[] = [];

  // Determine needed courses list
  const neededCoursesMap = new Map<string, Course>();

  // Add Major & Gen Ed & Core Religion courses
  for (const c of INITIAL_CURRICULUM_COURSES) {
    if (!completed.has(c.classId)) {
      neededCoursesMap.set(c.classId, c);
    }
  }

  // Add selected electives
  for (const elId of selectedElectiveIds) {
    const elCourse = allCoursesMap.get(elId);
    if (elCourse && !completed.has(elCourse.classId)) {
      neededCoursesMap.set(elCourse.classId, elCourse);
    }
  }

  let currentSemester = 1;
  const termsSequence: Term[] = ['Fall', 'Winter', 'Spring', 'Summer'];

  let termIndexInSequence = 0;
  const MAX_SEQUENCE_TERMS = 28; // Safety loop cap
  const startYear = 2024;

  let completedRelCredits = 0;
  let completedEngCredits = 0;
  let completedEmsbCredits = 0;
  let completedEpselCredits = 0;

  while (neededCoursesMap.size > 0 && termIndexInSequence < MAX_SEQUENCE_TERMS) {
    const currentTerm = termsSequence[termIndexInSequence % termsSequence.length];
    const calendarYear = calculateCalendarYear(startYear, termIndexInSequence);
    const academicYear = Math.floor(termIndexInSequence / 4) + 1;
    const termKey = `${currentTerm} Year ${academicYear}`;

    const isSpringSummerTerm = currentTerm === 'Spring' || currentTerm === 'Summer';
    const isTermDisabled = isSpringSummerTerm && disabledSet.has(termKey);

    // Find eligible courses whose prerequisites are satisfied
    const eligibleCourses: Course[] = [];

    if (!isTermDisabled) {
      for (const [classId, course] of neededCoursesMap.entries()) {
        const prereqsMet = course.prereqs.every(reqId => completed.has(reqId));
        const offeredInTerm = isCourseOffered(course, currentTerm, currentSemester, true);

        if (prereqsMet && offeredInTerm) {
          eligibleCourses.push(course);
        }
      }
    }

    // Sort eligible courses by critical path and Spring/Summer priority
    eligibleCourses.sort((a, b) => {
      if (isSpringSummerTerm) {
        // In Spring and Summer terms:
        // 1. Courses explicitly taught in Spring/Summer (like CBE 378 Material Science in Spring) -> TOP Priority!
        // 2. Gen Ed, Religion, EMSB, and Elective courses
        const getSpringSummerPriority = (c: Course) => {
          const isExplicitlyTaught = c.termsTaught.some(t => t.startsWith(currentTerm));
          if (isExplicitlyTaught) {
            return 200 + (downstreamWeights.get(c.classId) || 0) * 10;
          }
          if (c.category === 'Gen') return 100;
          if (c.category === 'Rel') return 90;
          if (c.category === 'EMSB') return 80;
          if (c.category === 'Eng') return 70;
          return 10;
        };
        const prioA = getSpringSummerPriority(a);
        const prioB = getSpringSummerPriority(b);
        if (prioA !== prioB) return prioB - prioA;
      } else {
        // In Fall and Winter terms:
        // Major courses ONLY taught in Fall/Winter take highest priority.
        // Major courses also taught in Spring (like CBE 378) have slightly lower Fall priority so they can be deferred to Spring.
        const getFallWinterPriority = (c: Course) => {
          if (c.category === 'Major') {
            const isOnlyTaughtInFallWinter = !c.termsTaught.some(t => t.startsWith('Spring') || t.startsWith('Summer'));
            if (isOnlyTaughtInFallWinter) {
              return 150 + (downstreamWeights.get(c.classId) || 0) * 10;
            }
            return 85 + (downstreamWeights.get(c.classId) || 0) * 10;
          }
          if (c.category === 'EPSEL') return 80;
          if (c.category === 'Eng') return 60;
          if (c.category === 'EMSB') return 50;
          if (c.category === 'Rel') return 20; // Lower priority in Fall/Winter so it moves to Spring/Summer
          if (c.category === 'Gen') return 10; // Lower priority in Fall/Winter so it moves to Spring/Summer
          return 0;
        };
        const prioA = getFallWinterPriority(a);
        const prioB = getFallWinterPriority(b);
        if (prioA !== prioB) return prioB - prioA;
      }

      const weightA = (downstreamWeights.get(a.classId) || 0) * 10 + (a.category === 'Major' ? 50 : 20);
      const weightB = (downstreamWeights.get(b.classId) || 0) * 10 + (b.category === 'Major' ? 50 : 20);
      return weightB - weightA;
    });

    let currentTermCredits = 0;
    const termEnrolledCourses: Course[] = [];

    // Mandatory first semester course UNIV 101
    if (currentSemester === 1 && neededCoursesMap.has('091') && !isTermDisabled) {
      const univ101 = neededCoursesMap.get('091')!;
      termEnrolledCourses.push(univ101);
      currentTermCredits += univ101.credits;
      neededCoursesMap.delete('091');
    }

    if (!isTermDisabled) {
      // Set term credit cap (Halve target max credit hours for Spring/Summer terms: full time Spring/Summer is 6+ cr vs 12+ cr Fall/Winter)
      const termCreditLimit = isSpringSummerTerm ? targetMaxCredits / 2 : targetMaxCredits;

      for (const course of eligibleCourses) {
        if (termEnrolledCourses.some(c => c.classId === course.classId)) continue;

        // Check credit cap
        if (currentTermCredits + course.credits <= termCreditLimit + 0.5) {
          termEnrolledCourses.push(course);
          currentTermCredits += course.credits;
          neededCoursesMap.delete(course.classId);

          if (course.category === 'Rel') completedRelCredits += course.credits;
          else if (course.category === 'Eng') completedEngCredits += course.credits;
          else if (course.category === 'EMSB') completedEmsbCredits += course.credits;
          else if (course.category === 'EPSEL') completedEpselCredits += course.credits;
        }
      }
    }

    // Only add term to schedule if courses were enrolled or if it's a primary Fall/Winter term
    if (termEnrolledCourses.length > 0 || !isSpringSummerTerm) {
      // Mark enrolled courses completed
      for (const c of termEnrolledCourses) {
        completed.add(c.classId);
      }

      schedule.push({
        semesterNumber: currentSemester,
        year: academicYear,
        term: currentTerm,
        courses: termEnrolledCourses,
        totalCredits: currentTermCredits,
        warnings: []
      });

      currentSemester++;
    }

    termIndexInSequence++;
  }

  // Determine estimated graduation term from the last non-empty term
  let estimatedGraduationTerm = 'Winter 2028';
  if (schedule.length > 0) {
    const lastTermObj = schedule[schedule.length - 1];
    let lastSeqIdx = 0;
    for (let i = 0; i < termIndexInSequence; i++) {
      const termName = termsSequence[i % termsSequence.length];
      if (termName === lastTermObj.term) {
        lastSeqIdx = i;
      }
    }
    const finalYear = calculateCalendarYear(startYear, lastSeqIdx);
    estimatedGraduationTerm = `${lastTermObj.term} ${finalYear}`;
  }

  const initialCompletedSet = new Set<string>(completedCourseIds);
  const enrolledCourseIds = new Set<string>();
  schedule.forEach(term => term.courses.forEach(c => enrolledCourseIds.add(c.classId)));

  const reqAudit = auditDegreeRequirements(initialCompletedSet, enrolledCourseIds, allCoursesMap);

  return {
    studentId: 'STUDENT-AUTOMATED-PATH',
    studentName: 'Chemical Engineering Student',
    targetMaxCreditsPerTerm: targetMaxCredits,
    includeSpringSummer,
    selectedElectiveIds,
    completedCourseIds,
    schedule,
    estimatedGraduationTerm,
    totalTerms: schedule.length,
    totalCreditsCompleted: Array.from(completed).reduce((sum, id) => sum + (allCoursesMap.get(id)?.credits || 0), 0),
    requirementsStatus: reqAudit
  };
}
