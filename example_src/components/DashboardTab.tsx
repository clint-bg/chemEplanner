import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { SimulationResult } from '../simulator/types';
import { INITIAL_COURSES } from '../data/classDetailsData';
import { Clock, Award, ArrowRight, CheckCircle2, BookOpen, Layers, Check } from 'lucide-react';

interface DashboardTabProps {
  baselineResult: SimulationResult;
  currentResult: SimulationResult;
  onNavigateToInterventions: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  baselineResult,
  currentResult,
  onNavigateToInterventions,
}) => {
  const avgDiff = Math.round((currentResult.averageGraduationSemesters - baselineResult.averageGraduationSemesters) * 10) / 10;
  const isImproved = avgDiff < 0;

  // Prepare chart data comparing baseline and current experiment year distributions
  const allSemesters = Array.from(
    new Set([
      ...Object.keys(baselineResult.semesterDistribution).map(Number),
      ...Object.keys(currentResult.semesterDistribution).map(Number),
    ])
  ).sort((a, b) => a - b);

  const distributionChartData = allSemesters.map((sem) => {
    const years = (sem / 2).toFixed(1);
    return {
      year: `${years} Yrs`,
      semLabel: `${sem} Sem (${years} Yrs)`,
      Baseline: baselineResult.semesterDistribution[sem] || 0,
      Experiment: currentResult.semesterDistribution[sem] || 0,
    };
  });

  // Prepare cumulative graduation chart data mapped to Years
  const cumulativeChartData = currentResult.cumulativeGraduation.map((item) => {
    const baselineItem = baselineResult.cumulativeGraduation.find((b) => b.semester === item.semester);
    const years = (item.semester / 2).toFixed(1);
    return {
      year: `${years} Yrs`,
      semLabel: `Sem ${item.semester} (${years} Yrs)`,
      BaselineRate: baselineItem ? baselineItem.rate : 0,
      ExperimentRate: item.rate,
    };
  });

  // Compute student credit hour summary statistics per category across cohort
  const courseMap = useMemo(() => new Map(INITIAL_COURSES.map((c) => [c.classId, c])), []);

  const computeCohortCreditSummary = useMemo(() => {
    return (result: SimulationResult) => {
      const totals: number[] = [];
      const major: number[] = [];
      const genEd: number[] = [];
      const rel: number[] = [];
      const engElec: number[] = [];
      const emsb: number[] = [];
      const epsel: number[] = [];
      const abetEng: number[] = [];
      const abetSci: number[] = [];

      result.students.forEach((student) => {
        let t = 0, m = 0, g = 0, r = 0, eng = 0, em = 0, ep = 0, abE = 0, abS = 0;

        student.completedCourses.forEach((cId) => {
          const c = courseMap.get(cId);
          if (!c) return;
          const cr = c.credits;
          t += cr;

          if (c.category === 'Major') m += cr;
          else if (c.category === 'Gen') g += cr;
          else if (c.category === 'Rel') r += cr;
          else if (c.category === 'Eng') eng += cr;
          else if (c.category === 'EMSB') em += cr;
          else if (c.category === 'EPSEL') ep += cr;

          if (c.abetCategory === 'Eng') abE += cr;
          else if (c.abetCategory === 'Sci') abS += cr;
        });

        totals.push(t);
        major.push(m);
        genEd.push(g);
        rel.push(r);
        engElec.push(eng);
        emsb.push(em);
        epsel.push(ep);
        abetEng.push(abE);
        abetSci.push(abS);
      });

      const getStats = (arr: number[]) => {
        if (arr.length === 0) return { min: 0, max: 0, avg: 0 };
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const sum = arr.reduce((a, b) => a + b, 0);
        const avg = Number((sum / arr.length).toFixed(1));
        return { min, max, avg };
      };

      return {
        totalCredits: getStats(totals),
        majorHours: getStats(major),
        genEd: getStats(genEd),
        religion: getStats(rel),
        engElectives: getStats(engElec),
        emsb: getStats(emsb),
        epsel: getStats(epsel),
        abetEng: getStats(abetEng),
        abetSci: getStats(abetSci),
      };
    };
  }, [courseMap]);

  const baselineSummary = useMemo(() => computeCohortCreditSummary(baselineResult), [computeCohortCreditSummary, baselineResult]);
  const experimentSummary = useMemo(() => computeCohortCreditSummary(currentResult), [computeCohortCreditSummary, currentResult]);

  const categoryRows = [
    {
      key: 'totalCredits',
      label: 'Total Graduation Credits',
      desc: 'All completed coursework required for degree completion',
      bStats: baselineSummary.totalCredits,
      eStats: experimentSummary.totalCredits,
      highlight: true,
    },
    {
      key: 'majorHours',
      label: 'Major Core Hours (CBE)',
      desc: 'Chemical Engineering major requirements (balances, transport, kinetics, labs)',
      bStats: baselineSummary.majorHours,
      eStats: experimentSummary.majorHours,
    },
    {
      key: 'genEd',
      label: 'General Education (Gen Ed)',
      desc: 'University general education (writing, history, civil, biology)',
      bStats: baselineSummary.genEd,
      eStats: experimentSummary.genEd,
    },
    {
      key: 'religion',
      label: 'Religion Requirements',
      desc: 'University religion & cornerstone coursework',
      bStats: baselineSummary.religion,
      eStats: experimentSummary.religion,
    },
    {
      key: 'engElectives',
      label: 'Engineering Electives (Eng)',
      desc: 'Advanced technical engineering electives (300+ level)',
      bStats: baselineSummary.engElectives,
      eStats: experimentSummary.engElectives,
    },
    {
      key: 'emsb',
      label: 'EMSB Electives',
      desc: 'Engineering, math, science, and business category electives',
      bStats: baselineSummary.emsb,
      eStats: experimentSummary.emsb,
    },
    {
      key: 'epsel',
      label: 'EPSEL Technical Electives',
      desc: 'Engineering project, senior elective, & research credits',
      bStats: baselineSummary.epsel,
      eStats: experimentSummary.epsel,
    },
    {
      key: 'abetEng',
      label: 'ABET Engineering Hours',
      desc: 'Total ABET-accredited engineering topic credits',
      bStats: baselineSummary.abetEng,
      eStats: experimentSummary.abetEng,
    },
    {
      key: 'abetSci',
      label: 'ABET Math & Science Hours',
      desc: 'Total ABET-accredited math & basic science credits',
      bStats: baselineSummary.abetSci,
      eStats: experimentSummary.abetSci,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Scenario Status */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-byu-navy/10 text-byu-navy font-semibold text-xs px-2.5 py-1 rounded-md uppercase tracking-wide">
              Simulation Cohort: {currentResult.cohortSize} Students
            </span>
            {avgDiff !== 0 && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isImproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'}`}>
                {isImproved ? `📉 ${Math.abs(avgDiff)} Semesters Faster` : `📈 +${avgDiff} Semesters Longer`}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-1">Undergraduate Graduation Time Analysis</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Simulating prerequisite chains, credit capacity limits, employment constraints, and course offering frequencies.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={onNavigateToInterventions}
            className="bg-byu-navy hover:bg-byu-royal text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center space-x-2"
          >
            <span>Modify Interventions</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards (3 Cards Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Semesters */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Graduation</span>
            <Clock className="h-5 w-5 text-byu-royal" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{currentResult.averageGraduationSemesters}</span>
            <span className="text-xs text-slate-500 font-medium">semesters</span>
          </div>
          <div className="mt-2 text-xs flex items-center text-slate-500">
            <span>Baseline: <strong className="text-slate-700">{baselineResult.averageGraduationSemesters}</strong> sem</span>
            {avgDiff !== 0 && (
              <span className={`ml-auto font-bold ${isImproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isImproved ? `${avgDiff} sem` : `+${avgDiff} sem`}
              </span>
            )}
          </div>
        </div>

        {/* 8-Semester Rate */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">8-Semester Grad Rate</span>
            <Award className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{currentResult.eightSemesterGradRate}%</span>
            <span className="text-xs text-emerald-600 font-medium">on-time</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>Baseline: <strong className="text-slate-700">{baselineResult.eightSemesterGradRate}%</strong> of cohort</span>
          </div>
        </div>

        {/* 10-Semester Rate */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">10-Semester Grad Rate</span>
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{currentResult.tenSemesterGradRate}%</span>
            <span className="text-xs text-blue-600 font-medium">cumulative</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>Baseline: <strong className="text-slate-700">{baselineResult.tenSemesterGradRate}%</strong> of cohort</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Distribution Histogram */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Graduation Time Distribution</h3>
              <p className="text-xs text-slate-500">Number of students graduating at each year mark (2 semesters = 1 year)</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center"><span className="w-3 h-3 bg-slate-400 rounded-sm mr-1.5 inline-block"></span> Baseline</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-byu-royal rounded-sm mr-1.5 inline-block"></span> Experiment</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  labelFormatter={(label, payload) => payload[0]?.payload?.semLabel || label}
                />
                <Bar dataKey="Baseline" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Experiment" fill="#0062B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cumulative Graduation Curve */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Cumulative Graduation Rate Curve</h3>
              <p className="text-xs text-slate-500">% of cohort graduated by year mark (2 semesters = 1 year)</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center"><span className="w-3 h-0.5 bg-slate-400 mr-1.5 inline-block"></span> Baseline</span>
              <span className="flex items-center"><span className="w-3 h-0.5 bg-emerald-600 mr-1.5 inline-block"></span> Experiment</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  labelFormatter={(label, payload) => payload[0]?.payload?.semLabel || label}
                  formatter={(val: any) => [`${val}%`, '']}
                />
                <Line type="monotone" dataKey="BaselineRate" stroke="#94A3B8" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ExperimentRate" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* STUDENT CREDIT HOUR & CURRICULUM SUMMARY SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-byu-royal" />
              <span>Student Credit Hour & Curriculum Breakdown Summary</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Average completed credit hours and full min–max range per student across curriculum categories (N = {currentResult.cohortSize} students).
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold self-start md:self-auto">
            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-md">
              Baseline Avg: <strong>{baselineSummary.totalCredits.avg} cr</strong> ({baselineSummary.totalCredits.min}–{baselineSummary.totalCredits.max} cr)
            </span>
            <span className="bg-byu-royal text-white px-3 py-1 rounded-md shadow-2xs">
              Experiment Avg: <strong>{experimentSummary.totalCredits.avg} cr</strong> ({experimentSummary.totalCredits.min}–{experimentSummary.totalCredits.max} cr)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Curriculum Category</th>
                <th className="px-5 py-3">Baseline Average</th>
                <th className="px-5 py-3">Baseline Range (Min–Max)</th>
                <th className="px-5 py-3">Experiment Average</th>
                <th className="px-5 py-3">Experiment Range (Min–Max)</th>
                <th className="px-5 py-3 text-right">Net Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categoryRows.map((row) => {
                const diff = Number((row.eStats.avg - row.bStats.avg).toFixed(1));
                const isDecreased = diff < 0;
                const isIncreased = diff > 0;

                return (
                  <tr
                    key={row.key}
                    className={`transition-colors ${
                      row.highlight
                        ? 'bg-blue-50/40 font-bold hover:bg-blue-50/70'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className={`block font-bold ${row.highlight ? 'text-byu-navy text-sm' : 'text-slate-900'}`}>
                        {row.label}
                      </span>
                      <span className="text-[11px] font-normal text-slate-500">{row.desc}</span>
                    </td>

                    {/* Baseline Avg */}
                    <td className="px-5 py-3.5 font-bold text-slate-800">
                      {row.bStats.avg} cr
                    </td>

                    {/* Baseline Range */}
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      {row.bStats.min} – {row.bStats.max} cr
                    </td>

                    {/* Experiment Avg */}
                    <td className="px-5 py-3.5 font-extrabold text-byu-royal">
                      {row.eStats.avg} cr
                    </td>

                    {/* Experiment Range */}
                    <td className="px-5 py-3.5 text-slate-700 font-medium">
                      {row.eStats.min} – {row.eStats.max} cr
                    </td>

                    {/* Net Change */}
                    <td className="px-5 py-3.5 text-right font-extrabold">
                      {diff === 0 ? (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                          0.0 cr
                        </span>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded text-[11px] font-extrabold ${
                            isDecreased
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {isDecreased ? `📉 ${diff} cr` : `📈 +${diff} cr`}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
