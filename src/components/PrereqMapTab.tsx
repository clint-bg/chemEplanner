import React, { useState } from 'react';
import { INITIAL_CURRICULUM_COURSES } from '../data/classDetailsParser';
import { GitFork, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PrereqMapTab: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('005');

  const selectedCourse = INITIAL_CURRICULUM_COURSES.find(c => c.classId === selectedCourseId) || INITIAL_CURRICULUM_COURSES[0];

  // Direct prerequisites
  const directPrereqs = INITIAL_CURRICULUM_COURSES.filter(c => selectedCourse.prereqs.includes(c.classId));

  // Downstream courses (courses that require selectedCourse)
  const downstreamCourses = INITIAL_CURRICULUM_COURSES.filter(c => c.prereqs.includes(selectedCourse.classId));

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-2">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <GitFork className="w-5 h-5 text-[#002E5D]" /> Chemical Engineering Prerequisite Map & Critical Path
        </h2>
        <p className="text-xs text-slate-500">
          Select any course to view its required prerequisites and downstream dependent courses. Critical path courses dictate your overall graduation timeline.
        </p>
      </div>

      {/* Main Flow Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Course Selector List */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">Select Course to Inspect</h3>

          <div className="max-h-[550px] overflow-y-auto space-y-1.5 pr-1">
            {INITIAL_CURRICULUM_COURSES.filter(c => c.category === 'Major').map((course) => {
              const isSelected = course.classId === selectedCourseId;
              return (
                <div
                  key={course.classId}
                  onClick={() => setSelectedCourseId(course.classId)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition text-xs flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-500 font-bold'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="font-mono text-blue-950 font-bold">
                      {course.deptCode} {course.classNumber}
                    </div>
                    <div className="text-slate-700 font-normal line-clamp-1">{course.topic}</div>
                  </div>

                  {course.isCriticalPath && (
                    <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                      Critical Path
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Dependency Tree Diagram */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                {selectedCourse.deptCode} {selectedCourse.classNumber} ({selectedCourse.credits} cr)
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedCourse.topic}</h3>
              <p className="text-xs text-slate-500 mt-1">Typical Year: {selectedCourse.typicalYear} • Offered: {selectedCourse.termsTaught.join(', ')}</p>
            </div>

            {selectedCourse.isCriticalPath && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" /> Critical Path Sequence
              </span>
            )}
          </div>

          {/* Graphical Prerequisite Tree */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Direct Prerequisites */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                Direct Prerequisites ({directPrereqs.length})
              </h4>

              {directPrereqs.length === 0 ? (
                <div className="text-slate-400 italic py-4 text-center">No prerequisites required</div>
              ) : (
                directPrereqs.map((pr) => (
                  <div
                    key={pr.classId}
                    onClick={() => setSelectedCourseId(pr.classId)}
                    className="p-2.5 bg-white rounded border border-slate-200 shadow-sm cursor-pointer hover:border-blue-500 transition"
                  >
                    <div className="font-bold font-mono text-blue-900">{pr.deptCode} {pr.classNumber}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{pr.topic}</div>
                  </div>
                ))
              )}
            </div>

            {/* Selected Course Hub */}
            <div className="bg-[#002E5D] text-white rounded-xl p-4 border border-blue-800 space-y-3 flex flex-col justify-center text-center shadow-md">
              <span className="text-[10px] font-mono text-blue-300 uppercase tracking-wider font-semibold">Active Course Hub</span>
              <div className="text-lg font-extrabold font-mono text-white">
                {selectedCourse.deptCode} {selectedCourse.classNumber}
              </div>
              <div className="text-xs text-slate-200 font-medium">{selectedCourse.topic}</div>
            </div>

            {/* Downstream Dependents */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                Downstream Dependents ({downstreamCourses.length})
              </h4>

              {downstreamCourses.length === 0 ? (
                <div className="text-slate-400 italic py-4 text-center">No dependent courses</div>
              ) : (
                downstreamCourses.map((ds) => (
                  <div
                    key={ds.classId}
                    onClick={() => setSelectedCourseId(ds.classId)}
                    className="p-2.5 bg-white rounded border border-slate-200 shadow-sm cursor-pointer hover:border-blue-500 transition"
                  >
                    <div className="font-bold font-mono text-blue-900">{ds.deptCode} {ds.classNumber}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{ds.topic}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
