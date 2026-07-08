/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Student, GradeStats } from '../types';
import { Award, GraduationCap, TrendingDown, Percent, Users, Sparkles } from 'lucide-react';

interface AnalyticsPanelProps {
  students: Student[];
}

export default function AnalyticsPanel({ students }: AnalyticsPanelProps) {
  const stats: GradeStats = useMemo(() => {
    if (students.length === 0) {
      return {
        average: 0,
        highest: null,
        lowest: null,
        passCount: 0,
        failCount: 0,
        total: 0,
        passRate: 0,
      };
    }

    const total = students.length;
    let sum = 0;
    let highest: Student = students[0];
    let lowest: Student = students[0];
    let passCount = 0;
    let failCount = 0;

    students.forEach((s) => {
      sum += s.marks;
      if (s.marks > highest.marks) highest = s;
      if (s.marks < lowest.marks) lowest = s;
      if (s.marks >= 40) {
        passCount++;
      } else {
        failCount++;
      }
    });

    return {
      average: Number((sum / total).toFixed(1)),
      highest,
      lowest,
      passCount,
      failCount,
      total,
      passRate: Number(((passCount / total) * 100).toFixed(1)),
    };
  }, [students]);

  if (students.length === 0) {
    return (
      <div className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-neo-green border-[4px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <GraduationCap className="w-8 h-8 text-black" />
        </div>
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tight text-black">No Class Analytics</h3>
          <p className="text-gray-800 font-mono text-sm font-bold mt-1">Please add students to calculate metrics dynamically.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
      {/* Average Card */}
      <div className="border-[6px] border-black bg-white p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-neo-green/10 -mr-4 -mt-4 rotate-45 group-hover:bg-neo-green/30 transition-colors" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 border-2 border-black">
            Class Average
          </span>
          <div className="w-10 h-10 bg-neo-green border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <GraduationCap className="w-5 h-5 text-black" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-black font-mono text-black">
            {stats.average}
          </span>
          <span className="text-sm font-black text-gray-500">/ 100</span>
        </div>
        <p className="text-xs font-mono font-bold text-black mt-2">
          Based on {stats.total} enrolled student{stats.total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Highest Scorer */}
      <div className="border-[6px] border-black bg-neo-green p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-black/5 -mr-4 -mt-4 rotate-45" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 border-2 border-black">
            Top Scorer
          </span>
          <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Award className="w-5 h-5 text-black" />
          </div>
        </div>
        <div>
          <span className="text-4xl font-black font-mono text-black block truncate">
            {stats.highest?.marks}%
          </span>
          <span className="text-xs font-black text-black truncate block mt-1 uppercase tracking-tight">
            👑 {stats.highest?.name} ({stats.highest?.rollNumber})
          </span>
        </div>
      </div>

      {/* Lowest Scorer */}
      <div className="border-[6px] border-black bg-white p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 -mr-4 -mt-4 rotate-45" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 border-2 border-black">
            Lowest Scorer
          </span>
          <div className="w-10 h-10 bg-red-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <TrendingDown className="w-5 h-5 text-black" />
          </div>
        </div>
        <div>
          <span className="text-4xl font-black font-mono text-black block truncate">
            {stats.lowest?.marks}%
          </span>
          <span className="text-xs font-black text-black/80 truncate block mt-1 uppercase tracking-tight">
            ⚠️ {stats.lowest?.name} ({stats.lowest?.rollNumber})
          </span>
        </div>
      </div>

      {/* Pass / Fail Rate */}
      <div className="border-[6px] border-black bg-white p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-neo-green/10 -mr-4 -mt-4 rotate-45" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 border-2 border-black">
            Pass Ratio
          </span>
          <div className="w-10 h-10 bg-neo-green-light border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Percent className="w-5 h-5 text-black" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-black font-mono text-black">
            {stats.passRate}%
          </span>
        </div>
        <div className="text-xs font-black text-black/80 mt-2 flex items-center justify-between">
          <span>Passed: <strong className="text-green-700">{stats.passCount}</strong></span>
          <span>Failed: <strong className="text-red-600">{stats.failCount}</strong></span>
        </div>
      </div>
    </div>
  );
}
