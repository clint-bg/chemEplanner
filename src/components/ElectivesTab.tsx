import React, { useState, useMemo } from 'react';
import { Course, SubjectCategory } from '../simulator/types';
import { CATEGORIZED_ELECTIVES } from '../data/electivesCatalog';
import { BookOpen, Search, Plus, Check, Atom, Cpu, Binary, Flame, Zap, Dna, Compass, Layers, CheckCircle2, Filter, X, Building2, Tag, CheckSquare } from 'lucide-react';

interface ElectivesTabProps {
  onAddElectiveToSchedule: (course: Course) => void;
  enrolledCourseIds: Set<string>;
  completedCourseIds?: Set<string>;
  onToggleCompletedCourse?: (courseId: string) => void;
}

// Grouped Department Subjects definition with aliases
interface DeptGroup {
  id: string;
  label: string;
  deptCodes: string[];
}

const DEPARTMENT_GROUPS: DeptGroup[] = [
  { id: 'CBE', label: 'CBE / CH EN', deptCodes: ['CBE', 'CH EN'] },
  { id: 'CE', label: 'CE / CCE', deptCodes: ['CE', 'CCE', 'CE EN', 'CIV EN'] },
  { id: 'EC EN', label: 'EC EN', deptCodes: ['EC EN'] },
  { id: 'ME EN', label: 'ME EN', deptCodes: ['ME EN'] },
  { id: 'C S', label: 'C S', deptCodes: ['C S'] },
  { id: 'MFGEN', label: 'MFGEN', deptCodes: ['MFGEN'] },
  { id: 'ENG T', label: 'ENG T', deptCodes: ['ENG T'] },
  { id: 'CHEM', label: 'CHEM', deptCodes: ['CHEM'] },
  { id: 'MATH', label: 'MATH', deptCodes: ['MATH'] },
  { id: 'PHYS', label: 'PHYS', deptCodes: ['PHYS'] },
  { id: 'STAT', label: 'STAT', deptCodes: ['STAT'] },
  { id: 'LIFE_SCI', label: 'Life Sciences', deptCodes: ['BIO', 'CELL', 'MMBIO', 'PWS', 'NDFS'] },
];

const SUBJECT_CATEGORIES: { name: SubjectCategory; icon: any; label: string }[] = [
  { name: 'Catalysis & Reaction Engineering', icon: Atom, label: 'Catalysis & Kinetics' },
  { name: 'Polymers & Soft Matter', icon: Layers, label: 'Polymers & Soft Matter' },
  { name: 'Semiconductors & Microelectronics', icon: Cpu, label: 'Semiconductors' },
  { name: 'Numerical Methods & Simulation', icon: Binary, label: 'Numerical & Simulation' },
  { name: 'Nuclear Engineering', icon: Flame, label: 'Nuclear Engineering' },
  { name: 'Computation & Data Science', icon: Zap, label: 'Data Science & CS' },
  { name: 'Biomedical & Biological Engineering', icon: Dna, label: 'Biomedical & Bio' },
  { name: 'Energy & Environmental Engineering', icon: Compass, label: 'Energy & Environment' },
  { name: 'Materials & Nanoscience', icon: Layers, label: 'Materials & Nanoscience' },
  { name: 'Business, Leadership & Management', icon: BookOpen, label: 'Business & Leadership' },
];

export const ElectivesTab: React.FC<ElectivesTabProps> = ({
  onAddElectiveToSchedule,
  enrolledCourseIds,
  completedCourseIds = new Set(),
  onToggleCompletedCourse
}) => {
  const [selectedDeptGroupId, setSelectedDeptGroupId] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Live calculation of department group counts
  const deptGroupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DEPARTMENT_GROUPS.forEach(g => {
      counts[g.id] = CATEGORIZED_ELECTIVES.filter(c => g.deptCodes.includes(c.deptCode)).length;
    });
    return counts;
  }, []);

  // Live calculation of topic category counts
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIZED_ELECTIVES.forEach(c => {
      if (c.subjectCategories) {
        c.subjectCategories.forEach(cat => {
          counts[cat] = (counts[cat] || 0) + 1;
        });
      }
    });
    return counts;
  }, []);

  // Reactive filtering of electives
  const filteredElectives = useMemo(() => {
    const activeGroup = DEPARTMENT_GROUPS.find(g => g.id === selectedDeptGroupId);

    return CATEGORIZED_ELECTIVES.filter((course) => {
      // 1. Department Filter
      const matchesDept =
        selectedDeptGroupId === 'All' ||
        (activeGroup ? activeGroup.deptCodes.includes(course.deptCode) : course.deptCode === selectedDeptGroupId);

      // 2. Topic Category Filter
      const matchesCategory =
        selectedCategory === 'All' ||
        (course.subjectCategories && course.subjectCategories.includes(selectedCategory as SubjectCategory));

      // 3. Search Query Filter
      const text = `${course.deptCode} ${course.classNumber} ${course.topic} ${course.description || ''}`.toLowerCase();
      const matchesSearch = !searchTerm || text.includes(searchTerm.toLowerCase());

      return matchesDept && matchesCategory && matchesSearch;
    });
  }, [selectedDeptGroupId, selectedCategory, searchTerm]);

  const hasActiveFilters = selectedDeptGroupId !== 'All' || selectedCategory !== 'All' || searchTerm.trim() !== '';

  const clearFilters = () => {
    setSelectedDeptGroupId('All');
    setSelectedCategory('All');
    setSearchTerm('');
  };

  const activeDeptGroupObj = DEPARTMENT_GROUPS.find(g => g.id === selectedDeptGroupId);

  return (
    <div className="space-y-6">
      {/* Title & Filter Options Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#002E5D]" /> Engineering & Science Electives Explorer
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter by Academic Department Subject Code or Domain Topic Category to narrow down electives.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search course code, title, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition inline-flex items-center gap-1 shrink-0"
              >
                <X className="w-3.5 h-3.5 text-[#002E5D]" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* 1. Academic Department Subject Filters */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#002E5D]" /> Filter by Department Subject
            </span>
            {selectedDeptGroupId !== 'All' && (
              <span className="text-[11px] font-bold text-[#002E5D] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Selected: {activeDeptGroupObj?.label} ({deptGroupCounts[selectedDeptGroupId] || 0} classes)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedDeptGroupId('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                selectedDeptGroupId === 'All'
                  ? 'bg-[#002E5D] text-white border-[#002E5D] shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Depts ({CATEGORIZED_ELECTIVES.length})
            </button>

            {DEPARTMENT_GROUPS.map(group => {
              const count = deptGroupCounts[group.id] || 0;
              const isSelected = selectedDeptGroupId === group.id;
              if (count === 0) return null;

              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedDeptGroupId(isSelected ? 'All' : group.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border inline-flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-[#002E5D] text-white border-[#002E5D] shadow-sm font-bold ring-2 ring-blue-400/40'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300'
                  }`}
                >
                  <span>{group.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-blue-900/70 text-blue-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Topic Domain Subject Category Filters */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#002E5D]" /> Filter by Topic Domain Focus
            </span>
            {selectedCategory !== 'All' && (
              <span className="text-[11px] font-bold text-[#002E5D] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Selected: {selectedCategory} ({topicCounts[selectedCategory] || 0} classes)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Topics ({CATEGORIZED_ELECTIVES.length})
            </button>

            {SUBJECT_CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const count = topicCounts[cat.name] || 0;
              const isSelected = selectedCategory === cat.name;
              if (count === 0) return null;

              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    isSelected
                      ? 'bg-[#002E5D] text-white border-[#002E5D] shadow-sm font-bold ring-2 ring-blue-400/40'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-blue-900/70 text-blue-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Results Status Banner */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#002E5D] shrink-0" />
            <span>
              Showing <strong className="text-[#002E5D] font-bold text-sm">{filteredElectives.length}</strong> electives
              {selectedDeptGroupId !== 'All' && <span> in <strong className="text-slate-900">{activeDeptGroupObj?.label}</strong></span>}
              {selectedCategory !== 'All' && <span> under <strong className="text-slate-900">{selectedCategory}</strong></span>}
              {searchTerm && <span> matching "<strong>{searchTerm}</strong>"</span>}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[11px] font-bold text-[#002E5D] underline hover:text-blue-800 self-end sm:self-auto mt-1 sm:mt-0"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Reactive Electives Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredElectives.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
            <div className="inline-flex p-3 bg-blue-50 text-[#002E5D] rounded-full">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No electives match your selected subject filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try choosing a different department or topic focus, or clear the search keyword.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#002E5D] hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredElectives.slice(0, 180).map((course, idx) => {
            const isAdded = enrolledCourseIds.has(course.classId);
            const isCompleted = completedCourseIds.has(course.classId);
            return (
              <div
                key={`${course.classId}_${idx}`}
                className={`rounded-xl border shadow-sm p-4 hover:shadow-md transition flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400/50'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isCompleted ? 'bg-blue-200 text-blue-950' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {course.deptCode} {course.classNumber}
                      </span>

                      {isCompleted && (
                        <span className="text-[10px] font-bold text-blue-900 bg-blue-200 px-2 py-0.5 rounded-full border border-blue-300">
                          ✔ Done
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 font-mono">{course.credits} Credits</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{course.topic}</h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{course.description}</p>

                  <div className="flex flex-wrap gap-1 pt-2">
                    <span className="text-[10px] font-bold bg-blue-50 text-[#002E5D] px-2 py-0.5 rounded border border-blue-200">
                      {course.deptCode}
                    </span>
                    {course.subjectCategories?.map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Terms: {course.termsTaught.join(', ')}</span>

                  <div className="flex items-center space-x-2">
                    {onToggleCompletedCourse && (
                      <button
                        onClick={() => onToggleCompletedCourse(course.classId)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
                          isCompleted
                            ? 'bg-[#002E5D] text-white border-[#002E5D]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-500'
                        }`}
                        title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onAddElectiveToSchedule(course)}
                      disabled={isAdded}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition shadow-sm ${
                        isAdded
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-[#002E5D] hover:bg-blue-800 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1" /> Enrolled
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredElectives.length > 180 && (
        <p className="text-[11px] text-slate-500 italic text-right">
          Showing top 180 of {filteredElectives.length} matching electives. Select subject filters to narrow the list.
        </p>
      )}
    </div>
  );
};
