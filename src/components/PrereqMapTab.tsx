import React, { useState, useMemo } from 'react';
import { INITIAL_CURRICULUM_COURSES } from '../data/classDetailsParser';
import { CATEGORIZED_ELECTIVES } from '../data/electivesCatalog';
import { getAllAvailableCourses } from '../simulator/prereqChecker';
import { Course } from '../simulator/types';
import { GitFork, ShieldAlert, Search, BookOpen, Layers } from 'lucide-react';

export const PrereqMapTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<'major' | 'electives'>('major');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('005');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allCoursesMap = useMemo(() => getAllAvailableCourses(), []);
  const allCoursesList = useMemo(() => Array.from(allCoursesMap.values()), [allCoursesMap]);

  // Selected course object lookup
  const selectedCourse = useMemo(() => {
    return allCoursesMap.get(selectedCourseId) || INITIAL_CURRICULUM_COURSES[0];
  }, [allCoursesMap, selectedCourseId]);

  // Direct prerequisites lookup across all courses
  const directPrereqs = useMemo(() => {
    if (!selectedCourse || !selectedCourse.prereqs) return [];
    return selectedCourse.prereqs
      .map(id => allCoursesMap.get(id))
      .filter((c): c is Course => c !== undefined);
  }, [selectedCourse, allCoursesMap]);

  // Downstream dependent courses lookup across all courses
  const downstreamCourses = useMemo(() => {
    if (!selectedCourse) return [];
    return allCoursesList.filter(c => c.prereqs && c.prereqs.includes(selectedCourse.classId));
  }, [selectedCourse, allCoursesList]);

  // Filtered course list for left panel based on viewMode & searchQuery
  const displayedCourses = useMemo(() => {
    const baseList = viewMode === 'major'
      ? INITIAL_CURRICULUM_COURSES.filter(c => c.category === 'Major')
      : CATEGORIZED_ELECTIVES;

    const q = searchQuery.trim().toLowerCase();
    if (!q) return baseList;

    return baseList.filter(c =>
      c.deptCode.toLowerCase().includes(q) ||
      c.classNumber.toLowerCase().includes(q) ||
      c.topic.toLowerCase().includes(q)
    );
  }, [viewMode, searchQuery]);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const targetCourse = allCoursesMap.get(courseId);
    if (targetCourse) {
      if (targetCourse.category === 'Major') {
        setViewMode('major');
      } else {
        setViewMode('electives');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-2">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <GitFork className="w-5 h-5 text-[#002E5D]" /> Chemical Engineering Prerequisite Map & Critical Path
        </h2>
        <p className="text-xs text-slate-500">
          Select any course to view its required prerequisites and downstream dependent courses. Toggle between CBE Major Courses and Elective Courses using the selector below.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Selector & Course List */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 flex flex-col h-full">
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-800 text-sm">Select Course to Inspect</h3>

            {/* Major vs Electives Selector Toggle */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('major')}
                className={`py-1.5 rounded-md transition flex items-center justify-center gap-1.5 ${
                  viewMode === 'major'
                    ? 'bg-[#002E5D] text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Major Core
              </button>
              <button
                type="button"
                onClick={() => setViewMode('electives')}
                className={`py-1.5 rounded-md transition flex items-center justify-center gap-1.5 ${
                  viewMode === 'electives'
                    ? 'bg-[#002E5D] text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Elective Courses
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={viewMode === 'major' ? "Search major courses (e.g. 467, CHEM)..." : "Search electives (e.g. 535, BIO)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Scrollable Course Selection Cards */}
          <div className="max-h-[620px] min-h-[350px] overflow-y-auto space-y-1.5 pr-1 pt-1 flex-1">
            {displayedCourses.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-6 text-center">
                No courses match "{searchQuery}"
              </div>
            ) : (
              displayedCourses.map((course) => {
                const isSelected = course.classId === selectedCourseId;
                return (
                  <div
                    key={course.classId}
                    onClick={() => handleSelectCourse(course.classId)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-500 font-bold'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-mono text-blue-950 font-bold flex items-center gap-1.5">
                        <span>{course.deptCode} {course.classNumber}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-normal">({course.credits} cr)</span>
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
              })
            )}
          </div>
        </div>

        {/* Right Column: Prerequisite Hub & Dependency Tree */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                  {selectedCourse.deptCode} {selectedCourse.classNumber} ({selectedCourse.credits} cr)
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">
                  {selectedCourse.category} Category
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1.5">{selectedCourse.topic}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Typical Year: <span className="font-medium text-slate-700">{selectedCourse.typicalYear}</span> • Offered: <span className="font-medium text-slate-700">{selectedCourse.termsTaught.join(', ')}</span>
              </p>
            </div>

            {selectedCourse.isCriticalPath && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" /> Critical Path Sequence
              </span>
            )}
          </div>

          {/* Detailed Course Description if present */}
          {selectedCourse.description && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">Catalog Description: </span>
              {selectedCourse.description}
            </div>
          )}

          {/* Graphical Prerequisite Tree Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Direct Prerequisites Column */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Direct Prerequisites</span>
                <span className="bg-blue-100 text-blue-900 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">{directPrereqs.length}</span>
              </h4>

              {directPrereqs.length === 0 ? (
                <div className="text-slate-400 italic py-6 text-center">No prerequisites required</div>
              ) : (
                directPrereqs.map((pr) => (
                  <div
                    key={pr.classId}
                    onClick={() => handleSelectCourse(pr.classId)}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition"
                  >
                    <div className="font-bold font-mono text-blue-900 flex items-center justify-between">
                      <span>{pr.deptCode} {pr.classNumber}</span>
                      <span className="text-[9px] text-slate-500 font-normal">{pr.credits} cr</span>
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{pr.topic}</div>
                  </div>
                ))
              )}
            </div>

            {/* Selected Active Course Hub Column */}
            <div className="bg-[#002E5D] text-white rounded-xl p-4 border border-blue-900 space-y-3 flex flex-col justify-center text-center shadow-md">
              <span className="text-[10px] font-mono text-blue-300 uppercase tracking-wider font-semibold">Active Course Hub</span>
              <div className="text-xl font-extrabold font-mono text-white">
                {selectedCourse.deptCode} {selectedCourse.classNumber}
              </div>
              <div className="text-xs text-slate-200 font-medium px-1 line-clamp-2">{selectedCourse.topic}</div>
              <div className="text-[10px] text-blue-200 font-mono pt-1">
                {selectedCourse.credits} Credit Hours
              </div>
            </div>

            {/* Downstream Dependents Column */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Downstream Dependents</span>
                <span className="bg-blue-100 text-blue-900 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">{downstreamCourses.length}</span>
              </h4>

              {downstreamCourses.length === 0 ? (
                <div className="text-slate-400 italic py-6 text-center">No dependent courses</div>
              ) : (
                downstreamCourses.map((ds) => (
                  <div
                    key={ds.classId}
                    onClick={() => handleSelectCourse(ds.classId)}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition"
                  >
                    <div className="font-bold font-mono text-blue-900 flex items-center justify-between">
                      <span>{ds.deptCode} {ds.classNumber}</span>
                      <span className="text-[9px] text-slate-500 font-normal">{ds.credits} cr</span>
                    </div>
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
