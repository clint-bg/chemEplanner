import { TermSchedule, Course } from '../simulator/types';

// Helper to escape CSV cell strings (e.g. if title or topic contains commas or quotes)
function escapeCSVCell(val: string | number): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export current semester plan schedule and completed course status to a CSV file.
 */
export function exportPlanToCSV(
  schedule: TermSchedule[],
  completedCourseIds: Set<string>,
  filename = 'BYU_ChemE_Graduation_Plan.csv'
) {
  const headers = [
    'Semester',
    'Term',
    'Year',
    'Course Code',
    'Course Title',
    'Credits',
    'Category',
    'Completed',
    'Course ID'
  ];

  const rows: string[] = [];
  rows.push(headers.join(','));

  schedule.forEach(termPlan => {
    const semName = `Semester ${termPlan.semesterNumber}`;
    termPlan.courses.forEach(course => {
      const isCompleted = completedCourseIds.has(course.classId) ? 'Yes' : 'No';
      const code = `${course.deptCode} ${course.classNumber}`;
      const row = [
        escapeCSVCell(semName),
        escapeCSVCell(termPlan.term),
        escapeCSVCell(termPlan.year),
        escapeCSVCell(code),
        escapeCSVCell(course.topic),
        escapeCSVCell(course.credits),
        escapeCSVCell(course.category),
        escapeCSVCell(isCompleted),
        escapeCSVCell(course.classId)
      ];
      rows.push(row.join(','));
    });
  });

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper to split CSV row line taking quotes into account
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped double quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export interface ParseResult {
  schedule: TermSchedule[];
  completedCourseIds: Set<string>;
  error?: string;
}

/**
 * Parse an uploaded CSV file back into a TermSchedule array and completed course ID set.
 */
export function parsePlanFromCSV(
  csvText: string,
  allCoursesMap: Map<string, Course>
): ParseResult {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return { schedule: [], completedCourseIds: new Set(), error: 'CSV file is empty or missing data rows.' };
  }

  // Parse header
  const headerCols = parseCSVLine(lines[0]).map(h => h.toLowerCase());
  const termIdx = headerCols.findIndex(h => h.includes('term'));
  const yearIdx = headerCols.findIndex(h => h.includes('year'));
  const codeIdx = headerCols.findIndex(h => h.includes('code'));
  const titleIdx = headerCols.findIndex(h => h.includes('title') || h.includes('topic'));
  const creditsIdx = headerCols.findIndex(h => h.includes('credit'));
  const categoryIdx = headerCols.findIndex(h => h.includes('category'));
  const completedIdx = headerCols.findIndex(h => h.includes('complete'));
  const classIdIdx = headerCols.findIndex(h => h.includes('course id') || h.includes('classid') || h.includes('id'));

  const completedSet = new Set<string>();
  const termsMap = new Map<string, TermSchedule>(); // Key: "Fall-1", "Winter-2", etc.

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < 3) continue;

    const rawTerm = (termIdx >= 0 ? row[termIdx] : row[1]) || 'Fall';
    const cleanTerm = (['Fall', 'Winter', 'Spring', 'Summer'].find(t => t.toLowerCase() === rawTerm.trim().toLowerCase()) || 'Fall') as any;
    const yearNum = parseInt((yearIdx >= 0 ? row[yearIdx] : row[2]) || '1', 10) || 1;
    const courseId = classIdIdx >= 0 ? row[classIdIdx] : '';
    const courseCode = codeIdx >= 0 ? row[codeIdx] : '';
    const title = titleIdx >= 0 ? row[titleIdx] : '';
    const credits = parseFloat(creditsIdx >= 0 ? row[creditsIdx] : '3') || 3;
    const isCompletedStr = completedIdx >= 0 ? row[completedIdx].toLowerCase() : '';
    const isCompleted = isCompletedStr === 'yes' || isCompletedStr === 'true' || isCompletedStr === '1';

    // Match course object from catalog map or construct fallback
    let courseObj: Course | undefined;
    if (courseId && allCoursesMap.has(courseId)) {
      courseObj = allCoursesMap.get(courseId);
    } else if (courseCode) {
      const parts = courseCode.trim().split(/\s+/);
      const dept = parts[0];
      const num = parts.slice(1).join(' ');
      for (const c of allCoursesMap.values()) {
        if (c.deptCode.toLowerCase() === dept.toLowerCase() && c.classNumber.toLowerCase() === num.toLowerCase()) {
          courseObj = c;
          break;
        }
      }
    }

    if (!courseObj) {
      const parts = (courseCode || 'CBE 100').trim().split(/\s+/);
      const dept = parts[0] || 'CBE';
      const classNum = parts.slice(1).join(' ') || '100';
      const cat = (categoryIdx >= 0 ? row[categoryIdx] : 'Major') as any;

      courseObj = {
        classId: courseId || `csv_${dept}_${classNum}_${i}`,
        deptCode: dept,
        classNumber: classNum,
        topic: title || courseCode || 'Custom Course',
        credits: credits,
        category: cat || 'Major',
        typicalYear: 'Freshman',
        termsTaught: ['Fall', 'Winter', 'Spring', 'Summer'],
        prereqs: [],
        concurrentPrereqs: [],
        genEdSets: [],
        substitutionAllowed: false,
        substitutionClassIds: [],
        source: 'Custom'
      };
    }

    if (isCompleted && courseObj) {
      completedSet.add(courseObj.classId);
    }

    const termKey = `${cleanTerm}-${yearNum}`;
    let termSchedule = termsMap.get(termKey);
    if (!termSchedule) {
      termSchedule = {
        semesterNumber: termsMap.size + 1,
        year: yearNum,
        term: cleanTerm,
        courses: [],
        totalCredits: 0,
        warnings: []
      };
      termsMap.set(termKey, termSchedule);
    }

    if (courseObj && !termSchedule.courses.some(c => c.classId === courseObj!.classId)) {
      termSchedule.courses.push(courseObj);
      termSchedule.totalCredits += courseObj.credits;
    }
  }

  const scheduleList = Array.from(termsMap.values());
  const termOrderMap: Record<string, number> = { 'Fall': 1, 'Winter': 2, 'Spring': 3, 'Summer': 4 };
  scheduleList.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return (termOrderMap[a.term] || 1) - (termOrderMap[b.term] || 1);
  });

  scheduleList.forEach((t, idx) => {
    t.semesterNumber = idx + 1;
  });

  return {
    schedule: scheduleList,
    completedCourseIds: completedSet
  };
}
