import React from 'react';
import { Interventions, Term } from '../simulator/types';
import { Sliders, Calendar, BookOpen, Users, Zap, Check, RotateCcw, AlertCircle } from 'lucide-react';

interface InterventionsTabProps {
  interventions: Interventions;
  onChangeInterventions: (newInterventions: Interventions) => void;
  onReset: () => void;
}

export const InterventionsTab: React.FC<InterventionsTabProps> = ({
  interventions,
  onChangeInterventions,
  onReset,
}) => {
  // Helper to toggle course offering between single term vs Fall & Winter
  const toggleCourseOffering = (courseId: string, defaultTerm: Term) => {
    const currentTerms = interventions.offeringOverrides[courseId] || [defaultTerm];
    const isDouble = currentTerms.includes('Fall') && currentTerms.includes('Winter');

    const newOverrides = { ...interventions.offeringOverrides };
    if (isDouble) {
      // Revert to single term
      newOverrides[courseId] = [defaultTerm];
    } else {
      // Expand to Fall & Winter
      newOverrides[courseId] = ['Fall', 'Winter'];
    }

    onChangeInterventions({
      ...interventions,
      offeringOverrides: newOverrides,
    });
  };

  const isCourseDoubled = (courseId: string, defaultTerm: Term) => {
    const currentTerms = interventions.offeringOverrides[courseId] || [defaultTerm];
    return currentTerms.includes('Fall') && currentTerms.includes('Winter');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sliders className="h-6 w-6 text-byu-royal" />
            <span>Policy Interventions & What-If Simulator</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Adjust curriculum rules, course offering frequencies, credit requirements, and student population parameters to see the immediate impact on graduation times.
          </p>
        </div>

        <button
          onClick={onReset}
          className="self-start md:self-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors border border-slate-300 flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset All to Baseline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Course Offering Frequency Modifiers */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-byu-navy" />
              <span>Core Course Offering Frequency</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle courses currently offered once a year (Fall-only or Winter-only) to be offered twice a year (Fall & Winter).
            </p>
          </div>

          <div className="space-y-3">
            {/* Fall-only courses */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Fall-only courses offered in winter too</span>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: '015', code: 'CBE 345', name: 'Reactions & Materials Lab (0.5 cr)' },
                  { id: '021', code: 'CBE 386', name: 'Chemical Reactions Eng' },
                  { id: '023', code: 'CBE 436', name: 'Process Control' },
                  { id: '024', code: 'CBE 445', name: 'Separations & Control Lab (0.5 cr)' },
                  { id: '026', code: 'CBE 476', name: 'Separations' },
                ].map((c) => {
                  const active = isCourseDoubled(c.id, 'Fall');
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCourseOffering(c.id, 'Fall')}
                      className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        active
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="block font-bold">{c.code}</span>
                        <span className="text-[11px] font-normal text-slate-500">{c.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {active ? 'Fall & Winter' : 'Fall Only'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Winter-only courses */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Winter-only courses offered in fall too</span>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: '013', code: 'CBE 285', name: 'Fluids Lab (0.5 cr)' },
                  { id: '014', code: 'CBE 311', name: 'Ethics, Safety, Env' },
                  { id: '017', code: 'CBE 374', name: 'Fluid Mechanics' },
                  { id: '018', code: 'CBE 376', name: 'Heat & Mass Transfer' },
                  { id: '020', code: 'CBE 385', name: 'Heat & Mass Lab (0.5 cr)' },
                  { id: '025', code: 'CBE 451', name: 'Process Design (Capstone)' },
                ].map((c) => {
                  const active = isCourseDoubled(c.id, 'Winter');
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCourseOffering(c.id, 'Winter')}
                      className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        active
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="block font-bold">{c.code}</span>
                        <span className="text-[11px] font-normal text-slate-500">{c.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {active ? 'Fall & Winter' : 'Winter Only'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Credit Hour Requirement Reductions */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-byu-navy" />
              <span>Degree Credit Hour Requirement Reductions</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Test reducing overall graduation credit requirements for non-core categories.
            </p>
          </div>

          <div className="space-y-4">
            {/* Engineering Electives Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Engineering Electives (Eng)</span>
                <span className="text-byu-royal font-extrabold">{interventions.engCreditsRequired} Credit Hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="3"
                value={interventions.engCreditsRequired}
                onChange={(e) => onChangeInterventions({ ...interventions, engCreditsRequired: parseInt(e.target.value) })}
                className="w-full mt-2 accent-byu-royal cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 hrs</span>
                <span>3 hrs</span>
                <span>6 hrs</span>
                <span className="font-bold text-byu-royal">9 hrs (Default Baseline)</span>
                <span>12 hrs</span>
              </div>
            </div>

            {/* EMSB Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>EMSB Category Electives</span>
                <span className="text-byu-royal font-extrabold">{interventions.emsbCreditsRequired} Credit Hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={interventions.emsbCreditsRequired}
                onChange={(e) => onChangeInterventions({ ...interventions, emsbCreditsRequired: parseInt(e.target.value) })}
                className="w-full mt-2 accent-byu-royal cursor-pointer"
              />
            </div>

            {/* EPSEL Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>EPSEL Senior Elective / Capstone</span>
                <span className="text-byu-royal font-extrabold">{interventions.epselCreditsRequired} Credit Hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="3"
                value={interventions.epselCreditsRequired}
                onChange={(e) => onChangeInterventions({ ...interventions, epselCreditsRequired: parseInt(e.target.value) })}
                className="w-full mt-2 accent-byu-royal cursor-pointer"
              />
            </div>

            {/* General Education Set Selector */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wide">General Education Curriculum Model</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onChangeInterventions({ ...interventions, genEdSet: 1 })}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    interventions.genEdSet === 1
                      ? 'bg-byu-navy/10 border-byu-royal text-byu-navy font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Gen Ed Set 1 <span className="text-[10px] font-semibold text-byu-royal">(Default Baseline)</span></span>
                    {interventions.genEdSet === 1 && <Check className="h-4 w-4 text-byu-royal" />}
                  </div>
                  <span className="text-[11px] font-normal text-slate-500 block mt-0.5">Current Curriculum (UNIV 101, WRTG 150, AHTG/LETT/CIV, Bio)</span>
                </button>

                <button
                  onClick={() => onChangeInterventions({ ...interventions, genEdSet: 2 })}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    interventions.genEdSet === 2
                      ? 'bg-byu-navy/10 border-byu-royal text-byu-navy font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Gen Ed Set 2 <span className="text-[10px] font-semibold text-slate-500">(What-If Scenario)</span></span>
                    {interventions.genEdSet === 2 && <Check className="h-4 w-4 text-byu-royal" />}
                  </div>
                  <span className="text-[11px] font-normal text-slate-500 block mt-0.5">New Curriculum Model (UNIV 101 – UNIV 109 sequence)</span>
                </button>
              </div>
            </div>

            {/* Course Exemption Toggles */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wide">Specific Course Requirement Exemptions</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* WRTG 316 */}
                <button
                  onClick={() => onChangeInterventions({ ...interventions, removeWrtg316: !interventions.removeWrtg316 })}
                  className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    interventions.removeWrtg316
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="block font-bold">WRTG 316</span>
                    <span className="text-[11px] font-normal text-slate-500">Tech Communication (3 cr)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    interventions.removeWrtg316 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {interventions.removeWrtg316 ? 'Exempt' : 'Required'}
                  </span>
                </button>

                {/* ECON 110 */}
                <button
                  onClick={() => onChangeInterventions({ ...interventions, removeEcon110: !interventions.removeEcon110 })}
                  className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    interventions.removeEcon110
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="block font-bold">ECON 110</span>
                    <span className="text-[11px] font-normal text-slate-500">Macro Economics (3 cr)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    interventions.removeEcon110 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {interventions.removeEcon110 ? 'Exempt' : 'Required'}
                  </span>
                </button>

                {/* MATH 303 */}
                <button
                  onClick={() => onChangeInterventions({ ...interventions, removeMath303: !interventions.removeMath303 })}
                  className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    interventions.removeMath303
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="block font-bold">MATH 303</span>
                    <span className="text-[11px] font-normal text-slate-500">Math for Engineers 2 (4 cr)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    interventions.removeMath303 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {interventions.removeMath303 ? 'Exempt' : 'Required'}
                  </span>
                </button>

                {/* CHEM 464 */}
                <button
                  onClick={() => onChangeInterventions({ ...interventions, removeChem464: !interventions.removeChem464 })}
                  className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    interventions.removeChem464
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="block font-bold">CHEM 464</span>
                    <span className="text-[11px] font-normal text-slate-500">P-Chem Lab (1 cr)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    interventions.removeChem464 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {interventions.removeChem464 ? 'Exempt' : 'Required'}
                  </span>
                </button>

                {/* STAT 121 */}
                <button
                  onClick={() => onChangeInterventions({ ...interventions, removeStat121: !interventions.removeStat121 })}
                  className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    interventions.removeStat121
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="block font-bold">STAT 121</span>
                    <span className="text-[11px] font-normal text-slate-500">Statistics (3 cr)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    interventions.removeStat121 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {interventions.removeStat121 ? 'Exempt' : 'Required'}
                  </span>
                </button>

                {/* CBE Seminars (191, 291, 391) */}
                <button
                  onClick={() => onChangeInterventions({ ...interventions, removeCbeSeminars: !interventions.removeCbeSeminars })}
                  className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    interventions.removeCbeSeminars
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="block font-bold">CBE Seminars</span>
                    <span className="text-[11px] font-normal text-slate-500">CBE 191, 291, 391 (2 cr)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    interventions.removeCbeSeminars ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {interventions.removeCbeSeminars ? 'Exempt' : 'Required'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Prerequisite Requirement Relaxation */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4 lg:col-span-2">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Zap className="h-5 w-5 text-byu-navy" />
              <span>Prerequisite Requirement Relaxation & What-If Modes</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Test policy interventions that relax or remove prerequisite restrictions to observe the impact on student flow and overall graduation times.
            </p>
          </div>

          {/* Preset Prerequisite Modes */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wide">Preset Relaxation Modes</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: 'strict',
                  title: 'Strict Baseline',
                  subtitle: 'Default catalog rules',
                  desc: 'Enforces all prerequisites strictly prior to course enrollment (except lab corequisites).',
                },
                {
                  id: 'concurrentCore',
                  title: 'Concurrent Core CBE',
                  subtitle: 'CBE 273/374/376/476',
                  desc: 'Allows core CBE sequences to be taken concurrently in the same semester.',
                },
                {
                  id: 'waiveMathChem',
                  title: 'Waive Math & Chem',
                  subtitle: 'MATH 302 & CHEM 351',
                  desc: 'Removes Math and O-Chem blocking prerequisites for 300-level CBE core courses.',
                },
                {
                  id: 'none',
                  title: 'Complete Removal',
                  subtitle: 'Zero Prerequisites',
                  desc: 'Removes 100% of prerequisites catalog-wide to test theoretical minimum time.',
                },
              ].map((mode) => {
                const active = interventions.prereqMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => onChangeInterventions({ ...interventions, prereqMode: mode.id as any })}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                      active
                        ? 'bg-byu-navy/10 border-byu-royal text-byu-navy font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm">{mode.title}</span>
                        {active && <Check className="h-4 w-4 text-byu-royal shrink-0" />}
                      </div>
                      <span className="text-[10px] text-byu-royal font-semibold block mt-0.5">{mode.subtitle}</span>
                      <p className="text-[11px] font-normal text-slate-500 mt-1.5 leading-snug">{mode.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Individual Targeted Prerequisite Removals */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wide">Targeted Prerequisite Removals</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                {
                  key: 'relaxCbe273To374',
                  title: 'CBE 273 → CBE 374',
                  desc: 'Allows CBE 273 and CBE 374 concurrently in same semester',
                },
                {
                  key: 'relaxCbe374To376',
                  title: 'CBE 374 → CBE 376',
                  desc: 'Allows CBE 374 and CBE 376 concurrently in same semester',
                },
                {
                  key: 'relaxCbe376To476',
                  title: 'CBE 376 → CBE 476 / 436',
                  desc: 'Allows CBE 376 and CBE 476/436 concurrently in same semester',
                },
                {
                  key: 'relaxMath302ToCbe374',
                  title: 'MATH 302 → CBE 374',
                  desc: 'Waives MATH 302 requirement prior to CBE 374',
                },
                {
                  key: 'relaxChem351ToCbe386',
                  title: 'CHEM 351 → CBE 386',
                  desc: 'Waives CHEM 351 requirement prior to CBE 386',
                },
              ].map((item) => {
                const active = (interventions as any)[item.key];
                return (
                  <button
                    key={item.key}
                    onClick={() => onChangeInterventions({ ...interventions, [item.key]: !active })}
                    className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      active
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{item.title}</span>
                      <span className="text-[11px] font-normal text-slate-500">{item.desc}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {active ? 'Relaxed' : 'Strict'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Student Population Characteristics */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4 lg:col-span-2">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-byu-navy" />
              <span>Student Population & Work Constraints</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate changes in student behavior, employment rates, and credit capacity limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mean Credit Hours */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Mean Preferred Credit Hours</span>
                <span className="text-byu-royal font-extrabold">{interventions.populationMeanCredits} hrs/sem</span>
              </div>
              <input
                type="range"
                min="12.0"
                max="18.0"
                step="0.5"
                value={interventions.populationMeanCredits}
                onChange={(e) => onChangeInterventions({ ...interventions, populationMeanCredits: parseFloat(e.target.value) })}
                className="w-full mt-2 accent-byu-royal cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Baseline: 14.5 credit hours/semester</span>
            </div>

            {/* Working Student % */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Working Student Percentage</span>
                <span className="text-byu-royal font-extrabold">{Math.round(interventions.workingPercentage * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.0"
                step="0.05"
                value={interventions.workingPercentage}
                onChange={(e) => onChangeInterventions({ ...interventions, workingPercentage: parseFloat(e.target.value) })}
                className="w-full mt-2 accent-byu-royal cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Baseline: 30% of cohort works during school</span>
            </div>

            {/* Work Penalty */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Work Credit Capacity Reduction</span>
                <span className="text-byu-royal font-extrabold">-{interventions.workPenaltyCredits} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="5.0"
                step="0.5"
                value={interventions.workPenaltyCredits}
                onChange={(e) => onChangeInterventions({ ...interventions, workPenaltyCredits: parseFloat(e.target.value) })}
                className="w-full mt-2 accent-byu-royal cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Baseline: -2.5 credit hours reduction for working</span>
            </div>
          </div>

          {/* Spring / Summer Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Enable Spring / Summer Semester Enrollment</span>
              <span className="text-xs text-slate-500">Allows taking Gen Ed & Religion in Spring/Summer (Engineering courses restricted unless explicitly listed in classdetails.csv)</span>
            </div>
            <button
              onClick={() => onChangeInterventions({ ...interventions, enableSpringSummer: !interventions.enableSpringSummer })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                interventions.enableSpringSummer ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {interventions.enableSpringSummer ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
