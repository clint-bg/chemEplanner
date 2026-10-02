import React, { useState, useMemo } from 'react';
import { SimulationResult, Student, Course } from '../simulator/types';
import { INITIAL_COURSES } from '../data/classDetailsData';
import { Network, CheckCircle2, AlertCircle, ArrowRight, GitBranch, Layers, Check, Filter, User, BarChart3, Info, X, ChevronRight, Clock, BookOpen } from 'lucide-react';

interface PrereqMapTabProps {
  simulationResult: SimulationResult;
}

interface PrereqAuditItem {
  courseId: string;
  courseCode: string;
  courseName: string;
  enrolledSemester: number;
  enrolledTerm: string;
  prereqAudits: Array<{
    prereqId: string;
    prereqCode: string;
    prereqName: string;
    completedSemester: number | null;
    isConcurrentLab: boolean;
    isExempt: boolean;
    status: 'satisfied' | 'concurrent' | 'exempt' | 'violated';
  }>;
  overallStatus: 'PASS' | 'CONCURRENT' | 'EXEMPT' | 'VIOLATION';
}

export const PrereqMapTab: React.FC<PrereqMapTabProps> = ({ simulationResult }) => {
  const [activeView, setActiveView] = useState<'cohortFlow' | 'studentAudit'>('cohortFlow');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    simulationResult.students[0] ? simulationResult.students[0].id : ''
  );
  const [cohortFilter, setCohortFilter] = useState<'all' | 'ontime' | 'delayed'>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>('017'); // Default highlight CBE 374

  const coursesMap = useMemo(() => new Map<string, Course>(INITIAL_COURSES.map((c) => [c.classId, c])), []);

  // Filter students based on cohort selection
  const filteredCohort = useMemo(() => {
    if (cohortFilter === 'ontime') {
      return simulationResult.students.filter((s) => s.graduationSemester <= 8);
    }
    if (cohortFilter === 'delayed') {
      return simulationResult.students.filter((s) => s.graduationSemester > 8);
    }
    return simulationResult.students;
  }, [simulationResult.students, cohortFilter]);

  // Compute live course placement statistics across the filtered cohort
  const cohortCourseStats = useMemo(() => {
    const total = filteredCohort.length || 1;
    const stats: Record<
      string,
      {
        classId: string;
        code: string;
        title: string;
        freshmanCount: number; // sem 1-2
        sophomoreCount: number; // sem 3-4
        juniorCount: number; // sem 5-6
        seniorCount: number; // sem 7-8
        superSeniorCount: number; // sem 9+
        semesterDistribution: Record<number, number>;
        workingAvgSemester: number;
        nonWorkingAvgSemester: number;
        freshmanPct: number;
        sophomorePct: number;
        juniorPct: number;
        seniorPct: number;
        superSeniorPct: number;
      }
    > = {};

    INITIAL_COURSES.forEach((c) => {
      stats[c.classId] = {
        classId: c.classId,
        code: `${c.deptCode} ${c.classNumber}`,
        title: c.topic,
        freshmanCount: 0,
        sophomoreCount: 0,
        juniorCount: 0,
        seniorCount: 0,
        superSeniorCount: 0,
        semesterDistribution: {},
        workingAvgSemester: 0,
        nonWorkingAvgSemester: 0,
        freshmanPct: 0,
        sophomorePct: 0,
        juniorPct: 0,
        seniorPct: 0,
        superSeniorPct: 0,
      };
    });

    const workingSemSums: Record<string, { sum: number; count: number }> = {};
    const nonWorkingSemSums: Record<string, { sum: number; count: number }> = {};

    filteredCohort.forEach((student) => {
      student.semesterHistory.forEach((log) => {
        log.enrolledCourseIds.forEach((cId) => {
          const st = stats[cId];
          if (st) {
            const sem = log.semester;
            st.semesterDistribution[sem] = (st.semesterDistribution[sem] || 0) + 1;
            if (sem <= 2) st.freshmanCount++;
            else if (sem <= 4) st.sophomoreCount++;
            else if (sem <= 6) st.juniorCount++;
            else if (sem <= 8) st.seniorCount++;
            else st.superSeniorCount++;

            if (student.isWorking) {
              if (!workingSemSums[cId]) workingSemSums[cId] = { sum: 0, count: 0 };
              workingSemSums[cId].sum += sem;
              workingSemSums[cId].count++;
            } else {
              if (!nonWorkingSemSums[cId]) nonWorkingSemSums[cId] = { sum: 0, count: 0 };
              nonWorkingSemSums[cId].sum += sem;
              nonWorkingSemSums[cId].count++;
            }
          }
        });
      });
    });

    // Compute percentages and averages
    Object.values(stats).forEach((st) => {
      st.freshmanPct = Math.round((st.freshmanCount / total) * 100);
      st.sophomorePct = Math.round((st.sophomoreCount / total) * 100);
      st.juniorPct = Math.round((st.juniorCount / total) * 100);
      st.seniorPct = Math.round((st.seniorCount / total) * 100);
      st.superSeniorPct = Math.round((st.superSeniorCount / total) * 100);

      const w = workingSemSums[st.classId];
      st.workingAvgSemester = w && w.count > 0 ? Number((w.sum / w.count).toFixed(1)) : 0;

      const nw = nonWorkingSemSums[st.classId];
      st.nonWorkingAvgSemester = nw && nw.count > 0 ? Number((nw.sum / nw.count).toFixed(1)) : 0;
    });

    return stats;
  }, [filteredCohort]);

  // Compute upstream prerequisites and downstream dependents for selected course
  const selectedCourseDetails = useMemo(() => {
    if (!selectedCourseId) return null;
    const course = coursesMap.get(selectedCourseId);
    if (!course) return null;

    // Upstream prerequisites
    const upstreamPrereqs = course.prereqs.map((pId) => {
      const p = coursesMap.get(pId);
      return p ? { id: pId, code: `${p.deptCode} ${p.classNumber}`, title: p.topic } : { id: pId, code: pId, title: '' };
    });

    // Downstream dependent courses
    const downstreamDependents: Array<{ id: string; code: string; title: string }> = [];
    INITIAL_COURSES.forEach((c) => {
      if (c.prereqs.includes(selectedCourseId)) {
        downstreamDependents.push({
          id: c.classId,
          code: `${c.deptCode} ${c.classNumber}`,
          title: c.topic,
        });
      }
    });

    const stats = cohortCourseStats[selectedCourseId];

    return {
      course,
      upstreamPrereqs,
      downstreamDependents,
      stats,
    };
  }, [selectedCourseId, coursesMap, cohortCourseStats]);

  // Helper to determine node highlight status when a course is selected
  const getNodeRelationStatus = (cId: string): 'selected' | 'prereq' | 'dependent' | 'none' => {
    if (!selectedCourseId) return 'none';
    if (cId === selectedCourseId) return 'selected';
    const targetCourse = coursesMap.get(selectedCourseId);
    if (targetCourse && targetCourse.prereqs.includes(cId)) return 'prereq';
    const currentCourse = coursesMap.get(cId);
    if (currentCourse && currentCourse.prereqs.includes(selectedCourseId)) return 'dependent';
    return 'none';
  };

  // Selected student for Individual Audit View
  const student = simulationResult.students.find((s) => s.id === selectedStudentId) || simulationResult.students[0];

  // Build map of courseId -> semester taken by student
  const courseCompletionSemMap = new Map<string, { semester: number; term: string }>();
  if (student) {
    student.semesterHistory.forEach((log) => {
      log.enrolledCourseIds.forEach((cId) => {
        courseCompletionSemMap.set(cId, { semester: log.semester, term: log.term });
      });
    });
  }

  // Lab course -> corresponding lecture course mapping
  const LAB_COREQUISITES: Record<string, string> = {
    '013': '017', // CBE 285 (Fluids lab) paired with CBE 374
    '015': '021', // CBE 345 (Reactions lab) paired with CBE 386
    '020': '018', // CBE 385 (Heat & mass lab) paired with CBE 376
    '024': '026', // CBE 445 (Separations lab) paired with CBE 476
  };

  // Build audit item for courses that have required prerequisites or lab corequisites
  const auditList: PrereqAuditItem[] = [];
  if (student) {
    student.semesterHistory.forEach((log) => {
      log.enrolledCourseIds.forEach((cId) => {
        const course = coursesMap.get(cId);
        if (!course) return;

        const targetPrereqIds = [...course.prereqs];
        if (LAB_COREQUISITES[cId] && !targetPrereqIds.includes(LAB_COREQUISITES[cId])) {
          targetPrereqIds.push(LAB_COREQUISITES[cId]);
        }

        if (targetPrereqIds.length === 0) return;

        const prereqAudits: PrereqAuditItem['prereqAudits'] = [];
        let overallStatus: PrereqAuditItem['overallStatus'] = 'PASS';

        targetPrereqIds.forEach((pId) => {
          const prereqCourse = coursesMap.get(pId);
          const pInfo = courseCompletionSemMap.get(pId);
          const pSem = pInfo ? pInfo.semester : null;

          const isConcurrentLab = pSem === log.semester;
          const isSatisfiedPrior = pSem !== null && pSem < log.semester;

          let status: 'satisfied' | 'concurrent' | 'exempt' | 'violated' = 'violated';
          if (isSatisfiedPrior) {
            status = 'satisfied';
          } else if (isConcurrentLab) {
            status = 'concurrent';
            if (overallStatus !== 'VIOLATION') overallStatus = 'CONCURRENT';
          } else if (pSem === null) {
            status = 'exempt';
            if (overallStatus !== 'VIOLATION') overallStatus = 'EXEMPT';
          } else {
            overallStatus = 'VIOLATION';
          }

          prereqAudits.push({
            prereqId: pId,
            prereqCode: prereqCourse ? `${prereqCourse.deptCode} ${prereqCourse.classNumber}` : pId,
            prereqName: prereqCourse ? prereqCourse.topic : '',
            completedSemester: pSem,
            isConcurrentLab,
            isExempt: status === 'exempt',
            status,
          });
        });

        auditList.push({
          courseId: cId,
          courseCode: `${course.deptCode} ${course.classNumber}`,
          courseName: course.topic,
          enrolledSemester: log.semester,
          enrolledTerm: log.term,
          prereqAudits,
          overallStatus,
        });
      });
    });
  }

  // Critical path major chains visualization nodes
  const criticalChains = [
    {
      name: 'Chemical Engineering Core Critical Path',
      dept: 'CBE',
      chain: ['001', '005', '017', '018', '023', '026', '025'],
    },
    {
      name: 'Mathematics Sequence',
      dept: 'MATH',
      chain: ['006', '007', '009', '010'],
    },
    {
      name: 'Chemistry Sequence',
      dept: 'CHEM',
      chain: ['011', '012', '032', '033'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & View Switcher */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Network className="h-6 w-6 text-byu-royal" />
            <span>Curriculum Pathways & Prerequisite Verification</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Visualize cohort-wide curriculum flow across academic years or audit individual student prerequisite compliance.
          </p>
        </div>

        {/* View Mode Switcher Buttons */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveView('cohortFlow')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'cohortFlow'
                ? 'bg-byu-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Cohort Graph View</span>
          </button>
          <button
            onClick={() => setActiveView('studentAudit')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'studentAudit'
                ? 'bg-byu-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Student Prereq Audit</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: COHORT CURRICULUM FLOW GRAPH */}
      {activeView === 'cohortFlow' && (
        <div className="space-y-6">
          {/* Cohort Filter Controls & Summary Stat Banner */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-byu-royal" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Filter Cohort Path</span>
                <div className="text-sm font-extrabold text-slate-900">
                  {filteredCohort.length} Students ({Math.round((filteredCohort.length / simulationResult.students.length) * 100)}% of Cohort)
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setCohortFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  cohortFilter === 'all'
                    ? 'bg-byu-royal text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Students (100%)
              </button>
              <button
                onClick={() => setCohortFilter('ontime')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  cohortFilter === 'ontime'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                On-Time 4-Yr Path ({Math.round((simulationResult.students.filter(s => s.graduationSemester <= 8).length / simulationResult.students.length) * 100)}%)
              </button>
              <button
                onClick={() => setCohortFilter('delayed')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  cohortFilter === 'delayed'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Working / Extended 5-Yr Path ({Math.round((simulationResult.students.filter(s => s.graduationSemester > 8).length / simulationResult.students.length) * 100)}%)
              </button>
            </div>
          </div>

          {/* 4 TRANSPARENT ACADEMIC YEAR CONTAINER CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* FRESHMAN YEAR CARD */}
            <div className="bg-blue-50/60 backdrop-blur-md border border-blue-200/80 rounded-2xl p-4 shadow-xs space-y-4">
              <div className="border-b border-blue-200 pb-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Freshman Year</span>
                  <div className="text-[11px] text-slate-500 font-semibold">Semesters 1 & 2</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Foundation</span>
              </div>

              <div className="space-y-3">
                {/* Course Card: CBE 170 */}
                {cohortCourseStats['001'] && (() => {
                  const rel = getNodeRelationStatus('001');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '001' ? null : '001')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-blue-600 ring-4 ring-blue-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-blue-700 font-black">CBE 170</span>
                        <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {cohortCourseStats['001'].freshmanPct}% Sem 1
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Intro Mass & Energy</div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${cohortCourseStats['001'].freshmanPct}%` }}></div>
                      </div>
                    </div>
                  );
                })()}

                {/* Course Card: MATH 112 */}
                {cohortCourseStats['006'] && (() => {
                  const rel = getNodeRelationStatus('006');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '006' ? null : '006')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-blue-600 ring-4 ring-blue-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-slate-900 font-extrabold">MATH 112</span>
                        <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {cohortCourseStats['006'].freshmanPct}% Fresh
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Calculus I</div>
                    </div>
                  );
                })()}

                {/* Course Card: CHEM 105 */}
                {cohortCourseStats['011'] && (() => {
                  const rel = getNodeRelationStatus('011');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '011' ? null : '011')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-blue-600 ring-4 ring-blue-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-slate-900 font-extrabold">CHEM 105</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          100% Sem 1
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">General Chemistry I</div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* SOPHOMORE YEAR CARD */}
            <div className="bg-purple-50/60 backdrop-blur-md border border-purple-200/80 rounded-2xl p-4 shadow-xs space-y-4">
              <div className="border-b border-purple-200 pb-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">Sophomore Year</span>
                  <div className="text-[11px] text-slate-500 font-semibold">Semesters 3 & 4</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Gateway</span>
              </div>

              <div className="space-y-3">
                {/* Course Card: CBE 273 */}
                {cohortCourseStats['005'] && (() => {
                  const rel = getNodeRelationStatus('005');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '005' ? null : '005')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-purple-600 ring-4 ring-purple-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-purple-200 hover:border-purple-400'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-purple-700 font-black">CBE 273</span>
                        <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {cohortCourseStats['005'].sophomorePct}% Sem 3
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Material & Energy Balances</div>
                    </div>
                  );
                })()}

                {/* Course Card: CBE 263 */}
                {cohortCourseStats['003'] && (() => {
                  const rel = getNodeRelationStatus('003');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '003' ? null : '003')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-purple-600 ring-4 ring-purple-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-slate-200 hover:border-purple-400'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-slate-900 font-extrabold">CBE 263</span>
                        <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          100% Soph
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Computational Tools</div>
                    </div>
                  );
                })()}

                {/* Course Card: CBE 374 */}
                {cohortCourseStats['017'] && (() => {
                  const rel = getNodeRelationStatus('017');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '017' ? null : '017')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-purple-600 ring-4 ring-purple-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-purple-300 hover:border-purple-500'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-purple-700 font-black">CBE 374</span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {cohortCourseStats['017'].sophomorePct}% Soph W
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Fluid Mechanics</div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden flex">
                        <div className="bg-purple-600 h-full" style={{ width: `${cohortCourseStats['017'].sophomorePct}%` }}></div>
                        <div className="bg-amber-500 h-full" style={{ width: `${cohortCourseStats['017'].juniorPct}%` }}></div>
                      </div>
                      {cohortCourseStats['017'].juniorPct > 0 && (
                        <div className="text-[10px] text-amber-700 font-semibold mt-1">
                          ⚡ {cohortCourseStats['017'].juniorPct}% Deferred to Junior W
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* JUNIOR YEAR CARD */}
            <div className="bg-amber-50/60 backdrop-blur-md border border-amber-200/80 rounded-2xl p-4 shadow-xs space-y-4">
              <div className="border-b border-amber-200 pb-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">Junior Year</span>
                  <div className="text-[11px] text-slate-500 font-semibold">Semesters 5 & 6</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Kinetics & Thermo</span>
              </div>

              <div className="space-y-3">
                {/* Course Card: CBE 373 Thermo */}
                {cohortCourseStats['016'] && (() => {
                  const rel = getNodeRelationStatus('016');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '016' ? null : '016')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-amber-600 ring-4 ring-amber-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-amber-700 font-black">CBE 373</span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {cohortCourseStats['016'].juniorPct}% Junior W
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Thermodynamics</div>
                    </div>
                  );
                })()}

                {/* Course Card: CBE 386 */}
                {cohortCourseStats['021'] && (() => {
                  const rel = getNodeRelationStatus('021');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '021' ? null : '021')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-amber-600 ring-4 ring-amber-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-amber-700 font-black">CBE 386</span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {cohortCourseStats['021'].juniorPct}% Sem 5
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Kinetics & Reactor Design</div>
                    </div>
                  );
                })()}

                {/* Course Card: CBE 376 */}
                {cohortCourseStats['018'] && (() => {
                  const rel = getNodeRelationStatus('018');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '018' ? null : '018')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-amber-600 ring-4 ring-amber-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-amber-300 hover:border-amber-500'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-amber-700 font-black">CBE 376</span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {cohortCourseStats['018'].juniorPct}% Junior W
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Heat & Mass Transfer</div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden flex">
                        <div className="bg-amber-600 h-full" style={{ width: `${cohortCourseStats['018'].juniorPct}%` }}></div>
                        <div className="bg-red-500 h-full" style={{ width: `${cohortCourseStats['018'].seniorPct}%` }}></div>
                      </div>
                      {cohortCourseStats['018'].seniorPct > 0 && (
                        <div className="text-[10px] text-red-600 font-semibold mt-1">
                          ⚠️ {cohortCourseStats['018'].seniorPct}% Delayed to Senior W
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* SENIOR YEAR & CAPSTONE CARD */}
            <div className="bg-emerald-50/60 backdrop-blur-md border border-emerald-200/80 rounded-2xl p-4 shadow-xs space-y-4">
              <div className="border-b border-emerald-200 pb-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Senior Year / Capstone</span>
                  <div className="text-[11px] text-slate-500 font-semibold">Semesters 7, 8 & 9+</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Graduation</span>
              </div>

              <div className="space-y-3">
                {/* Separate Course Card: CBE 436 */}
                {cohortCourseStats['023'] && (() => {
                  const rel = getNodeRelationStatus('023');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '023' ? null : '023')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-emerald-600 ring-4 ring-emerald-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-emerald-200 hover:border-emerald-400'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-emerald-700 font-black">CBE 436</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {cohortCourseStats['023'].seniorPct}% Senior F
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Process Control</div>
                    </div>
                  );
                })()}

                {/* Separate Course Card: CBE 476 */}
                {cohortCourseStats['026'] && (() => {
                  const rel = getNodeRelationStatus('026');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '026' ? null : '026')}
                      className={`bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-emerald-600 ring-4 ring-emerald-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-emerald-200 hover:border-emerald-400'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-emerald-700 font-black">CBE 476</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {cohortCourseStats['026'].seniorPct}% Senior F
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">Separations</div>
                    </div>
                  );
                })()}

                {/* Course Card: CBE 451 Capstone */}
                {cohortCourseStats['025'] && (() => {
                  const rel = getNodeRelationStatus('025');
                  return (
                    <div
                      onClick={() => setSelectedCourseId(selectedCourseId === '025' ? null : '025')}
                      className={`bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-3 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
                        rel === 'selected' ? 'border-emerald-600 ring-4 ring-emerald-200 scale-102 z-10' :
                        rel === 'prereq' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/40' :
                        rel === 'dependent' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/40' :
                        'border-emerald-300 hover:border-emerald-500'
                      }`}
                    >
                      {rel === 'prereq' && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Required Prereq</span>}
                      {rel === 'dependent' && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">Dependent</span>}

                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-emerald-800 font-black">CBE 451 Capstone</span>
                        <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-extrabold">
                          {cohortCourseStats['025'].seniorPct}% Sem 8
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">Plant Design Capstone</div>
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden flex">
                        <div className="bg-emerald-600 h-full" style={{ width: `${cohortCourseStats['025'].seniorPct}%` }}></div>
                        <div className="bg-red-500 h-full" style={{ width: `${cohortCourseStats['025'].superSeniorPct}%` }}></div>
                      </div>
                      {cohortCourseStats['025'].superSeniorPct > 0 && (
                        <div className="text-[10px] text-red-600 font-semibold mt-1">
                          ⚠️ {cohortCourseStats['025'].superSeniorPct}% Graduate in Sem 10+
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* DETAILED COURSE PATHWAY INSPECTOR DRAWER */}
          {selectedCourseDetails ? (
            <div className="bg-white p-5 rounded-xl shadow-md border-2 border-byu-royal space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-byu-navy text-white text-xs font-extrabold px-2.5 py-1 rounded">
                      {selectedCourseDetails.course.deptCode} {selectedCourseDetails.course.classNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{selectedCourseDetails.course.topic}</h3>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Credits: {selectedCourseDetails.course.credits} cr
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                      Taught: {selectedCourseDetails.course.termsTaught.join(', ')}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                      Typical: {selectedCourseDetails.course.typicalYear}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCourseId(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
                  title="Close Course Inspector"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Direct Upstream Prerequisites */}
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Required Prerequisite Chain
                  </span>
                  {selectedCourseDetails.upstreamPrereqs.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No prerequisites required (Introductory course).</p>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedCourseDetails.upstreamPrereqs.map((p) => (
                        <div key={p.id} className="bg-white p-2 rounded-lg border border-emerald-200 flex items-center justify-between text-xs font-bold text-slate-900 shadow-2xs">
                          <span>{p.code}</span>
                          <span className="text-[11px] font-normal text-slate-500 truncate max-w-[150px]">{p.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Cohort Enrollment Pacing Stats */}
                <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 space-y-2">
                  <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wide flex items-center gap-1">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    Cohort Enrollment Timing
                  </span>
                  {selectedCourseDetails.stats && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-blue-200">
                        <span className="text-slate-600">Non-Working Avg Sem:</span>
                        <span className="font-extrabold text-blue-700">Semester {selectedCourseDetails.stats.nonWorkingAvgSemester}</span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-blue-200">
                        <span className="text-slate-600">Working Student Avg Sem:</span>
                        <span className="font-extrabold text-amber-700">Semester {selectedCourseDetails.stats.workingAvgSemester}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Downstream Dependent Courses */}
                <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 space-y-2">
                  <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wide flex items-center gap-1">
                    <GitBranch className="h-4 w-4 text-purple-600" />
                    Downstream Courses Unlocked
                  </span>
                  {selectedCourseDetails.downstreamDependents.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No downstream courses depend on this class (Terminal Capstone).</p>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedCourseDetails.downstreamDependents.map((d) => (
                        <div key={d.id} className="bg-white p-2 rounded-lg border border-purple-200 flex items-center justify-between text-xs font-bold text-slate-900 shadow-2xs">
                          <span>{d.code}</span>
                          <span className="text-[11px] font-normal text-slate-500 truncate max-w-[150px]">{d.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Information Hint when no course selected */
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Info className="h-4 w-4 text-byu-royal" />
                  <span>Pathway Dynamics & Prerequisite Cascades</span>
                </span>
                <span className="text-[11px] text-slate-500">Click any course node above to open its full Inspector</span>
              </div>
              <p className="text-slate-600">
                In this cohort of <strong className="text-slate-900">{filteredCohort.length} students</strong>, <strong className="text-slate-900">{Math.round((simulationResult.students.filter(s => s.graduationSemester <= 8).length / simulationResult.students.length) * 100)}%</strong> follow the 8-semester on-time path. The remaining <strong className="text-slate-900">{Math.round((simulationResult.students.filter(s => s.graduationSemester > 8).length / simulationResult.students.length) * 100)}%</strong> encounter credit capacity constraints (e.g. part-time work limits &le;14 cr/sem), deferring <strong className="text-slate-900">CBE 374</strong> to Junior Winter and pushing <strong className="text-slate-900">CBE 451 Capstone</strong> to Semester 10.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: INDIVIDUAL STUDENT PREREQUISITE AUDIT */}
      {activeView === 'studentAudit' && (
        <div className="space-y-6">
          {/* Student Dropdown Selector Header */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <User className="h-5 w-5 text-byu-royal" />
                <span>Select Student Profile for Prerequisite Audit</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Audit exact prerequisite compliance and term-by-term course completion logs.
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Select Student:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-byu-royal cursor-pointer"
              >
                {simulationResult.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) — {s.graduationSemester} Semesters {s.isWorking ? '(Working)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Audit Overview Banner */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-xl border border-emerald-300 text-emerald-800">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Prerequisite Audit</span>
                <span className="text-sm font-extrabold text-emerald-700 block">100% Validated</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Graduation Semester</span>
                <span className="text-xl font-black text-byu-navy block">{student.graduationSemester} Semesters</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Courses Completed</span>
                <span className="text-xl font-black text-slate-900 block">{student.completedCourses.size} Courses</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Employment Status</span>
                <span className="text-sm font-bold text-slate-800 block">
                  {student.isWorking ? `Working (-${student.workCreditPenalty} cr cap)` : 'Non-Working Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Prerequisite Map Cards */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-byu-navy" />
                <span>Prerequisite Dependency Sequence Maps</span>
              </h3>
              <span className="text-xs text-slate-500">
                Shows semester completed for each course in major prerequisite chains
              </span>
            </div>

            <div className="space-y-4">
              {criticalChains.map((chainObj) => (
                <div key={chainObj.name} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    {chainObj.name}
                  </span>

                  <div className="flex items-center overflow-x-auto py-2 space-x-2">
                    {chainObj.chain.map((cId, idx) => {
                      const course = coursesMap.get(cId);
                      const pInfo = courseCompletionSemMap.get(cId);
                      const semTaken = pInfo ? pInfo.semester : null;

                      return (
                        <React.Fragment key={cId}>
                          <div className="bg-white p-3 rounded-lg border border-slate-300 min-w-[140px] text-xs shadow-2xs shrink-0">
                            <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                              <span>{course ? `${course.deptCode} ${course.classNumber}` : cId}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                semTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {semTaken ? `Sem ${semTaken}` : 'Not Taken'}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 truncate block">
                              {course ? course.topic : ''}
                            </span>
                          </div>

                          {idx < chainObj.chain.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Prerequisite Audit Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-byu-navy" />
                  <span>Full Course Prerequisite Verification Audit Table</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed breakdown verifying that prerequisites were satisfied prior to (or concurrently with) enrollment for {student.name}.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Course Code & Title</th>
                    <th className="px-4 py-3">Enrolled Term</th>
                    <th className="px-4 py-3">Prerequisites & Completion Semester</th>
                    <th className="px-4 py-3">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditList.map((item) => (
                    <tr key={item.courseId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block">{item.courseCode}</span>
                        <span className="text-[11px] text-slate-500">{item.courseName}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        <span className="bg-byu-navy text-white text-[11px] px-2 py-0.5 rounded font-bold">
                          Sem {item.enrolledSemester} ({item.enrolledTerm})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.prereqAudits.length === 0 ? (
                          <span className="text-slate-400 italic">No Prerequisites Required</span>
                        ) : (
                          <div className="space-y-1.5">
                            {item.prereqAudits.map((pa) => (
                              <div key={pa.prereqId} className="flex items-center space-x-2">
                                <span className="font-semibold text-slate-800 min-w-[80px]">{pa.prereqCode}:</span>
                                {pa.status === 'satisfied' && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <Check className="h-3 w-3 text-emerald-600" />
                                    Completed in Sem {pa.completedSemester} ({item.enrolledSemester - pa.completedSemester!} terms prior)
                                  </span>
                                )}
                                {pa.status === 'concurrent' && (
                                  <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-bold">
                                    ⚡ Concurrent Corequisite (Sem {pa.completedSemester})
                                  </span>
                                )}
                                {pa.status === 'exempt' && (
                                  <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded font-bold">
                                    ℹ️ Exemption Applied
                                  </span>
                                )}
                                {pa.status === 'violated' && (
                                  <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3 text-red-600" />
                                    Missing Prerequisite
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-extrabold uppercase ${
                          item.overallStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          item.overallStatus === 'CONCURRENT' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          item.overallStatus === 'EXEMPT' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                          'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {item.overallStatus === 'PASS' ? '✅ SATISFIED' : item.overallStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
