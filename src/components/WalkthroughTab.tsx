import React from 'react';
import { BookOpen, CheckCircle2, Compass, Calendar, GitFork, RefreshCw, AlertTriangle, FileText, Check, Plus, Info, Award, Layers } from 'lucide-react';

export const WalkthroughTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#002E5D] text-white rounded-2xl p-6 shadow-xl border border-slate-700/80 space-y-2">
        <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30">
          <FileText className="w-3.5 h-3.5 text-blue-400" /> User Navigation & Feature Guide
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How to Use the Graduation & Electives Planner</h2>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Welcome to the BYU Chemical Engineering Graduation Planner. This guide explains how to effectively navigate each page, customize your schedule, track degree requirement deficits, and select electives.
        </p>
      </div>

      {/* Mandatory Academic Advisor Notice */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-950 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold uppercase text-amber-900 tracking-wider">Academic Advisor Verification: </span>
          Accurate course planning requires verification of course offering terms and graduation progress with academic advisor <span className="underline font-bold">Lavdie Huff</span> in the Fulton College of Engineering.
        </div>
      </div>

      {/* User Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Tab 1: Automated Path */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-100 text-[#002E5D] rounded-lg">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">1. Automated Path Page</h3>
                <p className="text-[11px] text-slate-500">Fastest, bottleneck-free schedule optimizer</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Target Credit Slider:</strong> Adjust maximum target credit hours per term (12–18 cr). Spring/Summer terms target half credits (6 cr).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Spring/Summer Toggles:</strong> Toggle Spring or Summer terms <strong>ON</strong> or <strong>OFF</strong> to control whether classes are scheduled during summer terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Select Electives Box:</strong> Check or uncheck electives from the interactive list. Selected electives remain pinned to the top (<strong>📌 Selected Electives</strong>).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Degree Deficit Tracking:</strong> If required electives (Eng, EMSB, EPSEL) or core courses are missing, progress bars highlight exact credit deficits in amber.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Apply to Manual Plan:</strong> Click <strong>"Apply Automated Path to Manual Plan"</strong> to transfer your optimized schedule to the interactive planner.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab 2: Manual Plan */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">2. Manual Plan Page</h3>
                <p className="text-[11px] text-slate-500">Interactive semester-by-semester planner</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Requirement Category Filter:</strong> Use the dropdown under <em>"Add Courses to Schedule"</em> to filter by <strong>EMSB Math/Sci</strong>, <strong>EPSEL Capstone</strong>, <strong>Religion</strong>, <strong>Gen Ed</strong>, <strong>Eng Electives</strong>, or <strong>Major Core</strong>.</span>
              </li>
              <li className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 font-medium">
                <span className="font-bold text-emerald-900 block mb-0.5 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> Requirement Satisfaction Tip:
                </span>
                If no courses appear under a specific requirement category filter, <strong>it means that requirement is already satisfied</strong> in your schedule (because enrolled courses are hidden from the available list)!
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Course Completion Checkmark:</strong> Click the checkmark icon (<CheckCircle2 className="w-3.5 h-3.5 text-blue-700 inline" />) on any course card to mark it completed (highlighted in blue with a <strong>Done</strong> badge).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Prerequisite & Term Offering Warnings:</strong> Displays real-time alert banners if a class is placed out of prerequisite order or in a term where it isn't taught.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab 3: Prereq Map */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-100 text-indigo-900 rounded-lg">
                <GitFork className="w-5 h-5 text-indigo-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">3. Prereq Map Page</h3>
                <p className="text-[11px] text-slate-500">Prerequisite trees & flowcharts</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Major vs Electives Selector:</strong> Use the top selector to switch between <strong>CBE Major Core Courses</strong> and <strong>Technical Electives</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Prerequisite Verification:</strong> Inspect course dependencies, such as why <span className="font-mono font-bold">CHEM 467</span> requires <span className="font-mono font-bold">MATH 302</span> & <span className="font-mono font-bold">PHYS 121</span> and is scheduled in Junior Fall Year 3.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Course Inspector:</strong> Click any course node to view its detailed description, credits, and offering schedule.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab 4: Catalog Crawler */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-sky-100 text-sky-900 rounded-lg">
                <RefreshCw className="w-5 h-5 text-sky-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">4. Catalog Crawler Page</h3>
                <p className="text-[11px] text-slate-500">Live BYU catalog web sync & custom electives</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Pre-Scraped BYU Catalog Dataset:</strong> Contains 300–500 level technical electives (<span className="font-mono font-bold">CBE</span>, <span className="font-mono font-bold font-semibold">ME EN</span>, <span className="font-mono font-bold">CHEM</span>, <span className="font-mono font-bold">MATH</span>, <span className="font-mono font-bold">STAT</span>, <span className="font-mono font-bold">BIOL</span>, etc.) indexed from <a href="https://catalog.byu.edu" target="_blank" rel="noreferrer" className="text-sky-700 underline font-medium">catalog.byu.edu</a>.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Schema Normalization & Index Building:</strong> Raw scraped catalog entries are normalized into strongly-typed course objects (enforcing credit hours, prerequisites, offering terms, and ABET category tags) and indexed dynamically into a unique department set.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Re-indexing Action:</strong> Clicking <strong>"Re-index Catalog Database"</strong> validates, normalizes, and re-indexes the cached catalog database in real time.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Selecting Courses:</strong> Clicking <span className="bg-[#002E5D] text-white px-2 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-0.5"><Plus className="w-2.5 h-2.5" /> Select Course</span> adds the elective directly to the last semester on the <strong>Manual Plan</strong> page with non-blocking checkmark confirmation.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Custom & Transfer Electives:</strong> Use the manual course entry form to add external AP credits or special transfer courses.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
