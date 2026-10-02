import React, { useState } from 'react';
import { INITIAL_COURSES } from '../data/classDetailsData';
import { EIGHT_SEMESTER_PLAN, TEN_SEMESTER_PLAN } from '../data/referencePlans';
import { BookOpen, Search, Filter, Layers, CheckCircle, Calendar } from 'lucide-react';

export const CatalogTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePlanView, setActivePlanView] = useState<'catalog' | '8sem' | '10sem'>('catalog');

  const filteredCourses = INITIAL_COURSES.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        c.deptCode.toLowerCase().includes(q) ||
        c.classNumber.toLowerCase().includes(q) ||
        c.topic.toLowerCase().includes(q) ||
        c.classId.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Mode Toggle */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-byu-royal" />
            <span>Course Catalog & Benchmark Reference Plans</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse all 104 required courses, prerequisites, offering terms, and benchmark 8 & 10-semester degree plans.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActivePlanView('catalog')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activePlanView === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Course Catalog
          </button>
          <button
            onClick={() => setActivePlanView('8sem')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activePlanView === '8sem' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            8-Semester Plan
          </button>
          <button
            onClick={() => setActivePlanView('10sem')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activePlanView === '10sem' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            10-Semester Plan
          </button>
        </div>
      </div>

      {activePlanView === 'catalog' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search course code or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-byu-royal"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs w-full sm:w-auto">
              <span className="text-slate-500 font-semibold">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
              >
                <option value="all">All Categories ({INITIAL_COURSES.length})</option>
                <option value="Major">Major Core</option>
                <option value="Gen">General Education (Gen)</option>
                <option value="Rel">Religion (Rel)</option>
                <option value="Eng">Engineering Electives (Eng)</option>
                <option value="EMSB">EMSB Electives</option>
                <option value="EPSEL">EPSEL Capstone</option>
              </select>
            </div>
          </div>

          {/* Catalog Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Course Code</th>
                  <th className="px-4 py-3">Topic / Title</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Gen Ed Set</th>
                  <th className="px-4 py-3">Terms Offered</th>
                  <th className="px-4 py-3">Prerequisites (ClassIDs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCourses.map((c) => (
                  <tr key={c.classId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-slate-400">{c.classId}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-900">
                      {c.deptCode} {c.classNumber}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">{c.topic}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">{c.credits} cr</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          c.category === 'Major'
                            ? 'bg-blue-100 text-blue-800'
                            : c.category === 'Gen'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.category === 'Rel'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {c.genEdSets && c.genEdSets.length > 0 ? (
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          c.genEdSets.length > 1
                            ? 'bg-indigo-100 text-indigo-800'
                            : c.genEdSets.includes('1')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          Set {c.genEdSets.join(' & ')}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {c.termsTaught.join(', ')}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">
                      {c.prereqs.length > 0 ? c.prereqs.join(', ') : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activePlanView === '8sem' || activePlanView === '10sem') && (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {activePlanView === '8sem' ? 'Standard 8-Semester Curriculum Plan' : 'Extended 10-Semester Curriculum Plan'}
              </h3>
              <p className="text-xs text-slate-500">
                {activePlanView === '8sem'
                  ? 'Optimal schedule (~16.5 credit hours/semester) allowing graduation in 4 years.'
                  : 'Adjusted schedule (~13.2 credit hours/semester) suitable for working students or reduced credit loads.'}
              </p>
            </div>
          </div>

          {/* Grid by Semesters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from(
              { length: activePlanView === '8sem' ? 8 : 10 },
              (_, i) => i + 1
            ).map((semNum) => {
              const planItems = (activePlanView === '8sem' ? EIGHT_SEMESTER_PLAN : TEN_SEMESTER_PLAN).filter(
                (item) => item.semester === semNum
              );
              const termName = semNum % 2 === 1 ? 'Fall' : 'Winter';

              return (
                <div key={semNum} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                    <span className="font-bold text-xs text-byu-navy">
                      Semester {semNum} ({termName})
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {planItems.length} courses
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {planItems.map((item, idx) => (
                      <div key={idx} className="bg-white p-2 rounded border border-slate-200 text-xs">
                        <span className="font-semibold text-slate-800 block truncate">{item.classId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
