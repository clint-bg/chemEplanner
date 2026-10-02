import React, { useState } from 'react';
import {
  HelpCircle,
  Cpu,
  Sliders,
  BarChart3,
  Users,
  Network,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Zap,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  Briefcase
} from 'lucide-react';

export const DocumentationTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('all');

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Title & Overview Hero */}
      <div className="bg-gradient-to-r from-byu-navy via-slate-900 to-byu-royal text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <GraduationCap className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-byu-tan/20 border border-byu-tan/40 text-byu-tan text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simulator Architecture & System Walkthrough</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            How the BYU Chemical Engineering Simulator Works
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            This discrete-event Monte Carlo web application simulates undergraduate progression through the BYU Chemical Engineering curriculum. It samples student cohort populations, models credit capacity constraints, enforces prerequisite and corequisite rules, calculates ABET category requirements, and evaluates policy interventions to reduce time-to-graduation.
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Cohort Size</div>
              <div className="text-lg font-black text-white">250 Students</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Catalog Courses</div>
              <div className="text-lg font-black text-byu-tan">111 Courses</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Baseline Graduation</div>
              <div className="text-lg font-black text-emerald-400">10.0 Semesters</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Gen Ed Models</div>
              <div className="text-lg font-black text-blue-300">Set 1 & Set 2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Jump to Section:</span>
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeSection === 'all'
              ? 'bg-byu-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Topics
        </button>
        <button
          onClick={() => setActiveSection('engine')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
            activeSection === 'engine'
              ? 'bg-byu-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Monte Carlo Engine</span>
        </button>
        <button
          onClick={() => setActiveSection('gened')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
            activeSection === 'gened'
              ? 'bg-byu-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Gen Ed Set 1 vs Set 2</span>
        </button>
        <button
          onClick={() => setActiveSection('interventions')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
            activeSection === 'interventions'
              ? 'bg-byu-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>What-If Interventions</span>
        </button>
        <button
          onClick={() => setActiveSection('inspector')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
            activeSection === 'inspector'
              ? 'bg-byu-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Student & ABET Audit</span>
        </button>
      </div>

      {/* Main Walkthrough Grid */}
      <div className="space-y-8">
        {/* SECTION 1: Monte Carlo Simulation Engine */}
        {(activeSection === 'all' || activeSection === 'engine') && (
          <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-byu-navy rounded-lg border border-byu-royal/50">
                  <Cpu className="h-5 w-5 text-byu-tan" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">1. Discrete-Event Monte Carlo Simulation Engine</h3>
                  <p className="text-xs text-slate-300">Cohort sampling, credit load preferences, and term scheduling mechanics</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/40">Core Engine</span>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-byu-navy font-bold text-sm">
                    <Calendar className="h-4 w-4 text-byu-royal" />
                    <span>Cohort Credit Capacity</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Each student in a 250-student cohort is sampled from a normal distribution of credit hour capacity (<span className="font-mono bg-slate-200 px-1 rounded">μ = 14.5</span>, <span className="font-mono bg-slate-200 px-1 rounded">σ = 1.8</span>), clamped between 12.0 and 20.0 credit hours per semester.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-byu-navy font-bold text-sm">
                    <Briefcase className="h-4 w-4 text-amber-600" />
                    <span>Employment Credit Penalty</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Simulates part-time student employment (default 30% of cohort working). Working students incur a <span className="font-bold text-amber-700">-2.5 credit hour penalty</span> on their effective semester capacity limit.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-byu-navy font-bold text-sm">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <span>Fall/Winter Term Offerings</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under default baseline terms, core CBE classes are offered once a year (Fall-only or Winter-only). Students who miss a course must wait a full academic year unless dual offerings are enabled.
                  </p>
                </div>
              </div>

              {/* Dynamic Credit Caps Callout */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center space-x-2 text-byu-navy font-bold text-sm">
                  <ShieldCheck className="h-5 w-5 text-byu-royal" />
                  <span>Strict Dynamic Category Credit Caps</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  During course selection each semester, the engine dynamically tracks cumulative earned credits across degree categories. As soon as a student reaches the required graduation cap, they stop enrolling in additional courses in that category:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 text-center shadow-xs">
                    <div className="text-xs text-slate-500 font-medium">Engineering Electives (Eng)</div>
                    <div className="text-sm font-extrabold text-byu-navy">9 Credit Hours</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 text-center shadow-xs">
                    <div className="text-xs text-slate-500 font-medium">EMSB Electives</div>
                    <div className="text-sm font-extrabold text-byu-navy">4 Credit Hours</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 text-center shadow-xs">
                    <div className="text-xs text-slate-500 font-medium">EPSEL Capstone/Electives</div>
                    <div className="text-sm font-extrabold text-byu-navy">6 Hours Max (3 Req)</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 text-center shadow-xs">
                    <div className="text-xs text-slate-500 font-medium">Religion (Rel)</div>
                    <div className="text-sm font-extrabold text-byu-navy">14 Credit Hours</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: General Education Models (Set 1 vs Set 2) */}
        {(activeSection === 'all' || activeSection === 'gened') && (
          <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-byu-navy text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                  <GraduationCap className="h-5 w-5 text-byu-tan" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">2. General Education Models (Set 1 vs Set 2)</h3>
                  <p className="text-xs text-slate-200">Comparing current baseline curriculum vs upcoming Gen Ed curriculum</p>
                </div>
              </div>
              <span className="text-xs bg-byu-tan/20 text-byu-tan px-2.5 py-1 rounded-full font-semibold border border-byu-tan/40">Curriculum Switching</span>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Set 1 Card */}
                <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50/70">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-byu-navy flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                      <span>Gen Ed Set 1 (Current Baseline)</span>
                    </h4>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">Set 1</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Represents the traditional General Education requirement set currently in effect.
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-slate-900">Mandatory UNIV 101</strong>: Scheduled in Semester 1 (2 cr).</li>
                    <li><strong className="text-slate-900">Standard Gen Ed Courses</strong>: WRTG 150 (3 cr), AHTG 100 (3 cr), LETT 100 (3 cr), CIV 100 (3 cr), and Biological Science requirement.</li>
                    <li>Restricts students from taking UNIV 102 through 109 for Gen Ed credit.</li>
                  </ul>
                </div>

                {/* Set 2 Card */}
                <div className="border border-blue-200 rounded-xl p-5 space-y-3 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-byu-royal flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-byu-royal"></span>
                      <span>Gen Ed Set 2 (Upcoming Curriculum)</span>
                    </h4>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-mono">Set 2</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Represents the new upcoming General Education curriculum sequence.
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-slate-900">Mandatory UNIV 101</strong>: First semester requirement for every student.</li>
                    <li><strong className="text-slate-900">UNIV 102 – 109 Sequence</strong>: Unlocks enrollment in UNIV 102, 103, 104, 105, 106, 107, 108, 109 for General Education credit.</li>
                    <li><strong className="text-slate-900">Balanced Scheduling Engine</strong>: Prioritizes Gen Ed courses steadily across Soph/Junior semesters (Semesters 4–7) alongside engineering core classes, preventing deferral of all 8 UNIV courses into senior year.</li>
                    <li>Restricts traditional Set 1 standalone courses (AHTG 100, LETT 100) from granting Gen Ed credit.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: What-If Policy Interventions */}
        {(activeSection === 'all' || activeSection === 'interventions') && (
          <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-byu-royal rounded-lg border border-white/20">
                  <Sliders className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">3. Interactive Policy Interventions & What-If Modes</h3>
                  <p className="text-xs text-slate-300">Simulate administrative choices, course frequency expansion, and prerequisite relaxation</p>
                </div>
              </div>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full font-semibold border border-purple-500/40">Policy Experiments</span>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-byu-navy font-bold text-sm">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Course Offering Frequencies</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Test expanding Fall-only core courses (CBE 345, 386, 436, 445, 476) or Winter-only courses (CBE 285, 311, 374, 376, 385, 451) to be offered in both Fall & Winter terms.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-byu-navy font-bold text-sm">
                    <Network className="h-4 w-4 text-byu-royal" />
                    <span>Prerequisite Requirement Relaxation</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Select preset modes (Strict Baseline, Concurrent Core CBE, Waive Math/Chem, Complete Removal) or toggle granular targeted prerequisite relaxations (e.g. CBE 273 → 374, MATH 302 → CBE 374).
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-byu-navy font-bold text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Elective & Credit Sliders</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Adjust credit requirements for Religion (14 → 10 cr), Engineering Electives (12 → 6 cr), EMSB, and EPSEL to measure impact on graduation speed.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-byu-navy font-bold text-sm">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                    <span>Specific Course Exemptions</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Toggle exempting students from taking technical writing (WRTG 316 - 3 cr) or economics (ECON 110 - 3 cr) to evaluate curriculum simplification.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: Student Cohort Inspector & ABET Tracking */}
        {(activeSection === 'all' || activeSection === 'inspector') && (
          <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-byu-navy text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                  <Users className="h-5 w-5 text-byu-tan" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">4. Student Cohort Inspector & ABET Category Hours</h3>
                  <p className="text-xs text-slate-200">Individual student transcript viewer and ABET credit breakdown</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/40">Student Inspector</span>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                The Student Inspector allows choosing any student (STD-1 through STD-100) from the Monte Carlo simulation to inspect their personalized progression path, completed course hours, and ABET category totals:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Major Hours</span>
                  <span className="text-sm font-bold text-byu-navy">Core CBE + Math + Chem</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">ABET Engineering (Eng)</span>
                  <span className="text-sm font-bold text-emerald-700">Engineering Hours</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">ABET Science (Sci)</span>
                  <span className="text-sm font-bold text-blue-700">Math, Chem, Phys, Bio</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Category Caps</span>
                  <span className="text-sm font-bold text-slate-800">Eng, EMSB, EPSEL, GEN, REL</span>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-4 text-xs font-mono space-y-1">
                <div className="text-byu-tan font-bold">Sample Student Inspector Summary Card Output:</div>
                <div className="text-slate-300">Total Credits: 132 cr | Major Hours: 78 cr | ABET Eng: 52 cr | ABET Sci: 34 cr</div>
                <div className="text-slate-400">Eng Electives: 12 cr | EMSB: 4 cr | EPSEL: 3 cr | GEN: 21 cr | REL: 14 cr</div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer Navigation Note */}
      <div className="bg-byu-navy/5 border border-byu-royal/20 rounded-xl p-4 text-center text-xs text-slate-600">
        💡 Have questions or need to run a what-if experiment? Switch to the <strong className="text-byu-navy">Dashboard</strong> or <strong className="text-byu-navy">Interventions</strong> tab using the navigation menu above.
      </div>
    </div>
  );
};
