/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Student, GradeDistribution } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart2, PieChart as PieIcon, HelpCircle } from 'lucide-react';

interface GradeChartsProps {
  students: Student[];
}

export default function GradeCharts({ students }: GradeChartsProps) {
  // 1. Prepare data for individual student marks bar chart
  const barData = useMemo(() => {
    return students.map((s) => ({
      name: s.name,
      roll: s.rollNumber,
      marks: s.marks,
    }));
  }, [students]);

  // 2. Prepare data for grade distribution donut chart
  const donutData = useMemo(() => {
    const distribution: GradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    students.forEach((s) => {
      if (s.marks >= 90) distribution.A++;
      else if (s.marks >= 80) distribution.B++;
      else if (s.marks >= 70) distribution.C++;
      else if (s.marks >= 60) distribution.D++;
      else distribution.F++;
    });

    return [
      { name: 'Grade A (90-100)', value: distribution.A, color: '#00ff00' }, // bright neo green
      { name: 'Grade B (80-89)', value: distribution.B, color: '#80ff80' },  // medium light green
      { name: 'Grade C (70-79)', value: distribution.C, color: '#b3ffb3' },  // soft mint green
      { name: 'Grade D (60-69)', value: distribution.D, color: '#e6ffe6' },  // very pale green
      { name: 'Grade F (<60)', value: distribution.F, color: '#ff4d4d' },    // vibrant warning red
    ].filter(item => item.value > 0); // Only render categories with students
  }, [students]);

  const hasData = students.length > 0;

  // Custom tooltips with Brutalist styling (thick borders, mono fonts, zero rounding)
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-xs text-black">
          <p className="font-bold text-black border-b-2 border-black pb-1 mb-1 uppercase">
            {data.name}
          </p>
          <p className="text-black font-semibold">Roll: {data.roll}</p>
          <p className="text-black font-extrabold text-sm mt-1">
            Marks: <span className="bg-neo-green px-1.5 py-0.5 border border-black">{data.marks}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-xs text-black">
          <p className="font-bold uppercase tracking-tight text-black" style={{ color: '#000000' }}>
            {data.name}
          </p>
          <p className="text-black font-bold mt-1">
            Count: <span className="bg-black text-white px-2 py-0.5">{data.value} student(s)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!hasData) {
    return null; // Parent takes care of empty analytics displays
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
      {/* Bar Chart Container */}
      <div className="lg:col-span-7 border-[6px] border-black bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black text-neo-green">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">
              Performance Distribution
            </h3>
          </div>
          <span className="text-xs font-mono bg-neo-green text-black px-2.5 py-1 border-2 border-black font-bold">
            LIVE ANALYTICS
          </span>
        </div>

        <div className="h-[300px] w-full font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#000000"
                tickLine={{ stroke: '#000000', strokeWidth: 2 }}
                tick={{ fill: '#000000', fontWeight: 'bold' }}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#000000"
                tickLine={{ stroke: '#000000', strokeWidth: 2 }}
                tick={{ fill: '#000000', fontWeight: 'bold' }}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0, 255, 0, 0.15)' }} />
              <Bar 
                dataKey="marks" 
                fill="#00ff00" 
                stroke="#000000" 
                strokeWidth={3}
                label={{ position: 'top', fill: '#000000', fontWeight: 'extrabold', fontFamily: 'monospace' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart Container */}
      <div className="lg:col-span-5 border-[6px] border-black bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black text-neo-green">
              <PieIcon className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">
              Grade Distribution
            </h3>
          </div>
          <span className="text-xs font-mono bg-black text-white px-2.5 py-1 border-2 border-black font-bold">
            {donutData.length} BUCKETS
          </span>
        </div>

        {donutData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center border-2 border-dashed border-black">
            <span className="font-mono text-xs text-gray-500">Awaiting grade metrics...</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-[250px]">
            {/* Visual Pie */}
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#000000"
                    strokeWidth={2}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Interactive Legend */}
            <div className="w-full sm:w-1/2 flex flex-col space-y-2.5 justify-center">
              {donutData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between border-2 border-black p-1.5 bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="inline-block w-4 h-4 border-2 border-black shrink-0" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="font-mono text-xs font-bold text-black">
                      {entry.name.split(' ')[1]}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-extrabold bg-black text-white px-2 py-0.5 border border-black">
                    {entry.value} student{entry.value > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
