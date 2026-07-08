/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Student, GradeStats } from '../types';
import { Download, Printer, Share2, Calendar, User } from 'lucide-react';

interface ReportActionsProps {
  students: Student[];
}

export default function ReportActions({ students }: ReportActionsProps) {
  // Calculates stats on the fly for the print summary block
  const stats = React.useMemo(() => {
    if (students.length === 0) return null;
    
    let sum = 0;
    let highest = students[0];
    let lowest = students[0];
    let passCount = 0;

    students.forEach((s) => {
      sum += s.marks;
      if (s.marks > highest.marks) highest = s;
      if (s.marks < lowest.marks) lowest = s;
      if (s.marks >= 40) passCount++;
    });

    return {
      average: (sum / students.length).toFixed(1),
      highest,
      lowest,
      passRate: ((passCount / students.length) * 100).toFixed(1),
      total: students.length,
    };
  }, [students]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (students.length === 0) return;

    // Header row
    const headers = ['Roll Number', 'Student Name', 'Marks (%)', 'Grade Status'];
    
    // Data rows
    const rows = students.map((s) => {
      const status = s.marks >= 40 ? 'PASS' : 'FAIL';
      // Escape commas inside quotes
      const escapedName = `"${s.name.replace(/"/g, '""')}"`;
      return [s.rollNumber, escapedName, s.marks, status].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `student_management_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger browser print
  const triggerPrint = () => {
    window.print();
  };

  const hasData = students.length > 0;

  return (
    <>
      {/* 1. Normal Visual Toolbar (No-Print) */}
      <div className="border-[6px] border-black bg-black p-5 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-neo-green inline-block border-2 border-black animate-pulse" />
          <p className="font-mono text-xs font-black text-white uppercase tracking-wider">
            Reports & Exports Terminal
          </p>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            disabled={!hasData}
            className={`flex-1 sm:flex-initial border-4 border-black bg-white text-black hover:bg-neo-green font-mono text-xs font-black uppercase px-5 py-2.5 flex items-center justify-center space-x-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
              !hasData ? 'opacity-50 cursor-not-allowed hover:bg-white' : ''
            }`}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={triggerPrint}
            disabled={!hasData}
            className={`flex-1 sm:flex-initial border-4 border-black bg-neo-green text-black hover:bg-white font-mono text-xs font-black uppercase px-5 py-2.5 flex items-center justify-center space-x-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
              !hasData ? 'opacity-50 cursor-not-allowed hover:bg-neo-green' : ''
            }`}
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 2. Hidden Print-Only High-Fidelity Report Layout */}
      {stats && (
        <div className="print-only hidden bg-white text-black p-8 font-mono max-w-4xl mx-auto border-double border-4 border-black mt-4">
          {/* Header Frame */}
          <div className="border-b-4 border-black pb-4 mb-6 text-center">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
              STUDENT MANAGEMENT SYSTEM
            </h1>
            <p className="text-sm font-extrabold tracking-widest text-gray-700 uppercase">
              Official Class Performance Ledger
            </p>
          </div>

          {/* Audit Metadata */}
          <div className="grid grid-cols-2 gap-4 border-2 border-black p-4 bg-gray-50 mb-6">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span><strong>Lead Auditor:</strong> Abhiram C R</span>
              </div>
              <div>
                <span><strong>Role:</strong> Class Administrator</span>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-right">
              <div className="flex items-center justify-end space-x-2">
                <Calendar className="w-4 h-4" />
                <span><strong>Audit Date:</strong> July 8, 2026</span>
              </div>
              <div>
                <span><strong>Report Scope:</strong> Enrolled Cohort</span>
              </div>
            </div>
          </div>

          {/* Core Analytics Summary Block */}
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-wider mb-2 border-b-2 border-black pb-1">
              I. Class Statistics Summary
            </h3>
            <div className="grid grid-cols-4 gap-4 text-xs text-center">
              <div className="border-2 border-black p-2 bg-gray-50">
                <span className="block text-gray-600 font-bold uppercase text-[9px]">Total Students</span>
                <span className="text-lg font-black">{stats.total}</span>
              </div>
              <div className="border-2 border-black p-2 bg-gray-50">
                <span className="block text-gray-600 font-bold uppercase text-[9px]">Class Average</span>
                <span className="text-lg font-black">{stats.average}%</span>
              </div>
              <div className="border-2 border-black p-2 bg-gray-50">
                <span className="block text-gray-600 font-bold uppercase text-[9px]">Highest Mark</span>
                <span className="text-lg font-black">{stats.highest.marks}% ({stats.highest.rollNumber})</span>
              </div>
              <div className="border-2 border-black p-2 bg-gray-50">
                <span className="block text-gray-600 font-bold uppercase text-[9px]">Pass Percentage</span>
                <span className="text-lg font-black">{stats.passRate}%</span>
              </div>
            </div>
          </div>

          {/* Table Spacer - the actual table will be copied or rendered by the main component printed print-table structure */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-2 border-b-2 border-black pb-1">
              II. Student Register Breakdown
            </h3>
            <table className="w-full text-left border-collapse border-2 border-black">
              <thead>
                <tr className="bg-black text-white text-xs border-b-2 border-black">
                  <th className="p-2 font-black uppercase">Roll Number</th>
                  <th className="p-2 font-black uppercase">Full Name</th>
                  <th className="p-2 font-black uppercase">Marks (%)</th>
                  <th className="p-2 font-black uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black text-xs">
                {students.map((student) => (
                  <tr key={student.rollNumber} className="border-b border-black">
                    <td className="p-2 font-bold">{student.rollNumber}</td>
                    <td className="p-2">{student.name}</td>
                    <td className="p-2 font-bold">{student.marks}%</td>
                    <td className="p-2 font-black">
                      {student.marks >= 40 ? (
                        <span className="text-green-800">PASS</span>
                      ) : (
                        <span className="text-red-700">FAIL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legal / Institutional Footers */}
          <div className="mt-12 pt-4 border-t-2 border-black border-dashed flex justify-between items-center text-[10px] text-gray-500">
            <div>
              <span>System Verification Hash: SMS-VERIFY-2026-ABHIRAM</span>
            </div>
            <div className="text-right">
              <span>Authorized Signature: _______________________</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
