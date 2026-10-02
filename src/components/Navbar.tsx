import React from 'react';
import { Compass, Calendar, BookOpen, GitFork, RefreshCw, GraduationCap } from 'lucide-react';

interface NavbarProps {
  activeTab: 'automatedPath' | 'manualPlanner' | 'electives' | 'prereqMap' | 'crawler';
  setActiveTab: (tab: 'automatedPath' | 'manualPlanner' | 'electives' | 'prereqMap' | 'crawler') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#002E5D] p-2 rounded-lg text-white shadow-inner flex items-center justify-center font-bold text-xl">
              <GraduationCap className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                GradTime <span className="text-xs bg-blue-900 text-blue-100 border border-blue-700 px-2 py-0.5 rounded-full font-mono">ChemE Planner</span>
              </h1>
              <p className="text-xs text-slate-400">BYU Chemical Engineering Graduation & Electives Estimator</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('automatedPath')}
              className={`inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'automatedPath'
                  ? 'bg-[#002E5D] text-white shadow ring-1 ring-blue-500 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 mr-1.5" />
              Automated Path
            </button>

            <button
              onClick={() => setActiveTab('manualPlanner')}
              className={`inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'manualPlanner'
                  ? 'bg-[#002E5D] text-white shadow ring-1 ring-blue-500 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 mr-1.5" />
              Manual Plan
            </button>

            <button
              onClick={() => setActiveTab('electives')}
              className={`inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'electives'
                  ? 'bg-[#002E5D] text-white shadow ring-1 ring-blue-500 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              Electives
            </button>

            <button
              onClick={() => setActiveTab('prereqMap')}
              className={`inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'prereqMap'
                  ? 'bg-[#002E5D] text-white shadow ring-1 ring-blue-500 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GitFork className="w-4 h-4 mr-1.5" />
              Prereq Map
            </button>

            <button
              onClick={() => setActiveTab('crawler')}
              className={`inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'crawler'
                  ? 'bg-[#002E5D] text-white shadow ring-1 ring-blue-500 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Catalog Crawler
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
