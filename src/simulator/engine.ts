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

function calculateCalendarYear(startYear: number, academicYear: number, term: Term): number {
  return term === 'Fall' ? startYear + (academicYear - 1) : startYear + academicYear;
}

export function generateBestGraduationPath(
  targetMaxCredits = 16,
  includeSpringSummer = true,
  selectedElectiveIds: string[] = ['058', '054', '053', '038', '061', '045'], // Default sample electives
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
    neededCoursesMap.set(c.classId, c);
  }

  // Add selected electives and their prerequisite dependencies
  const electiveStack = [...selectedElectiveIds];
  const visitedElectiveIds = new Set<string>();

  while (electiveStack.length > 0) {
    const elId = electiveStack.pop()!;
    if (visitedElectiveIds.has(elId)) continue;
    visitedElectiveIds.add(elId);

    const elCourse = allCoursesMap.get(elId);
    if (elCourse) {
      neededCoursesMap.set(elCourse.classId, elCourse);
      for (const reqId of (elCourse.prereqs || [])) {
        if (!completed.has(reqId) && !neededCoursesMap.has(reqId)) {
          electiveStack.push(reqId);
        }
      }
    }
  }

  let currentSemester = 1;
  const termsSequence: Term[] = ['Fall', 'Winter', 'Spring', 'Summer'];

  let termIndexInSequence = 0;
  const MAX_SEQUENCE_TERMS = 28; // Safety loop cap
  const startYear = new Date().getFullYear(); // Starts at 2026

  let completedRelCredits = 0;
  let completedEngCredits = 0;
  let completedEmsbCredits = 0;
  let completedEpselCredits = 0;

  while (neededCoursesMap.size > 0 && termIndexInSequence < MAX_SEQUENCE_TERMS) {
    const currentTerm = termsSequence[termIndexInSequence % termsSequence.length];
    const academicYear = Math.floor(termIndexInSequence / 4) + 1;
    const calendarYear = calculateCalendarYear(startYear, academicYear, currentTerm);
    const termKey = `${currentTerm} Year ${academicYear}`;

    const isSpringSummerTerm = currentTerm === 'Spring' || currentTerm === 'Summer';
    const isTermDisabled = isSpringSummerTerm && disabledSet.has(termKey);

    let currentTermCredits = 0;
    const termEnrolledCourses: Course[] = [];

    // Mandatory first semester course UNIV 101
    if (currentSemester === 1 && neededCoursesMap.has('091') && !isTermDisabled) {
      const univ101 = neededCoursesMap.get('091')!;
      termEnrolledCourses.push(univ101);
      currentTermCredits += univ101.credits;
      neededCoursesMap.delete('091');
    }

    // Find eligible courses whose prerequisites are satisfied
    const eligibleCourses: Course[] = [];

    if (!isTermDisabled) {
      for (const [classId, course] of neededCoursesMap.entries()) {
        const prereqs = course.prereqs || [];
        const concurrentPrereqs = course.concurrentPrereqs || [];

        const prereqsMet = prereqs.every(reqId => {
          if (completed.has(reqId)) return true;
          if (concurrentPrereqs.includes(reqId)) {
            if (termEnrolledCourses.some(c => c.classId === reqId)) return true;
            const concurrentTarget = neededCoursesMap.get(reqId);
            if (concurrentTarget && isCourseOffered(concurrentTarget, currentTerm, currentSemester, true)) {
              return (concurrentTarget.prereqs || []).every(p => completed.has(p));
            }
          }
          return false;
        });
        const offeredInTerm = isCourseOffered(course, currentTerm, currentSemester, true);

        if (prereqsMet && offeredInTerm) {
          eligibleCourses.push(course);
        }
      }
    }

    // Sort eligible courses by critical path and Spring/Summer priority
    eligibleCourses.sort((a, b) => {
      // WRTG 150 ('092') MUST be taken in Fall Year 1 or Winter Year 1
      if (academicYear === 1 && (currentTerm === 'Fall' || currentTerm === 'Winter')) {
        if (a.classId === '092' && b.classId !== '092') return -1;
        if (b.classId === '092' && a.classId !== '092') return 1;
      }

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

      const prioA = isSpringSummerTerm ? getSpringSummerPriority(a) : getFallWinterPriority(a);
      const prioB = isSpringSummerTerm ? getSpringSummerPriority(b) : getFallWinterPriority(b);

      if (prioA !== prioB) return prioB - prioA;

      const weightA = (downstreamWeights.get(a.classId) || 0) * 10 + (a.category === 'Major' ? 50 : 20);
      const weightB = (downstreamWeights.get(b.classId) || 0) * 10 + (b.category === 'Major' ? 50 : 20);
      return weightB - weightA;
    });

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

  // Post-pass: Enforce minimum 12 credit hours for all Fall/Winter semesters prior to the final graduation semester
  if (schedule.length > 1) {
    const finalTermIdx = schedule.length - 1;

    for (let i = 0; i < finalTermIdx; i++) {
      const termPlan = schedule[i];

      // Only enforce 12+ cr full-time minimum on primary Fall/Winter semesters before the last term
      if (termPlan.term === 'Fall' || termPlan.term === 'Winter') {
        let attempts = 0;

        while (termPlan.totalCredits < 12 && attempts < 10) {
          attempts++;

          // 1. First, attempt to pull courses forward from future terms (j > i)
          let pulledFromFuture = false;
          for (let j = i + 1; j <= finalTermIdx; j++) {
            const futureTerm = schedule[j];
            for (let cIdx = 0; cIdx < futureTerm.courses.length; cIdx++) {
              const candidate = futureTerm.courses[cIdx];

              // Check if candidate prerequisites were completed prior to term i
              const priorCompleted = new Set<string>(completedCourseIds);
              for (let k = 0; k < i; k++) {
                schedule[k].courses.forEach(c => priorCompleted.add(c.classId));
              }

              const prereqsMet = candidate.prereqs.every(reqId => priorCompleted.has(reqId));
              const offeredInTerm = isCourseOffered(candidate, termPlan.term, termPlan.semesterNumber, true);
              const fitsInCap = termPlan.totalCredits + candidate.credits <= targetMaxCredits + 0.5;

              if (prereqsMet && offeredInTerm && fitsInCap) {
                // Move course from futureTerm to termPlan
                futureTerm.courses.splice(cIdx, 1);
                futureTerm.totalCredits -= candidate.credits;

                termPlan.courses.push(candidate);
                termPlan.totalCredits += candidate.credits;
                pulledFromFuture = true;
                break;
              }
            }
            if (pulledFromFuture) break;
          }

          if (!pulledFromFuture) {
            break; // Stop if no further scheduled courses can be pulled forward
          }
        }
      }
    }
  }

  // Determine estimated graduation term from the last non-empty term
  let estimatedGraduationTerm = 'Winter 2031';
  if (schedule.length > 0) {
    const lastTermObj = schedule[schedule.length - 1];
    const finalYear = calculateCalendarYear(startYear, lastTermObj.year, lastTermObj.term);
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
