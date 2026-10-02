import React, { useState, useMemo } from 'react';
import { SimulationResult, Student } from '../simulator/types';
import { INITIAL_COURSES } from '../data/classDetailsData';
import { Users, Search, Filter, Briefcase, GraduationCap, Clock, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

interface StudentInspectorTabProps {
  simulationResult: SimulationResult;
}

export const StudentInspectorTab: React.FC<StudentInspectorTabProps> = ({ simulationResult }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    simulationResult.students[0] ? simulationResult.students[0].id : ''
  );
  const [filterGradSem, setFilterGradSem] = useState<string>('all');
  const [filterWorking, setFilterWorking] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const coursesMap = new Map(INITIAL_COURSES.map((c) => [c.classId, c]));

  // Sample 50 random students from the simulation cohort for inspector display
  const sampledCohort = useMemo(() => {
    if (simulationResult.students.length <= 50) return simulationResult.students;

    const copy = [...simulationResult.students];
    const shuffled = copy.sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
      const hashA = (numA * 9301 + 49297) % 233280;
      const hashB = (numB * 9301 + 49297) % 233280;
      return hashA - hashB;
    });

    return shuffled.slice(0, 50).sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });
  }, [simulationResult.students]);

  // Filter sampled student cohort
  const filteredStudents = useMemo(() => {
    return sampledCohort.filter((student) => {
      if (filterGradSem === '8' && student.graduationSemester! > 8) return false;
      if (filterGradSem === '10' && student.graduationSemester! !== 10) return false;
      if (filterGradSem === 'gt10' && student.graduationSemester! <= 10) return false;

      if (filterWorking === 'working' && !student.isWorking) return false;
      if (filterWorking === 'notWorking' && student.isWorking) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return student.name.toLowerCase().includes(q) || student.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [sampledCohort, filterGradSem, filterWorking, searchQuery]);

  const selectedStudent = sampledCohort.find((s) => s.id === selectedStudentId) || filteredStudents[0] || sampledCohort[0];

  const studentCreditsBreakdown = useMemo(() => {
    if (!selectedStudent) return { total: 0, gen: 0, rel: 0, eng: 0, emsb: 0, epsel: 0, major: 0, abetEng: 0, abetSci: 0 };
    let total = 0, gen = 0, rel = 0, eng = 0, emsb = 0, epsel = 0, major = 0;
    let abetEng = 0, abetSci = 0;
    for (const classId of selectedStudent.completedCourses) {
      const c = coursesMap.get(classId);
      if (!c) continue;
      total += c.credits;
      if (c.category === 'Gen') gen += c.credits;
      else if (c.category === 'Rel') rel += c.credits;
      else if (c.category === 'Eng') eng += c.credits;
      else if (c.category === 'EMSB') emsb += c.credits;
      else if (c.category === 'EPSEL') epsel += c.credits;
      else if (c.category === 'Major') major += c.credits;

      if (c.abetCategory === 'Eng') abetEng += c.credits;
      else if (c.abetCategory === 'Sci') abetSci += c.credits;
    }
    return { total, gen, rel, eng, emsb, epsel, major, abetEng, abetSci };
  }, [selectedStudent, coursesMap]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="h-6 w-6 text-byu-royal" />
          <span>Student Cohort Inspector & Transcript Trace</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Inspect a representative sample of 50 students from the 250-student Monte Carlo simulation cohort. View detailed term-by-term schedules, credit load limits, and exact bottleneck points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student List & Filters */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[750px]">
          <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search student ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-byu-royal"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Graduation Time</label>
                <select
                  value={filterGradSem}
                  onChange={(e) => setFilterGradSem(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                >
                  <option value="all">All Semesters</option>
                  <option value="8">8 Semesters or less</option>
                  <option value="10">Exactly 10 Semesters</option>
                  <option value="gt10">11+ Semesters</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Employment</label>
                <select
                  value={filterWorking}
                  onChange={(e) => setFilterWorking(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                >
                  <option value="all">All Students</option>
                  <option value="working">Working Only</option>
                  <option value="notWorking">Non-Working Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredStudents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No students match filter criteria</div>
            ) : (
              filteredStudents.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`w-full text-left p-3 flex items-center justify-between transition-colors ${
                    selectedStudent?.id === st.id ? 'bg-byu-royal/10 border-l-4 border-byu-royal' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{st.name}</span>
                      {st.isWorking && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
                          <Briefcase className="h-2.5 w-2.5" /> Work
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Max Credits: {st.effectiveCreditLimit} hrs/sem
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      st.graduationSemester! <= 8 ? 'bg-emerald-100 text-emerald-800' :
                      st.graduationSemester! <= 10 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {(st.graduationSemester! / 2).toFixed(1)} Yrs
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Detailed Transcript & Timeline */}
        {selectedStudent ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Student Profile Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {selectedStudent.id}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-byu-royal" />
                      Preferred Load: <strong>{selectedStudent.maxCreditHours} hrs</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-amber-600" />
                      Working: <strong>{selectedStudent.isWorking ? `Yes (-${selectedStudent.workCreditPenalty} hrs)` : 'No'}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Effective Capacity: <strong>{selectedStudent.effectiveCreditLimit} hrs/sem</strong>
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center self-start md:self-auto min-w-[160px]">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Total Time to Graduation</span>
                  <span className="text-2xl font-black text-byu-navy">{(selectedStudent.graduationSemester! / 2).toFixed(1)} Years</span>
                  <span className="text-[11px] text-slate-500 font-medium block">({selectedStudent.graduationSemester} Semesters)</span>
                </div>
              </div>

              {/* Category & ABET Credit Breakdown */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  Completed Credit Hours & ABET Accreditation Breakdown
                </span>

                {/* Degree Core & Major Hours */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2">
                  <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-600 block uppercase">Total Credits</span>
                    <span className="text-base font-black text-slate-900">{studentCreditsBreakdown.total} cr</span>
                  </div>
                  <div className="bg-byu-navy/10 p-2.5 rounded-lg border border-byu-royal/30 text-center">
                    <span className="text-[10px] font-bold text-byu-navy block uppercase">Major Hours</span>
                    <span className="text-base font-black text-byu-navy">{studentCreditsBreakdown.major} cr</span>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 block uppercase">Gen Ed</span>
                    <span className="text-base font-black text-emerald-900">{studentCreditsBreakdown.gen} cr</span>
                  </div>
                  <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-200 text-center">
                    <span className="text-[10px] font-bold text-indigo-700 block uppercase">Religion</span>
                    <span className="text-base font-black text-indigo-900">{studentCreditsBreakdown.rel} cr</span>
                  </div>
                </div>

                {/* Electives & ABET Accreditation Categories */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 text-center">
                    <span className="text-[10px] font-bold text-blue-700 block uppercase">Eng Electives</span>
                    <span className="text-base font-black text-blue-900">{studentCreditsBreakdown.eng} cr</span>
                  </div>
                  <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-700 block uppercase">EMSB</span>
                    <span className="text-base font-black text-amber-900">{studentCreditsBreakdown.emsb} cr</span>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg border border-purple-200 text-center">
                    <span className="text-[10px] font-bold text-purple-700 block uppercase">EPSEL</span>
                    <span className="text-base font-black text-purple-900">{studentCreditsBreakdown.epsel} cr</span>
                  </div>
                  <div className="bg-sky-50 p-2 rounded-lg border border-sky-300 text-center">
                    <span className="text-[10px] font-bold text-sky-800 block uppercase">ABET Eng</span>
                    <span className="text-base font-black text-sky-950">{studentCreditsBreakdown.abetEng} cr</span>
                  </div>
                  <div className="bg-teal-50 p-2 rounded-lg border border-teal-300 text-center">
                    <span className="text-[10px] font-bold text-teal-800 block uppercase">ABET Sci</span>
                    <span className="text-base font-black text-teal-950">{studentCreditsBreakdown.abetSci} cr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Semester-by-Semester Timeline */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider text-byu-navy border-b border-slate-200 pb-2">
                Term-by-Term Course Enrolment Timeline
              </h4>

              <div className="space-y-4">
                {selectedStudent.semesterHistory.map((semLog) => (
                  <div key={semLog.semester} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="bg-byu-navy text-white text-xs font-bold px-2.5 py-1 rounded">
                          Semester {semLog.semester} ({semLog.term})
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Total Credits Enrolled: <strong className="text-slate-900">{semLog.totalCredits} hrs</strong>
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Cap: {semLog.targetCreditLimit} hrs
                      </span>
                    </div>

                    {/* Course List Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {semLog.enrolledCourseIds.map((cId) => {
                        const course = coursesMap.get(cId);
                        return (
                          <div key={cId} className="bg-white p-2.5 rounded border border-slate-200 text-xs shadow-2xs">
                            <div className="flex items-center justify-between font-bold text-slate-800">
                              <span>{course ? `${course.deptCode} ${course.classNumber}` : cId}</span>
                              <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">
                                {course ? `${course.credits} cr` : ''}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                              {course ? course.topic : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottleneck Callouts */}
                    {semLog.bottleneckNotes && semLog.bottleneckNotes.length > 0 && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800 space-y-1">
                        {semLog.bottleneckNotes.map((note, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
