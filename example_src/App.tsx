import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { InterventionsTab } from './components/InterventionsTab';
import { StudentInspectorTab } from './components/StudentInspectorTab';
import { PrereqMapTab } from './components/PrereqMapTab';
import { CatalogTab } from './components/CatalogTab';
import { DocumentationTab } from './components/DocumentationTab';
import { GitHubDeployGuide } from './components/GitHubDeployGuide';
import { getDefaultInterventions, runSimulation } from './simulator/engine';
import { Interventions } from './simulator/types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [interventions, setInterventions] = useState<Interventions>(getDefaultInterventions());
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);

  // Run simulation once for the fixed baseline
  const baselineResult = useMemo(() => {
    return runSimulation(250, getDefaultInterventions());
  }, []);

  // Run simulation whenever interventions state changes
  const currentResult = useMemo(() => {
    return runSimulation(250, interventions);
  }, [interventions]);

  const handleResetToBaseline = () => {
    setInterventions(getDefaultInterventions());
  };

  const handleApplyPreset = (presetName: string) => {
    const base = getDefaultInterventions();

    if (presetName === 'baseline') {
      setInterventions(base);
    } else if (presetName === 'gen2') {
      setInterventions({
        ...base,
        genEdSet: 2,
      });
    } else if (presetName === 'noEmsbEconGen2') {
      setInterventions({
        ...base,
        genEdSet: 2,
        emsbCreditsRequired: 0,
        removeEcon110: true,
      });
    } else if (presetName === 'springSummer') {
      setInterventions({
        ...base,
        enableSpringSummer: true,
      });
    } else if (presetName === 'allOfAbove') {
      setInterventions({
        ...base,
        genEdSet: 2,
        emsbCreditsRequired: 0,
        removeEcon110: true,
        enableSpringSummer: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetToBaseline={handleResetToBaseline}
        onApplyPreset={handleApplyPreset}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            baselineResult={baselineResult}
            currentResult={currentResult}
            onNavigateToInterventions={() => setActiveTab('interventions')}
          />
        )}

        {activeTab === 'interventions' && (
          <InterventionsTab
            interventions={interventions}
            onChangeInterventions={setInterventions}
            onReset={handleResetToBaseline}
          />
        )}

        {activeTab === 'inspector' && (
          <StudentInspectorTab simulationResult={currentResult} />
        )}

        {activeTab === 'prereqMap' && (
          <PrereqMapTab simulationResult={currentResult} />
        )}

        {activeTab === 'catalog' && <CatalogTab />}

        {activeTab === 'docs' && <DocumentationTab />}
      </main>

      {/* GitHub Deployment Guide Modal */}
      {isDeployGuideOpen && (
        <GitHubDeployGuide onClose={() => setIsDeployGuideOpen(false)} />
      )}
    </div>
  );
}

export default App;
