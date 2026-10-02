import React, { useState, useMemo } from 'react';
import { StudentPlan, Course, SubjectCategory } from '../simulator/types';
import { generateBestGraduationPath } from '../simulator/engine';
import { CATEGORIZED_ELECTIVES } from '../data/electivesCatalog';
import { Compass, CheckCircle2, ArrowRight, Zap, BookOpen, Sun, CalendarX, Power, Layers, Search, Filter, X, AlertTriangle } from 'lucide-react';

interface AutomatedPathGeneratorTabProps {
  onApplyPathToManualPlanner: (plan: StudentPlan) => void;
  completedCourseIds?: Set<string>;
  onToggleCompletedCourse?: (courseId: string) => void;
}

const AVAILABLE_SPRING_SUMMER_TERMS = [
  'Spring Year 1', 'Summer Year 1',
  'Spring Year 2', 'Summer Year 2',
  'Spring Year 3', 'Summer Year 3',
  'Spring Year 4', 'Summer Year 4'
];

const DEPARTMENT_GROUPS = [
  { id: 'ALL', label: 'All Depts', codes: [] },
  { id: 'CBE', label: 'CBE / CH EN', codes: ['CBE', 'CH EN', 'CHEN'] },
  { id: 'ME EN', label: 'ME EN', codes: ['ME EN'] },
  { id: 'EC EN', label: 'EC EN', codes: ['EC EN'] },
  { id: 'CE', label: 'CE / CCE', codes: ['CE', 'CCE', 'CE EN', 'CIV EN'] },
  { id: 'CS', label: 'C S', codes: ['C S'] },
  { id: 'CHEM', label: 'CHEM', codes: ['CHEM'] },
  { id: 'MATH', label: 'MATH / STAT', codes: ['MATH', 'STAT'] },
  { id: 'PHYS', label: 'PHYS', codes: ['PHYS'] },
  { id: 'BIO', label: 'Life Sci', codes: ['BIO', 'CELL', 'MMBIO', 'PWS', 'NDFS'] },
];

const SUBJECT_CATEGORIES: SubjectCategory[] = [
  'Catalysis & Reaction Engineering',
  'Polymers & Soft Matter',
  'Semiconductors & Microelectronics',
  'Numerical Methods & Simulation',
  'Nuclear Engineering',
  'Computation & Data Science',
  'Biomedical & Biological Engineering',
  'Energy & Environmental Engineering',
  'Materials & Nanoscience',
  'Experiential Learning & Senior Thesis (EPSEL)',
  'Business, Leadership & Management',
];

export const BestPathGeneratorTab: React.FC<AutomatedPathGeneratorTabProps> = ({
  onApplyPathToManualPlanner,
  completedCourseIds = new Set(),
  onToggleCompletedCourse
}) => {
  const [maxCredits, setMaxCredits] = useState<number>(15);
  const [selectedElectiveIds, setSelectedElectiveIds] = useState<string[]>(['058', '054', '053', '038', '061', '045']);
  const [disabledSpringSummerTerms, setDisabledSpringSummerTerms] = useState<string[]>([]);

  // Filtering state for electives selection box
  const [electiveSearchQuery, setElectiveSearchQuery] = useState<string>('');
  const [selectedDeptGroup, setSelectedDeptGroup] = useState<string>('ALL');
  const [selectedSubjectCategory, setSelectedSubjectCategory] = useState<string>('ALL');
  const [selectedElectiveCategory, setSelectedElectiveCategory] = useState<string>('ALL');

  const currentPlan = generateBestGraduationPath(
    maxCredits,
    true,
    selectedElectiveIds,
    Array.from(completedCourseIds),
    disabledSpringSummerTerms
  );

  // Selected electives always pinned at top
  const selectedElectives = useMemo(() => {
    return CATEGORIZED_ELECTIVES.filter(c => selectedElectiveIds.includes(c.classId));
  }, [selectedElectiveIds]);

  // Unselected electives matching active search & filter controls
  const unselectedMatchingElectives = useMemo(() => {
    const q = electiveSearchQuery.trim().toLowerCase();
    const activeDeptGroup = DEPARTMENT_GROUPS.find(g => g.id === selectedDeptGroup);

    return CATEGORIZED_ELECTIVES.filter((course) => {
      // Exclude already selected courses
      if (selectedElectiveIds.includes(course.classId)) return false;

      // 1. Dept filter
      if (selectedDeptGroup !== 'ALL' && activeDeptGroup && activeDeptGroup.codes.length > 0) {
        if (!activeDeptGroup.codes.includes(course.deptCode)) {
          return false;
        }
      }

      // 2. Requirement category filter (Eng, EMSB, EPSEL)
      if (selectedElectiveCategory !== 'ALL' && course.category !== selectedElectiveCategory) {
        return false;
      }

      // 3. Subject Focus filter
      if (selectedSubjectCategory !== 'ALL') {
        if (!course.subjectCategories || !course.subjectCategories.includes(selectedSubjectCategory as SubjectCategory)) {
          return false;
        }
      }

      // 4. Search query filter
      if (q) {
        const text = `${course.deptCode} ${course.classNumber} ${course.topic} ${course.description || ''}`.toLowerCase();
        if (!text.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [selectedElectiveIds, electiveSearchQuery, selectedDeptGroup, selectedElectiveCategory, selectedSubjectCategory]);

  const toggleElective = (classId: string) => {
    if (selectedElectiveIds.includes(classId)) {
      setSelectedElectiveIds(selectedElectiveIds.filter(id => id !== classId));
    } else {
      setSelectedElectiveIds([...selectedElectiveIds, classId]);
    }
  };

  const handleSelectAllFiltered = () => {
    const newIds = new Set(selectedElectiveIds);
    unselectedMatchingElectives.forEach(c => newIds.add(c.classId));
    setSelectedElectiveIds(Array.from(newIds));
  };

  const handleClearAll = () => {
    setSelectedElectiveIds([]);
  };

  const toggleSpecificSpringSummerTerm = (termKey: string) => {
    if (disabledSpringSummerTerms.includes(termKey)) {
      setDisabledSpringSummerTerms(disabledSpringSummerTerms.filter(t => t !== termKey));
    } else {
      setDisabledSpringSummerTerms([...disabledSpringSummerTerms, termKey]);
    }
  };

  const isFilterActive = electiveSearchQuery || selectedDeptGroup !== 'ALL' || selectedSubjectCategory !== 'ALL' || selectedElectiveCategory !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Hero / Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#002E5D] text-white rounded-2xl p-6 shadow-xl border border-slate-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30">
              <Zap className="w-3.5 h-3.5 text-blue-400" /> Automated Schedule Optimizer
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Automated Graduation Path</h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Automatically optimizes the fastest, bottleneck-free graduation plan. Shifting general education and religion courses to active Spring/Summer terms to lighten Fall & Winter credit loads.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl text-center min-w-[240px]">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Estimated Graduation</span>
            <div className="text-2xl font-bold text-blue-300 mt-1">{currentPlan.estimatedGraduationTerm}</div>
            <div className="text-xs text-slate-300 mt-1">{currentPlan.totalTerms} Semesters • {currentPlan.totalCreditsCompleted} Total Credits</div>
            
            {!currentPlan.requirementsStatus.overallEnrolledSatisfied && (
              <div className="mt-2 text-[11px] font-semibold bg-amber-500/20 text-amber-200 border border-amber-500/40 px-2 py-1 rounded-lg flex flex-col items-center justify-center gap-0.5">
                <div className="flex items-center gap-1 text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Degree Requirement Deficit</span>
                </div>
                <span className="text-[10px] text-amber-100 font-normal">
                  {[
                    currentPlan.requirementsStatus.majorCreditsEnrolled < currentPlan.requirementsStatus.majorCreditsRequired ? `${currentPlan.requirementsStatus.majorCreditsRequired - currentPlan.requirementsStatus.majorCreditsEnrolled} cr Major` : null,
                    currentPlan.requirementsStatus.engElectivesCreditsEnrolled < 9 ? `${9 - currentPlan.requirementsStatus.engElectivesCreditsEnrolled} cr Eng` : null,
                    currentPlan.requirementsStatus.emsbCreditsEnrolled < 4 ? `${4 - currentPlan.requirementsStatus.emsbCreditsEnrolled} cr EMSB` : null,
                    currentPlan.requirementsStatus.epselCreditsEnrolled < 3 ? `${3 - currentPlan.requirementsStatus.epselCreditsEnrolled} cr EPSEL` : null,
                    currentPlan.requirementsStatus.genEdCreditsEnrolled < 14 ? `${14 - currentPlan.requirementsStatus.genEdCreditsEnrolled} cr GenEd` : null,
                    currentPlan.requirementsStatus.religionCreditsEnrolled < 14 ? `${14 - currentPlan.requirementsStatus.religionCreditsEnrolled} cr Religion` : null,
                  ].filter(Boolean).join(' • ')}
                </span>
              </div>
            )}

            <button
              onClick={() => onApplyPathToManualPlanner(currentPlan)}
              className="mt-3 w-full inline-flex items-center justify-center text-xs font-bold bg-[#002E5D] hover:bg-blue-800 text-white py-2 px-3 rounded-lg shadow transition"
            >
              Apply Automated Path to Manual Plan <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Controls & Elective Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Generator Parameters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-5 flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#002E5D]" /> Automated Path Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <span>Target Max Credit Hours per Term: <span className="text-[#002E5D] font-bold">{maxCredits} cr</span></span>
                <span className="text-amber-800 bg-amber-100 border border-amber-300 font-semibold px-2 py-0.5 rounded text-[10px] normal-case">
                  Sp/Su: {maxCredits / 2} cr target
                </span>
              </label>
              <input
                type="range"
                min="12"
                max="18"
                step="0.5"
                value={maxCredits}
                onChange={(e) => setMaxCredits(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002E5D]"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                <span>12 cr (Light)</span>
                <span>15 cr (Standard)</span>
                <span>18 cr (Heavy)</span>
              </div>
            </div>

            {/* Specific Spring & Summer Term Toggles */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" /> Active Spring/Summer Terms
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setDisabledSpringSummerTerms([])}
                    className="text-[9px] font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 border border-blue-300 px-1.5 py-0.5 rounded"
                    title="Enable all Spring/Summer terms"
                  >
                    All ON
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisabledSpringSummerTerms([...AVAILABLE_SPRING_SUMMER_TERMS])}
                    className="text-[9px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded"
                    title="Disable all Spring/Summer terms"
                  >
                    All OFF
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-600">
                Click to toggle individual Spring or Summer terms ON or OFF (e.g., for internships, missions, or breaks):
              </p>

              <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs">
                {AVAILABLE_SPRING_SUMMER_TERMS.map(termKey => {
                  const isDisabled = disabledSpringSummerTerms.includes(termKey);
                  return (
                    <button
                      key={termKey}
                      type="button"
                      onClick={() => toggleSpecificSpringSummerTerm(termKey)}
                      className={`px-2 py-1 rounded text-[11px] font-medium border transition flex items-center justify-between ${
                        isDisabled
                          ? 'bg-slate-100 text-slate-400 border-slate-300 line-through'
                          : 'bg-white text-[#002E5D] border-blue-300 font-bold shadow-2xs hover:bg-blue-50'
                      }`}
                    >
                      <span>{termKey}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                        isDisabled ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {isDisabled ? 'OFF' : 'ON'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Degree Requirements Progress</h4>
              <span className="text-[10px] font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                {completedCourseIds.size} Completed
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              {/* Major Core */}
              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>Major Core ({currentPlan.requirementsStatus.majorCreditsDone}/{currentPlan.requirementsStatus.majorCreditsRequired} cr)</span>
                  <span className={currentPlan.requirementsStatus.majorSatisfied ? 'text-blue-700 font-bold' : currentPlan.requirementsStatus.majorCreditsEnrolled < currentPlan.requirementsStatus.majorCreditsRequired ? 'text-amber-600 font-semibold' : 'text-slate-500 font-medium'}>
                    {currentPlan.requirementsStatus.majorSatisfied
                      ? '✔ Complete'
                      : currentPlan.requirementsStatus.majorCreditsEnrolled < currentPlan.requirementsStatus.majorCreditsRequired
                      ? `${currentPlan.requirementsStatus.majorCreditsEnrolled} cr Planned (Deficit: ${currentPlan.requirementsStatus.majorCreditsRequired - currentPlan.requirementsStatus.majorCreditsEnrolled} cr)`
                      : `${currentPlan.requirementsStatus.majorCreditsEnrolled} cr Planned`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200/60">
                  <div
                    className="bg-[#002E5D] h-full transition-all"
                    style={{ width: `${Math.min(100, (currentPlan.requirementsStatus.majorCreditsDone / currentPlan.requirementsStatus.majorCreditsRequired) * 100)}%` }}
                  />
                  <div
                    className="bg-blue-300 h-full transition-all"
                    style={{ width: `${Math.min(100 - (currentPlan.requirementsStatus.majorCreditsDone / currentPlan.requirementsStatus.majorCreditsRequired) * 100, (Math.max(0, currentPlan.requirementsStatus.majorCreditsEnrolled - currentPlan.requirementsStatus.majorCreditsDone) / currentPlan.requirementsStatus.majorCreditsRequired) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Eng Electives */}
              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>Eng Electives ({currentPlan.requirementsStatus.engElectivesCreditsDone}/9 cr)</span>
                  <span className={currentPlan.requirementsStatus.engElectivesSatisfied ? 'text-blue-700 font-bold' : currentPlan.requirementsStatus.engElectivesCreditsEnrolled < 9 ? 'text-amber-600 font-semibold' : 'text-slate-500 font-medium'}>
                    {currentPlan.requirementsStatus.engElectivesSatisfied
                      ? '✔ Complete'
                      : currentPlan.requirementsStatus.engElectivesCreditsEnrolled < 9
                      ? `${currentPlan.requirementsStatus.engElectivesCreditsEnrolled} cr Planned (Deficit: ${9 - currentPlan.requirementsStatus.engElectivesCreditsEnrolled} cr)`
                      : `${currentPlan.requirementsStatus.engElectivesCreditsEnrolled} cr Planned`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200/60">
                  <div
                    className="bg-blue-700 h-full transition-all"
                    style={{ width: `${Math.min(100, (currentPlan.requirementsStatus.engElectivesCreditsDone / 9) * 100)}%` }}
                  />
                  <div
                    className="bg-blue-300 h-full transition-all"
                    style={{ width: `${Math.min(100 - (currentPlan.requirementsStatus.engElectivesCreditsDone / 9) * 100, (Math.max(0, currentPlan.requirementsStatus.engElectivesCreditsEnrolled - currentPlan.requirementsStatus.engElectivesCreditsDone) / 9) * 100)}%` }}
                  />
                </div>
              </div>

              {/* EMSB Electives */}
              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>EMSB Math & Science ({currentPlan.requirementsStatus.emsbCreditsDone}/4 cr)</span>
                  <span className={currentPlan.requirementsStatus.emsbSatisfied ? 'text-blue-700 font-bold' : currentPlan.requirementsStatus.emsbCreditsEnrolled < 4 ? 'text-amber-600 font-semibold' : 'text-slate-500 font-medium'}>
                    {currentPlan.requirementsStatus.emsbSatisfied
                      ? '✔ Complete'
                      : currentPlan.requirementsStatus.emsbCreditsEnrolled < 4
                      ? `${currentPlan.requirementsStatus.emsbCreditsEnrolled} cr Planned (Deficit: ${4 - currentPlan.requirementsStatus.emsbCreditsEnrolled} cr)`
                      : `${currentPlan.requirementsStatus.emsbCreditsEnrolled} cr Planned`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200/60">
                  <div
                    className="bg-teal-700 h-full transition-all"
                    style={{ width: `${Math.min(100, (currentPlan.requirementsStatus.emsbCreditsDone / 4) * 100)}%` }}
                  />
                  <div
                    className="bg-teal-300 h-full transition-all"
                    style={{ width: `${Math.min(100 - (currentPlan.requirementsStatus.emsbCreditsDone / 4) * 100, (Math.max(0, currentPlan.requirementsStatus.emsbCreditsEnrolled - currentPlan.requirementsStatus.emsbCreditsDone) / 4) * 100)}%` }}
                  />
                </div>
              </div>

              {/* General Education */}
              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>General Education ({currentPlan.requirementsStatus.genEdCreditsDone}/14 cr)</span>
                  <span className={currentPlan.requirementsStatus.genEdSatisfied ? 'text-blue-700 font-bold' : currentPlan.requirementsStatus.genEdCreditsEnrolled < 14 ? 'text-amber-600 font-semibold' : 'text-slate-500 font-medium'}>
                    {currentPlan.requirementsStatus.genEdSatisfied
                      ? '✔ Complete'
                      : currentPlan.requirementsStatus.genEdCreditsEnrolled < 14
                      ? `${currentPlan.requirementsStatus.genEdCreditsEnrolled} cr Planned (Deficit: ${14 - currentPlan.requirementsStatus.genEdCreditsEnrolled} cr)`
                      : `${currentPlan.requirementsStatus.genEdCreditsEnrolled} cr Planned`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200/60">
                  <div
                    className="bg-sky-700 h-full transition-all"
                    style={{ width: `${Math.min(100, (currentPlan.requirementsStatus.genEdCreditsDone / 14) * 100)}%` }}
                  />
                  <div
                    className="bg-sky-300 h-full transition-all"
                    style={{ width: `${Math.min(100 - (currentPlan.requirementsStatus.genEdCreditsDone / 14) * 100, (Math.max(0, currentPlan.requirementsStatus.genEdCreditsEnrolled - currentPlan.requirementsStatus.genEdCreditsDone) / 14) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Religion */}
              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>Religion ({currentPlan.requirementsStatus.religionCreditsDone}/14 cr)</span>
                  <span className={currentPlan.requirementsStatus.religionSatisfied ? 'text-blue-700 font-bold' : currentPlan.requirementsStatus.religionCreditsEnrolled < 14 ? 'text-amber-600 font-semibold' : 'text-slate-500 font-medium'}>
                    {currentPlan.requirementsStatus.religionSatisfied
                      ? '✔ Complete'
                      : currentPlan.requirementsStatus.religionCreditsEnrolled < 14
                      ? `${currentPlan.requirementsStatus.religionCreditsEnrolled} cr Planned (Deficit: ${14 - currentPlan.requirementsStatus.religionCreditsEnrolled} cr)`
                      : `${currentPlan.requirementsStatus.religionCreditsEnrolled} cr Planned`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200/60">
                  <div
                    className="bg-indigo-600 h-full transition-all"
                    style={{ width: `${Math.min(100, (currentPlan.requirementsStatus.religionCreditsDone / 14) * 100)}%` }}
                  />
                  <div
                    className="bg-indigo-300 h-full transition-all"
                    style={{ width: `${Math.min(100 - (currentPlan.requirementsStatus.religionCreditsDone / 14) * 100, (Math.max(0, currentPlan.requirementsStatus.religionCreditsEnrolled - currentPlan.requirementsStatus.religionCreditsDone) / 14) * 100)}%` }}
                  />
                </div>
              </div>

              {/* EPSEL Capstone / Thesis */}
              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>EPSEL Capstone/Thesis ({currentPlan.requirementsStatus.epselCreditsDone}/3-6 cr)</span>
                  <span className={currentPlan.requirementsStatus.epselSatisfied ? 'text-blue-700 font-bold' : currentPlan.requirementsStatus.epselCreditsEnrolled < 3 ? 'text-amber-600 font-semibold' : 'text-slate-500 font-medium'}>
                    {currentPlan.requirementsStatus.epselSatisfied
                      ? '✔ Complete'
                      : currentPlan.requirementsStatus.epselCreditsEnrolled < 3
                      ? `${currentPlan.requirementsStatus.epselCreditsEnrolled} cr Planned (Deficit: ${3 - currentPlan.requirementsStatus.epselCreditsEnrolled} cr)`
                      : `${currentPlan.requirementsStatus.epselCreditsEnrolled} cr Planned`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200/60">
                  <div
                    className="bg-emerald-700 h-full transition-all"
                    style={{ width: `${Math.min(100, (currentPlan.requirementsStatus.epselCreditsDone / 3) * 100)}%` }}
                  />
                  <div
                    className="bg-emerald-300 h-full transition-all"
                    style={{ width: `${Math.min(100 - (currentPlan.requirementsStatus.epselCreditsDone / 3) * 100, (Math.max(0, currentPlan.requirementsStatus.epselCreditsEnrolled - currentPlan.requirementsStatus.epselCreditsDone) / 3) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Elective Selection Checklist */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col space-y-3">
          {/* Header & Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#002E5D]" /> Select Electives to Include in Automated Path
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Use the search bar, department chips, or subject focus filters to easily locate and check electives.
              </p>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="text-xs font-semibold text-blue-900 bg-blue-100 border border-blue-300 px-2.5 py-1 rounded-full">
                {selectedElectiveIds.length} Selected
              </span>
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="text-[10px] font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded transition"
                title="Select all electives matching active filters"
              >
                + Add Filtered ({unselectedMatchingElectives.length})
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-1 rounded transition"
                title="Clear all selected electives"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Electives Filter & Search Controls */}
          <div className="space-y-2 pt-0.5">
            {/* Search Input & Category Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search course code, title, topic..."
                  value={electiveSearchQuery}
                  onChange={(e) => setElectiveSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {electiveSearchQuery && (
                  <button
                    onClick={() => setElectiveSearchQuery('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Requirement Type Filter */}
              <select
                value={selectedElectiveCategory}
                onChange={(e) => setSelectedElectiveCategory(e.target.value)}
                className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
              >
                <option value="ALL">All Categories</option>
                <option value="Eng">Engineering Electives (Eng)</option>
                <option value="EMSB">Math & Science (EMSB)</option>
                <option value="EPSEL">EPSEL Capstone / Thesis</option>
              </select>
            </div>

            {/* Department Group Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Dept:</span>
              {DEPARTMENT_GROUPS.map((g) => {
                const isActive = selectedDeptGroup === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedDeptGroup(g.id)}
                    className={`px-2 py-0.5 rounded-full border transition whitespace-nowrap ${
                      isActive
                        ? 'bg-[#002E5D] text-white border-blue-900 font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>

            {/* Subject Focus Category Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Focus Area:</span>
              <select
                value={selectedSubjectCategory}
                onChange={(e) => setSelectedSubjectCategory(e.target.value)}
                className="w-full text-xs py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
              >
                <option value="ALL">All Focus Areas ({SUBJECT_CATEGORIES.length})</option>
                {SUBJECT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {isFilterActive && (
                <button
                  type="button"
                  onClick={() => {
                    setElectiveSearchQuery('');
                    setSelectedDeptGroup('ALL');
                    setSelectedSubjectCategory('ALL');
                    setSelectedElectiveCategory('ALL');
                  }}
                  className="text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1 rounded shrink-0 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Filtered Elective Cards Grid: Selected Pinned at Top, Unselected Filtered Below */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 flex-1 max-h-[440px] min-h-[280px] overflow-y-auto pr-1 pt-2 border-t border-slate-100">
            {/* Pinned Selected Electives Section */}
            {selectedElectives.length > 0 && (
              <>
                <div className="col-span-full font-bold text-[11px] text-blue-900 bg-blue-50/90 border border-blue-200 px-2.5 py-1 rounded flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#002E5D]" /> Selected Electives ({selectedElectives.length}) — Pinned at Top
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Click card to deselect</span>
                </div>

                {selectedElectives.map((elective) => (
                  <div
                    key={elective.classId}
                    onClick={() => toggleElective(elective.classId)}
                    className="p-3 rounded-lg border cursor-pointer transition-all flex items-start space-x-3 bg-blue-50/90 border-blue-300 ring-1 ring-blue-400 shadow-2xs hover:bg-blue-100/70"
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 text-[#002E5D] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{elective.deptCode} {elective.classNumber}</span>
                        <span className="text-[10px] text-blue-900 font-mono bg-blue-200/80 px-1.5 py-0.5 rounded font-semibold">{elective.credits} cr</span>
                      </div>
                      <div className="text-slate-800 font-medium mt-0.5 line-clamp-1">{elective.topic}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-blue-800 font-semibold line-clamp-1">
                          {elective.subjectCategories?.[0] || elective.category}
                        </span>
                        <span className="text-[9px] text-blue-900 font-mono bg-blue-100 px-1 rounded border border-blue-200">
                          {elective.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Unselected Available Electives Section */}
            {unselectedMatchingElectives.length > 0 && (
              <>
                {selectedElectives.length > 0 && (
                  <div className="col-span-full font-bold text-[11px] text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded mt-2 flex items-center justify-between">
                    <span>Available Electives ({unselectedMatchingElectives.length})</span>
                    <span className="text-[10px] text-slate-500 font-normal">Filtered by search & department</span>
                  </div>
                )}

                {unselectedMatchingElectives.map((elective) => (
                  <div
                    key={elective.classId}
                    onClick={() => toggleElective(elective.classId)}
                    className="p-3 rounded-lg border cursor-pointer transition-all flex items-start space-x-3 bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 text-[#002E5D] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{elective.deptCode} {elective.classNumber}</span>
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-200/80 px-1.5 py-0.5 rounded">{elective.credits} cr</span>
                      </div>
                      <div className="text-slate-700 font-medium mt-0.5 line-clamp-1">{elective.topic}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-blue-800 font-semibold line-clamp-1">
                          {elective.subjectCategories?.[0] || elective.category}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono bg-slate-100 px-1 rounded">
                          {elective.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {selectedElectives.length === 0 && unselectedMatchingElectives.length === 0 && (
              <div className="col-span-full py-10 text-center space-y-2">
                <div className="text-xs text-slate-500 italic">No electives match your current filter criteria.</div>
                <button
                  type="button"
                  onClick={() => {
                    setElectiveSearchQuery('');
                    setSelectedDeptGroup('ALL');
                    setSelectedSubjectCategory('ALL');
                    setSelectedElectiveCategory('ALL');
                  }}
                  className="text-xs font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated Schedule Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#002E5D]" /> Generated Automated Semester Plan
          </h3>
          <span className="text-xs text-slate-500 font-mono">Total Terms: {currentPlan.totalTerms}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentPlan.schedule.map((termPlan) => {
            const isSpringSummer = termPlan.term === 'Spring' || termPlan.term === 'Summer';
            const termKey = `${termPlan.term} Year ${termPlan.year}`;
            const isDisabled = isSpringSummer && disabledSpringSummerTerms.includes(termKey);

            return (
              <div
                key={termPlan.semesterNumber}
                className={`rounded-xl border shadow-sm overflow-hidden flex flex-col justify-between transition ${
                  isSpringSummer ? 'border-amber-200 bg-amber-50/20' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`p-3 flex items-center justify-between ${
                  isSpringSummer ? 'bg-amber-900 text-amber-100' : 'bg-slate-900 text-white'
                }`}>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-mono uppercase text-blue-300 font-semibold">Semester {termPlan.semesterNumber}</span>
                      {isSpringSummer && (
                        <span className="text-[10px] font-bold bg-amber-500/30 text-amber-200 border border-amber-400/40 px-1.5 py-0.2 rounded">
                          Spring/Summer
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-white">{termPlan.term} Year {termPlan.year}</h4>
                  </div>

                  {isSpringSummer && (
                    <button
                      onClick={() => toggleSpecificSpringSummerTerm(termKey)}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition flex items-center gap-1 ${
                        isDisabled
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-amber-700 text-amber-100 hover:bg-amber-600'
                      }`}
                      title={isDisabled ? 'Enable this Spring/Summer semester' : 'Disable this Spring/Summer semester'}
                    >
                      <Power className="w-3 h-3" />
                      {isDisabled ? 'Off' : 'On'}
                    </button>
                  )}
                </div>

                <div className="p-3 space-y-2 flex-1">
                  {termPlan.courses.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 italic bg-slate-50 rounded border border-dashed border-slate-200">
                      {isDisabled ? 'Term disabled by student toggle.' : 'No courses scheduled in this term.'}
                    </div>
                  ) : (
                    termPlan.courses.map((c) => {
                      const isCompleted = completedCourseIds.has(c.classId);
                      const isGeneralOrRel = c.category === 'Gen' || c.category === 'Rel';
                      return (
                        <div
                          key={c.classId}
                          className={`p-2 rounded border transition text-xs flex flex-col justify-between space-y-1 ${
                            isCompleted
                              ? 'bg-blue-100/90 border-blue-300 text-blue-950 font-medium'
                              : isGeneralOrRel && isSpringSummer
                              ? 'bg-amber-100/80 border-amber-300 text-amber-950'
                              : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center space-x-1.5">
                              {onToggleCompletedCourse && (
                                <button
                                  onClick={() => onToggleCompletedCourse(c.classId)}
                                  className={`p-0.5 rounded-full transition ${
                                    isCompleted
                                      ? 'bg-[#002E5D] text-white'
                                      : 'text-slate-400 hover:text-blue-700'
                                  }`}
                                  title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <span className={`font-mono px-1.5 py-0.5 rounded ${
                                isCompleted ? 'bg-blue-200/90 text-blue-950 font-bold' : 'bg-blue-100/80 text-blue-900'
                              }`}>
                                {c.deptCode} {c.classNumber}
                              </span>
                            </div>
                            <span className="text-slate-500 font-normal">{c.credits} cr</span>
                          </div>

                          <div className="text-slate-700 font-medium line-clamp-1">{c.topic}</div>

                          <div className="flex items-center justify-between pt-0.5">
                            {c.isCriticalPath && (
                              <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                                Critical Path
                              </span>
                            )}

                            {isGeneralOrRel && isSpringSummer && (
                              <span className="text-[9px] font-bold text-amber-900 bg-amber-200/90 px-1.5 py-0.5 rounded border border-amber-300">
                                Shifted to {termPlan.term}
                              </span>
                            )}

                            {isCompleted && (
                              <span className="text-[9px] font-bold text-blue-900 bg-blue-200 px-1.5 py-0.2 rounded-full border border-blue-300 ml-auto">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                  <span>{termPlan.courses.length} courses</span>
                  <span>{termPlan.totalCredits} / {isSpringSummer ? (maxCredits / 2) : maxCredits} cr limit</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const AutomatedPathGeneratorTab = BestPathGeneratorTab;
