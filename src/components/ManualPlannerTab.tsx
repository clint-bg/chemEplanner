import React, { useState } from 'react';
import { Course, TermSchedule, Term } from '../simulator/types';
import { validateSchedulePrerequisites, auditDegreeRequirements, getAllAvailableCourses } from '../simulator/prereqChecker';
import { Calendar, Plus, Trash2, AlertTriangle, CheckCircle2, Search, ShieldAlert, Check } from 'lucide-react';

interface ManualPlannerTabProps {
  schedule: TermSchedule[];
  setSchedule: React.Dispatch<React.SetStateAction<TermSchedule[]>>;
  completedCourseIds: Set<string>;
  onToggleCompletedCourse: (courseId: string) => void;
}

export const ManualPlannerTab: React.FC<ManualPlannerTabProps> = ({
  schedule,
  setSchedule,
  completedCourseIds,
  onToggleCompletedCourse
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTermIndex, setSelectedTermIndex] = useState<number>(0);

  const allCoursesMap = getAllAvailableCourses();
  const allAvailableCoursesList = Array.from(allCoursesMap.values());

  // Enrolled course IDs
  const enrolledCourseIds = new Set<string>();
  schedule.forEach(term => term.courses.forEach(c => enrolledCourseIds.add(c.classId)));

  // Prerequisite & Offering validation
  const validation = validateSchedulePrerequisites(schedule, allCoursesMap, completedCourseIds);
  const audit = auditDegreeRequirements(completedCourseIds, enrolledCourseIds, allCoursesMap);

  // Add course to term
  const handleAddCourseToTerm = (course: Course, termIdx: number) => {
    if (enrolledCourseIds.has(course.classId)) return;

    const newSchedule = [...schedule];
    const targetTerm = newSchedule[termIdx];
    targetTerm.courses.push(course);
    targetTerm.totalCredits += course.credits;
    setSchedule(newSchedule);
  };

  // Remove course from term
  const handleRemoveCourse = (courseId: string, termIdx: number) => {
    const newSchedule = [...schedule];
    const targetTerm = newSchedule[termIdx];
    const removedCourse = targetTerm.courses.find(c => c.classId === courseId);
    targetTerm.courses = targetTerm.courses.filter(c => c.classId !== courseId);
    if (removedCourse) {
      targetTerm.totalCredits -= removedCourse.credits;
    }
    setSchedule(newSchedule);
  };

  // Add new term to schedule
  const handleAddTerm = () => {
    const nextSem = schedule.length + 1;
    const nextTerm: Term = nextSem % 2 === 1 ? 'Fall' : 'Winter';
    const nextYear = Math.ceil(nextSem / 2);

    setSchedule([
      ...schedule,
      {
        semesterNumber: nextSem,
        year: nextYear,
        term: nextTerm,
        courses: [],
        totalCredits: 0,
        warnings: []
      }
    ]);
  };

  // Delete term from schedule (only if empty)
  const handleDeleteTerm = (termIdx: number) => {
    if (schedule[termIdx].courses.length > 0) return;

    const newSchedule = schedule.filter((_, idx) => idx !== termIdx);
    const renumberedSchedule = newSchedule.map((termPlan, idx) => ({
      ...termPlan,
      semesterNumber: idx + 1,
      year: Math.ceil((idx + 1) / 2)
    }));

    setSchedule(renumberedSchedule);

    if (selectedTermIndex >= renumberedSchedule.length) {
      setSelectedTermIndex(Math.max(0, renumberedSchedule.length - 1));
    }
  };

  // Filter available courses for search drawer
  const filteredCourses = allAvailableCoursesList.filter(c => {
    const text = `${c.deptCode} ${c.classNumber} ${c.topic}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase()) && !enrolledCourseIds.has(c.classId);
  });

  return (
    <div className="space-y-6">
      {/* Header & Live Audit Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#002E5D]" /> Interactive Manual Schedule Planner
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize your schedule. Toggle the checkmark next to any course to mark it completed and view its distinct blue highlight.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
              {completedCourseIds.size} Classes Completed
            </span>

            <button
              onClick={handleAddTerm}
              className="inline-flex items-center text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg shadow transition"
            >
              <Plus className="w-4 h-4 mr-1 text-blue-300" /> Add Semester
            </button>
          </div>
        </div>

        {/* Audit Progress Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Major Core</span>
            <div className="text-sm font-bold text-slate-900">{audit.majorCreditsDone}/{audit.majorCreditsRequired} cr</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex my-1">
              <div className="bg-[#002E5D] h-full" style={{ width: `${Math.min(100, (audit.majorCreditsDone / audit.majorCreditsRequired) * 100)}%` }}></div>
              <div className="bg-blue-300 h-full" style={{ width: `${Math.min(100 - (audit.majorCreditsDone / audit.majorCreditsRequired) * 100, (Math.max(0, audit.majorCreditsEnrolled - audit.majorCreditsDone) / audit.majorCreditsRequired) * 100)}%` }}></div>
            </div>
            <div className="text-[10px] text-slate-500">{audit.majorCreditsEnrolled} cr Planned</div>
            <div className={`text-[10px] font-bold pt-0.5 ${audit.majorSatisfied ? 'text-blue-700' : 'text-amber-600'}`}>
              {audit.majorSatisfied ? '✔ Completed' : audit.majorCreditsEnrolled >= audit.majorCreditsRequired ? 'Plan Ready' : 'In Progress'}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Eng Electives</span>
            <div className="text-sm font-bold text-slate-900">{audit.engElectivesCreditsDone}/{audit.engElectivesCreditsRequired} cr</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex my-1">
              <div className="bg-blue-700 h-full" style={{ width: `${Math.min(100, (audit.engElectivesCreditsDone / audit.engElectivesCreditsRequired) * 100)}%` }}></div>
              <div className="bg-blue-300 h-full" style={{ width: `${Math.min(100 - (audit.engElectivesCreditsDone / audit.engElectivesCreditsRequired) * 100, (Math.max(0, audit.engElectivesCreditsEnrolled - audit.engElectivesCreditsDone) / audit.engElectivesCreditsRequired) * 100)}%` }}></div>
            </div>
            <div className="text-[10px] text-slate-500">{audit.engElectivesCreditsEnrolled} cr Planned</div>
            <div className={`text-[10px] font-bold pt-0.5 ${audit.engElectivesSatisfied ? 'text-blue-700' : 'text-amber-600'}`}>
              {audit.engElectivesSatisfied ? '✔ Completed' : audit.engElectivesCreditsEnrolled >= audit.engElectivesCreditsRequired ? 'Plan Ready' : 'In Progress'}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">EMSB Electives</span>
            <div className="text-sm font-bold text-slate-900">{audit.emsbCreditsDone}/{audit.emsbCreditsRequired} cr</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex my-1">
              <div className="bg-purple-600 h-full" style={{ width: `${Math.min(100, (audit.emsbCreditsDone / audit.emsbCreditsRequired) * 100)}%` }}></div>
              <div className="bg-purple-300 h-full" style={{ width: `${Math.min(100 - (audit.emsbCreditsDone / audit.emsbCreditsRequired) * 100, (Math.max(0, audit.emsbCreditsEnrolled - audit.emsbCreditsDone) / audit.emsbCreditsRequired) * 100)}%` }}></div>
            </div>
            <div className="text-[10px] text-slate-500">{audit.emsbCreditsEnrolled} cr Planned</div>
            <div className={`text-[10px] font-bold pt-0.5 ${audit.emsbSatisfied ? 'text-blue-700' : 'text-amber-600'}`}>
              {audit.emsbSatisfied ? '✔ Completed' : audit.emsbCreditsEnrolled >= audit.emsbCreditsRequired ? 'Plan Ready' : 'In Progress'}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">EPSEL Capstone</span>
            <div className="text-sm font-bold text-slate-900">{audit.epselCreditsDone}/{audit.epselCreditsRequired} cr</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex my-1">
              <div className="bg-amber-600 h-full" style={{ width: `${Math.min(100, (audit.epselCreditsDone / audit.epselCreditsRequired) * 100)}%` }}></div>
              <div className="bg-amber-300 h-full" style={{ width: `${Math.min(100 - (audit.epselCreditsDone / audit.epselCreditsRequired) * 100, (Math.max(0, audit.epselCreditsEnrolled - audit.epselCreditsDone) / audit.epselCreditsRequired) * 100)}%` }}></div>
            </div>
            <div className="text-[10px] text-slate-500">{audit.epselCreditsEnrolled} cr Planned</div>
            <div className={`text-[10px] font-bold pt-0.5 ${audit.epselSatisfied ? 'text-blue-700' : 'text-amber-600'}`}>
              {audit.epselSatisfied ? '✔ Completed' : audit.epselCreditsEnrolled >= audit.epselCreditsRequired ? 'Plan Ready' : 'In Progress'}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">General Ed</span>
            <div className="text-sm font-bold text-slate-900">{audit.genEdCreditsDone}/{audit.genEdCreditsRequired} cr</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex my-1">
              <div className="bg-sky-700 h-full" style={{ width: `${Math.min(100, (audit.genEdCreditsDone / audit.genEdCreditsRequired) * 100)}%` }}></div>
              <div className="bg-sky-300 h-full" style={{ width: `${Math.min(100 - (audit.genEdCreditsDone / audit.genEdCreditsRequired) * 100, (Math.max(0, audit.genEdCreditsEnrolled - audit.genEdCreditsDone) / audit.genEdCreditsRequired) * 100)}%` }}></div>
            </div>
            <div className="text-[10px] text-slate-500">{audit.genEdCreditsEnrolled} cr Planned</div>
            <div className={`text-[10px] font-bold pt-0.5 ${audit.genEdSatisfied ? 'text-blue-700' : 'text-amber-600'}`}>
              {audit.genEdSatisfied ? '✔ Completed' : audit.genEdCreditsEnrolled >= audit.genEdCreditsRequired ? 'Plan Ready' : 'In Progress'}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Religion</span>
            <div className="text-sm font-bold text-slate-900">{audit.religionCreditsDone}/{audit.religionCreditsRequired} cr</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex my-1">
              <div className="bg-indigo-600 h-full" style={{ width: `${Math.min(100, (audit.religionCreditsDone / audit.religionCreditsRequired) * 100)}%` }}></div>
              <div className="bg-indigo-300 h-full" style={{ width: `${Math.min(100 - (audit.religionCreditsDone / audit.religionCreditsRequired) * 100, (Math.max(0, audit.religionCreditsEnrolled - audit.religionCreditsDone) / audit.religionCreditsRequired) * 100)}%` }}></div>
            </div>
            <div className="text-[10px] text-slate-500">{audit.religionCreditsEnrolled} cr Planned</div>
            <div className={`text-[10px] font-bold pt-0.5 ${audit.religionSatisfied ? 'text-blue-700' : 'text-amber-600'}`}>
              {audit.religionSatisfied ? '✔ Completed' : audit.religionCreditsEnrolled >= audit.religionCreditsRequired ? 'Plan Ready' : 'In Progress'}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Alert Banner */}
      {(validation.missingPrereqs.length > 0 || validation.offeringWarnings.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Schedule Warnings Detected ({validation.missingPrereqs.length + validation.offeringWarnings.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-800">
            {validation.missingPrereqs.map((mp, idx) => (
              <div key={idx} className="bg-white/80 p-2 rounded border border-amber-200 flex items-start space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Sem {mp.termIndex} ({mp.courseName}):</strong> Requires missing prerequisite <em>{mp.missingPrereqName}</em> before taking.
                </span>
              </div>
            ))}

            {validation.offeringWarnings.map((ow, idx) => (
              <div key={idx} className="bg-white/80 p-2 rounded border border-amber-200 flex items-start space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Sem {ow.termIndex} ({ow.courseName}):</strong> Course not typically offered in {ow.term}.
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Course Picker Drawer & Terms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Course Search & Picker Drawer */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                <span>Add Courses to Schedule</span>
                <span className="text-xs text-slate-400 font-mono">Target: Sem {selectedTermIndex + 1}</span>
              </h3>

              <div className="mt-2 flex space-x-2">
                <select
                  value={selectedTermIndex}
                  onChange={(e) => setSelectedTermIndex(parseInt(e.target.value))}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-blue-500"
                >
                  {schedule.map((t, idx) => (
                    <option key={idx} value={idx}>
                      Semester {t.semesterNumber}: {t.term} Year {t.year} ({t.totalCredits} cr)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search course code or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Course Search List */}
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 pt-1">
            {filteredCourses.slice(0, 40).map((c) => (
              <div
                key={c.classId}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition flex items-center justify-between"
              >
                <div className="text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-blue-900 bg-blue-100/80 px-1 rounded">
                      {c.deptCode} {c.classNumber}
                    </span>
                    <span className="text-slate-500 font-normal">{c.credits} cr</span>
                  </div>
                  <div className="text-slate-700 font-medium mt-0.5 line-clamp-1">{c.topic}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Offered: {c.termsTaught.join(', ')}</div>
                </div>

                <button
                  onClick={() => handleAddCourseToTerm(c, selectedTermIndex)}
                  className="p-1.5 bg-[#002E5D] hover:bg-blue-800 text-white rounded shadow text-xs flex items-center transition"
                  title="Add to selected term"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Semesters Layout */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedule.map((termPlan, termIdx) => (
              <div
                key={termPlan.semesterNumber}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col justify-between transition ${
                  selectedTermIndex === termIdx ? 'ring-2 ring-blue-600 border-blue-500' : 'border-slate-200'
                }`}
              >
                <div
                  onClick={() => setSelectedTermIndex(termIdx)}
                  className="bg-slate-900 text-white p-3 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase text-blue-300 font-semibold">Semester {termPlan.semesterNumber}</span>
                    <h4 className="font-bold text-sm text-white">{termPlan.term} Year {termPlan.year}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold font-mono bg-slate-800 text-blue-300 px-2 py-1 rounded border border-slate-700">
                      {termPlan.totalCredits} cr
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTerm(termIdx);
                      }}
                      disabled={termPlan.courses.length > 0}
                      className={`p-1 rounded transition flex items-center justify-center ${
                        termPlan.courses.length === 0
                          ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer'
                          : 'text-slate-600 opacity-30 cursor-not-allowed'
                      }`}
                      title={
                        termPlan.courses.length === 0
                          ? 'Delete empty semester'
                          : 'Remove all courses first to delete semester'
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 space-y-2 min-h-[140px]">
                  {termPlan.courses.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                      No courses added yet.
                    </div>
                  ) : (
                    termPlan.courses.map((c) => {
                      const isCompleted = completedCourseIds.has(c.classId);
                      return (
                        <div
                          key={c.classId}
                          className={`p-2.5 rounded-lg border transition text-xs flex items-center justify-between shadow-xs ${
                            isCompleted
                              ? 'bg-blue-100/90 border-blue-300 ring-1 ring-blue-400/50 text-blue-950 font-medium'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-2">
                            <button
                              onClick={() => onToggleCompletedCourse(c.classId)}
                              className={`p-1 rounded-full transition flex items-center justify-center shrink-0 ${
                                isCompleted
                                  ? 'bg-[#002E5D] text-white shadow-xs hover:bg-blue-800'
                                  : 'bg-white border border-slate-300 text-slate-300 hover:border-blue-500 hover:text-blue-500'
                              }`}
                              title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>

                            <div className="space-y-0.5 min-w-0">
                              <div className="font-bold flex items-center gap-1.5 flex-wrap">
                                <span className={`font-mono px-1.5 py-0.5 rounded text-[11px] ${
                                  isCompleted ? 'bg-blue-200/90 text-blue-950 font-bold' : 'bg-blue-100/80 text-blue-900'
                                }`}>
                                  {c.deptCode} {c.classNumber}
                                </span>
                                <span className="text-slate-500 font-normal">{c.credits} cr</span>
                                {isCompleted && (
                                  <span className="text-[10px] font-bold text-blue-900 bg-blue-200 px-1.5 py-0.2 rounded-full border border-blue-300">
                                    Done
                                  </span>
                                )}
                              </div>
                              <div className={`font-medium line-clamp-1 ${isCompleted ? 'text-blue-950 font-semibold' : 'text-slate-700'}`}>
                                {c.topic}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveCourse(c.classId, termIdx)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition shrink-0"
                            title="Remove course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
                  <span>{termPlan.courses.length} courses</span>
                  <button
                    onClick={() => setSelectedTermIndex(termIdx)}
                    className="text-[#002E5D] hover:underline font-semibold"
                  >
                    Select for Adding
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
