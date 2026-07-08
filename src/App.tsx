/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Student, SortConfig } from './types';
import { INITIAL_STUDENTS } from './data';
import AnalyticsPanel from './components/AnalyticsPanel';
import GradeCharts from './components/GradeCharts';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import ReportActions from './components/ReportActions';
import TheorySection from './components/TheorySection';
import { GraduationCap, ShieldAlert, Sparkles, BookOpen, AlertCircle, LayoutDashboard, Database, HelpCircle } from 'lucide-react';

export default function App() {
  // Load initial student state with LocalStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('sms_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Keep state synced with localStorage
  useEffect(() => {
    localStorage.setItem('sms_students', JSON.stringify(students));
  }, [students]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // Add a student record
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  // Delete a student record
  const handleDeleteStudent = (rollNumber: string) => {
    setStudents((prev) => prev.filter((s) => s.rollNumber !== rollNumber));
  };

  // Update a student record inline
  const handleUpdateStudent = (rollNumber: string, updatedData: { name: string; marks: number }) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNumber === rollNumber ? { ...s, ...updatedData } : s))
    );
  };

  // Reset entire database back to initial seeds
  const handleResetDatabase = () => {
    if (window.confirm("⚠️ Reset Database: This will reload initial student records and purge custom entries. Proceed?")) {
      setStudents(INITIAL_STUDENTS);
      setSearchQuery('');
      setSortConfig({ key: null, direction: 'asc' });
    }
  };

  // Toggle column sorting criteria
  const handleSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Process sorting & search-filtering combined
  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    // 1. Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.rollNumber.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          String(s.marks).includes(q)
      );
    }

    // 2. Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        } else {
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }

    return result;
  }, [students, searchQuery, sortConfig]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-black pb-16 px-4 sm:px-6 lg:px-8 selection:bg-black selection:text-white">
      
      {/* 1. Global Navigation / Header Row (No-Print) */}
      <header className="max-w-7xl mx-auto pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-[8px] border-black mb-8 no-print">
        <div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none text-black uppercase">
            Student<br/>Mgmt Sys
          </h1>
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-black mt-2">
            STABLE STATE ENGINE &middot; CORE LIVE COMPILATION
          </p>
        </div>
        
        <div className="text-left md:text-right uppercase font-black text-black font-mono w-full md:w-auto">
          <div className="text-xl sm:text-2xl">Academic Year 2026</div>
          <div className="text-sm sm:text-lg mt-1">Lead Auditor: Dr. Elena Rostova</div>
          <div className="mt-3 flex items-center justify-start md:justify-end gap-3">
            <button
              onClick={handleResetDatabase}
              className="bg-black text-white hover:bg-white hover:text-black border-4 border-black px-4 py-2 text-xs font-mono font-black uppercase tracking-wider transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              🔄 Reset Database
            </button>
          </div>
        </div>
      </header>

      {/* 2. Primary Workspace (Bento Grid) */}
      <main className="max-w-7xl mx-auto space-y-8 mt-4">
        
        {/* Analytics Badges (Calculated on full student set) */}
        <AnalyticsPanel students={students} />

        {/* Live Visual Charts Row */}
        <GradeCharts students={filteredAndSortedStudents} />

        {/* Operations Hub (Forms and Rosters) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Intake */}
          <div className="lg:col-span-4 no-print">
            <StudentForm 
              students={students} 
              onAddStudent={handleAddStudent} 
            />

            {/* Micro Quick Info Card */}
            <div className="mt-6 border-4 border-black bg-white p-5 neo-shadow-sm text-xs font-mono font-bold space-y-2 text-black">
              <p className="uppercase border-b-2 border-black pb-1 text-gray-900 font-extrabold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-black" /> Quick Operations Guide
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 font-medium">
                <li>Double check <strong className="text-black">Roll Number</strong> uniqueness.</li>
                <li>Submit scores in the <strong className="text-black">0 - 100</strong> scale.</li>
                <li>Press <strong className="text-black">Edit (✏️)</strong> to edit values inline.</li>
                <li>Export as <strong className="text-black">CSV</strong> for spreadsheet utility.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Table */}
          <div className="lg:col-span-8 h-full flex flex-col justify-stretch">
            <StudentTable
              students={filteredAndSortedStudents}
              onDeleteStudent={handleDeleteStudent}
              onUpdateStudent={handleUpdateStudent}
              sortConfig={sortConfig}
              onSort={handleSort}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

        </div>

        {/* CSV Export & Print Hub (No-Print) */}
        <ReportActions students={students} />

        {/* Theoretical Interview Answers (No-Print) */}
        <TheorySection />

      </main>

      {/* Print-Only Wrapper triggers off standard hidden report elements */}
      <footer className="max-w-7xl mx-auto mt-12 border-t-4 border-black pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono font-bold text-gray-500 no-print">
        <p>Student Management System &copy; 2026. Built in brutalist high contrast.</p>
        <p className="mt-1 sm:mt-0">Audit Scope: Active Live Client State</p>
      </footer>
    </div>
  );
}
