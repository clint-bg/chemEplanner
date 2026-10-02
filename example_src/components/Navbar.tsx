import React from 'react';
import { GraduationCap, RotateCcw, Github, BookOpen, Sliders, BarChart3, Users, Network, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'interventions' | 'inspector' | 'prereqMap' | 'catalog' | 'docs';
  setActiveTab: (tab: 'dashboard' | 'interventions' | 'inspector' | 'prereqMap' | 'catalog' | 'docs') => void;
  onResetToBaseline: () => void;
  onApplyPreset: (presetName: string) => void;
  onOpenDeployGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetToBaseline,
  onApplyPreset,
  onOpenDeployGuide,
}) => {
  return (
    <header className="bg-byu-navy text-white shadow-md border-b border-byu-royal/30 sticky top-0 z-40">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between min-h-[4.5rem] py-3 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5 shrink-0">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/20 shrink-0 shadow-inner">
              <GraduationCap className="h-7 w-7 text-byu-tan" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-byu-tan uppercase whitespace-nowrap">BYU Chemical Engineering</span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-white leading-tight tracking-tight whitespace-nowrap">Time-to-Graduation Simulator</h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4 text-byu-tan" />
              <span>Dashboard & Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('interventions')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'interventions'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Sliders className="h-4 w-4 text-byu-tan" />
              <span>Interventions & What-If</span>
            </button>

            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'inspector'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4 text-byu-tan" />
              <span>Student Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('prereqMap')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'prereqMap'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Network className="h-4 w-4 text-byu-tan" />
              <span>Prereq Map & Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4 text-byu-tan" />
              <span>Course Catalog & Plans</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'docs'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <HelpCircle className="h-4 w-4 text-byu-tan" />
              <span>How It Works</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Preset Selector */}
            <select
              onChange={(e) => e.target.value && onApplyPreset(e.target.value)}
              defaultValue=""
              className="bg-white/10 hover:bg-white/20 text-white text-xs rounded-md px-2.5 py-1.5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-byu-tan cursor-pointer"
            >
              <option value="" disabled className="text-gray-800">⚡ Load Preset Scenario...</option>
              <option value="baseline" className="text-gray-800">Baseline</option>
              <option value="gen2" className="text-gray-800">New General Ed. Req. (Gen 2)</option>
              <option value="noEmsbEconGen2" className="text-gray-800">No EMSB or ECON with Gen2</option>
              <option value="springSummer" className="text-gray-800">Spring Summer Enrollment for Religion/Gen</option>
              <option value="allOfAbove" className="text-gray-800">All of the Above</option>
            </select>

            <button
              onClick={onResetToBaseline}
              title="Reset parameters to default baseline"
              className="p-1.5 rounded-md text-slate-200 hover:text-white hover:bg-white/10 transition-colors border border-white/10 flex items-center text-xs space-x-1 px-2"
            >
              <RotateCcw className="h-3.5 w-3.5 text-byu-tan" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden border-t border-white/10 bg-byu-navy/90 px-2 py-1 flex justify-around text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-1 px-2 rounded ${activeTab === 'dashboard' ? 'bg-white/20 font-bold' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('interventions')}
          className={`py-1 px-2 rounded ${activeTab === 'interventions' ? 'bg-white/20 font-bold' : ''}`}
        >
          Interventions
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`py-1 px-2 rounded ${activeTab === 'inspector' ? 'bg-white/20 font-bold' : ''}`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab('prereqMap')}
          className={`py-1 px-2 rounded ${activeTab === 'prereqMap' ? 'bg-white/20 font-bold' : ''}`}
        >
          Prereqs
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-1 px-2 rounded ${activeTab === 'catalog' ? 'bg-white/20 font-bold' : ''}`}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`py-1 px-2 rounded ${activeTab === 'docs' ? 'bg-white/20 font-bold' : ''}`}
        >
          Walkthrough
        </button>
      </div>
    </header>
  );
};
