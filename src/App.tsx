import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BestPathGeneratorTab } from './components/BestPathGeneratorTab';
import { ManualPlannerTab } from './components/ManualPlannerTab';
import { PrereqMapTab } from './components/PrereqMapTab';
import { CatalogCrawlerTab } from './components/CatalogCrawlerTab';
import { WalkthroughTab } from './components/WalkthroughTab';
import { Course, TermSchedule, StudentPlan } from './simulator/types';
import { generateBestGraduationPath } from './simulator/engine';
import { auditDegreeRequirements, getAllAvailableCourses } from './simulator/prereqChecker';
import { GraduationCap, Award, Clock, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'automatedPath' | 'manualPlanner' | 'prereqMap' | 'crawler' | 'walkthrough'>('automatedPath');

  // Initialize schedule with default best path
  const defaultBestPath = generateBestGraduationPath(16, false, ['058', '054', '053', '038', '061', '045']);
  const [schedule, setSchedule] = useState<TermSchedule[]>(defaultBestPath.schedule);
  const [customCourses, setCustomCourses] = useState<Course[]>([]);
  const [completedCourseIds, setCompletedCourseIds] = useState<Set<string>>(new Set());

  const handleToggleCompletedCourse = (courseId: string) => {
    setCompletedCourseIds(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  const allCoursesMap = getAllAvailableCourses(customCourses);

  // Enrolled course IDs
  const enrolledCourseIds = new Set<string>();
  schedule.forEach(term => term.courses.forEach(c => enrolledCourseIds.add(c.classId)));

  const audit = auditDegreeRequirements(completedCourseIds, enrolledCourseIds, allCoursesMap);

  // Apply Best Path to Manual Planner
  const handleApplyPathToManualPlanner = (generatedPlan: StudentPlan) => {
    setSchedule(generatedPlan.schedule);
    setActiveTab('manualPlanner');
  };

  // Import saved CSV plan into manual planner
  const handleImportPlan = (importedSchedule: TermSchedule[], importedCompletedIds: Set<string>) => {
    setSchedule(importedSchedule);
    setCompletedCourseIds(importedCompletedIds);
    setActiveTab('manualPlanner');
  };

  // Add elective course to latest term in manual schedule
  const handleAddElectiveToSchedule = (course: Course) => {
    if (enrolledCourseIds.has(course.classId)) return;

    const newSchedule = [...schedule];
    let targetTerm = newSchedule[newSchedule.length - 1];

    if (!targetTerm || targetTerm.totalCredits + course.credits > 17) {
      const nextSem = newSchedule.length + 1;
      targetTerm = {
        semesterNumber: nextSem,
        year: Math.ceil(nextSem / 2),
        term: nextSem % 2 === 1 ? 'Fall' : 'Winter',
        courses: [],
        totalCredits: 0,
        warnings: []
      };
      newSchedule.push(targetTerm);
    }

    targetTerm.courses.push(course);
    targetTerm.totalCredits += course.credits;
    setSchedule(newSchedule);
    setActiveTab('manualPlanner');
  };

  // Add custom course created in crawler tab
  const handleAddCustomCourse = (course: Course) => {
    setCustomCourses([...customCourses, course]);
    handleAddElectiveToSchedule(course);
  };

  // Calculate overall graduation estimate from schedule
  const totalSemesters = schedule.length;
  const currentYear = new Date().getFullYear();
  const lastTerm = schedule[schedule.length - 1];
  const finalYear = lastTerm ? (lastTerm.term === 'Fall' ? currentYear + (lastTerm.year - 1) : currentYear + lastTerm.year) : currentYear + 5;
  const finalTermName = lastTerm?.term || 'Winter';
  const graduationEstimate = `${finalTermName} ${finalYear}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Prominent Advisory Notice Banner at Top */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-amber-950 border-b-2 border-amber-600 shadow-md py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="inline-flex items-center space-x-1.5 bg-slate-900 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm shrink-0 border border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Advisor Verification Required</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-950 leading-tight">
            Accurate course planning requires verification of when classes are taught and requires meeting with academic advisor <span className="underline decoration-amber-900 underline-offset-2 font-extrabold text-slate-950">Lavdie Huff</span>.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between">
        <div className="space-y-6">
          {activeTab === 'automatedPath' && (
            <BestPathGeneratorTab
              onApplyPathToManualPlanner={handleApplyPathToManualPlanner}
              completedCourseIds={completedCourseIds}
              onToggleCompletedCourse={handleToggleCompletedCourse}
              onImportPlan={handleImportPlan}
            />
          )}

          {activeTab === 'manualPlanner' && (
            <ManualPlannerTab
              schedule={schedule}
              setSchedule={setSchedule}
              completedCourseIds={completedCourseIds}
              onToggleCompletedCourse={handleToggleCompletedCourse}
              onImportPlan={handleImportPlan}
            />
          )}

          {activeTab === 'prereqMap' && <PrereqMapTab />}

          {activeTab === 'crawler' && (
            <CatalogCrawlerTab onAddCustomCourse={handleAddCustomCourse} />
          )}

          {activeTab === 'walkthrough' && <WalkthroughTab />}
        </div>

        {/* Centered Graduation Summary Card at Bottom (Hidden on Automated Path & Walkthrough tabs) */}
        {activeTab !== 'automatedPath' && activeTab !== 'walkthrough' && (
          <div className="mt-10 max-w-xl mx-auto w-full bg-white rounded-2xl border border-slate-200 shadow-md p-6 text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <GraduationCap className="w-4 h-4 text-[#002E5D]" /> Graduation Time & Requirement Summary
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
              <div className="text-center sm:text-left">
                <span className="text-xs text-slate-500 block font-medium">Estimated Graduation</span>
                <span className="text-2xl font-extrabold text-[#002E5D] font-mono tracking-tight">
                  {graduationEstimate} <span className="text-xs font-semibold text-slate-500 font-sans">({totalSemesters} terms)</span>
                </span>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

              <div>
                <span className="text-xs text-slate-500 block font-medium mb-1">Degree Audit Status</span>
                {audit.overallSatisfied ? (
                  <span className="inline-flex items-center text-xs font-bold text-blue-900 bg-blue-100 border border-blue-300 px-3 py-1.5 rounded-full shadow-sm">
                    <Award className="w-4 h-4 mr-1.5 text-[#002E5D]" /> All Requirements Completed
                  </span>
                ) : audit.overallEnrolledSatisfied ? (
                  <span className="inline-flex items-center text-xs font-bold text-blue-900 bg-blue-100 border border-blue-300 px-3 py-1.5 rounded-full shadow-sm">
                    <Award className="w-4 h-4 mr-1.5 text-blue-700" /> Plan Meets Requirements
                  </span>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-full shadow-sm">
                      <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" /> Degree Deficit (In Progress)
                    </span>
                    <span className="text-[11px] text-amber-700 font-semibold text-center">
                      Deficit: {[
                        audit.majorCreditsEnrolled < audit.majorCreditsRequired ? `${audit.majorCreditsRequired - audit.majorCreditsEnrolled} cr Major` : null,
                        audit.engElectivesCreditsEnrolled < 9 ? `${9 - audit.engElectivesCreditsEnrolled} cr Eng` : null,
                        audit.emsbCreditsEnrolled < 4 ? `${4 - audit.emsbCreditsEnrolled} cr EMSB` : null,
                        audit.epselCreditsEnrolled < 3 ? `${3 - audit.epselCreditsEnrolled} cr EPSEL` : null,
                        audit.genEdCreditsEnrolled < 14 ? `${14 - audit.genEdCreditsEnrolled} cr GenEd` : null,
                        audit.religionCreditsEnrolled < 14 ? `${14 - audit.religionCreditsEnrolled} cr Religion` : null,
                      ].filter(Boolean).join(' • ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} BYU Chemical Engineering Graduation Planner. Built for BYU Fulton College of Engineering.</p>
          <p className="mt-1 text-slate-500">Includes BYU Undergraduate Catalog (catalog.byu.edu) 300-400 level electives integration.</p>
        </div>
      </footer>
    </div>
  );
};
