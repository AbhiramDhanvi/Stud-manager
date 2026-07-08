/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, SortConfig } from '../types';
import { Edit2, Trash2, Check, X, Search, ArrowUpDown, ArrowUp, ArrowDown, GraduationCap, AlertCircle } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  onDeleteStudent: (rollNumber: string) => void;
  onUpdateStudent: (rollNumber: string, updatedData: { name: string; marks: number }) => void;
  sortConfig: SortConfig;
  onSort: (key: keyof Student) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function StudentTable({
  students,
  onDeleteStudent,
  onUpdateStudent,
  sortConfig,
  onSort,
  searchQuery,
  onSearchChange,
}: StudentTableProps) {
  // Inline editing state
  const [editingRollNumber, setEditingRollNumber] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editMarks, setEditMarks] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Start edit mode
  const startEdit = (student: Student) => {
    setEditingRollNumber(student.rollNumber);
    setEditName(student.name);
    setEditMarks(String(student.marks));
    setEditError(null);
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingRollNumber(null);
    setEditName('');
    setEditMarks('');
    setEditError(null);
  };

  // Save inline edits
  const handleSave = (rollNumber: string) => {
    setEditError(null);
    const cleanName = editName.trim();
    const cleanMarksStr = editMarks.trim();

    if (!cleanName || !cleanMarksStr) {
      setEditError("Fields cannot be empty.");
      return;
    }

    const marksNum = Number(cleanMarksStr);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      setEditError("Marks must be 0 - 100.");
      return;
    }

    onUpdateStudent(rollNumber, {
      name: cleanName,
      marks: marksNum,
    });
    setEditingRollNumber(null);
  };

  // Grade helper for displaying buckets
  const getGradeLetter = (marks: number) => {
    if (marks >= 90) return { letter: 'A', bg: 'bg-neo-green text-black' };
    if (marks >= 80) return { letter: 'B', bg: 'bg-[#66ff99] text-black' };
    if (marks >= 70) return { letter: 'C', bg: 'bg-[#b3ffd6] text-black' };
    if (marks >= 60) return { letter: 'D', bg: 'bg-[#e6ffec] text-black' };
    return { letter: 'F', bg: 'bg-red-400 text-black' };
  };

  // Highlighting matched search term inside strings
  const highlightText = (source: string | number, query: string) => {
    const text = String(source);
    if (!query) return <span>{text}</span>;

    const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-300 text-black font-extrabold px-0.5 border border-black/20 neo-shadow-sm">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Render sorting icons
  const renderSortIndicator = (key: keyof Student) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-gray-400 group-hover:text-black" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-black bg-neo-green border border-black" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-black bg-neo-green border border-black" />
    );
  };

  return (
    <div className="border-[6px] border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative flex flex-col h-full print-container">
      {/* Search Header (Hidden during prints) */}
      <div className="p-5 border-b-[6px] border-black bg-gray-50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 no-print">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black text-white">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-black">
            Student Register
          </h3>
        </div>

        {/* Smart Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-black" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roll no, name, or score..."
            className="w-full pl-10 pr-4 py-2.5 font-mono text-xs font-bold border-4 border-black bg-white text-black placeholder-gray-500 focus:bg-yellow-200 focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4 bg-black text-white rounded-full p-0.5 border border-black" />
            </button>
          )}
        </div>
      </div>

      {/* Inline edit validation message */}
      {editError && (
        <div className="bg-red-100 border-b-[6px] border-black p-3 font-mono text-xs font-extrabold flex items-center space-x-2 text-black no-print">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Inline Edit Error: {editError}</span>
        </div>
      )}

      {/* Table responsive view */}
      <div className="overflow-x-auto flex-1">
        {students.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-2 border-black border-dashed flex items-center justify-center font-mono font-bold text-gray-400">
              ?
            </div>
            <p className="font-mono text-xs font-bold text-gray-500 uppercase tracking-tight">
              {searchQuery ? "No search results match your criteria" : "Register is currently vacant."}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse print-table">
            <thead>
              <tr className="border-b-[6px] border-black bg-black text-white">
                {/* Roll Number Column Header */}
                <th 
                  onClick={() => onSort('rollNumber')}
                  className="p-4 font-mono text-xs font-black uppercase tracking-wider cursor-pointer select-none group no-print hover:bg-neo-green hover:text-black transition-colors"
                >
                  <div className="flex items-center">
                    <span>Roll Number</span>
                    {renderSortIndicator('rollNumber')}
                  </div>
                </th>
                <th className="p-4 font-mono text-xs font-black uppercase tracking-wider print-only hidden">
                  Roll Number
                </th>

                {/* Name Column Header */}
                <th 
                  onClick={() => onSort('name')}
                  className="p-4 font-mono text-xs font-black uppercase tracking-wider cursor-pointer select-none group no-print hover:bg-neo-green hover:text-black transition-colors"
                >
                  <div className="flex items-center">
                    <span>Full Name</span>
                    {renderSortIndicator('name')}
                  </div>
                </th>
                <th className="p-4 font-mono text-xs font-black uppercase tracking-wider print-only hidden">
                  Full Name
                </th>

                {/* Marks Column Header */}
                <th 
                  onClick={() => onSort('marks')}
                  className="p-4 font-mono text-xs font-black uppercase tracking-wider cursor-pointer select-none group no-print hover:bg-neo-green hover:text-black transition-colors"
                >
                  <div className="flex items-center">
                    <span>Marks (%)</span>
                    {renderSortIndicator('marks')}
                  </div>
                </th>
                <th className="p-4 font-mono text-xs font-black uppercase tracking-wider print-only hidden">
                  Marks (%)
                </th>

                {/* Grade Label Column */}
                <th className="p-4 font-mono text-xs font-black uppercase tracking-wider w-24">
                  Grade
                </th>

                {/* Actions (Hidden during prints) */}
                <th className="p-4 font-mono text-xs font-black uppercase tracking-wider text-right w-44 no-print">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-[6px] divide-black">
              {students.map((student) => {
                const isEditing = editingRollNumber === student.rollNumber;
                const { letter, bg } = getGradeLetter(student.marks);

                return (
                  <tr 
                    key={student.rollNumber} 
                    className="hover:bg-yellow-100 transition-colors font-mono text-xs text-black"
                  >
                    {/* Roll Number Field (Read only during inline editing) */}
                    <td className="p-4 font-black">
                      {isEditing ? (
                        <span className="bg-gray-100 border-2 border-black px-2 py-1.5 font-mono text-xs font-bold text-gray-500">
                          {student.rollNumber} (Locked)
                        </span>
                      ) : (
                        highlightText(student.rollNumber, searchQuery)
                      )}
                    </td>

                    {/* Name Field */}
                    <td className="p-4 font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border-2 border-black px-2 py-1 font-mono text-xs font-bold bg-white text-black focus:outline-none focus:bg-yellow-200 w-full"
                          autoFocus
                        />
                      ) : (
                        highlightText(student.name, searchQuery)
                      )}
                    </td>

                    {/* Marks Field */}
                    <td className="p-4 font-extrabold text-sm">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editMarks}
                          onChange={(e) => setEditMarks(e.target.value)}
                          className="border-2 border-black px-2 py-1 font-mono text-xs font-bold bg-white text-black focus:outline-none focus:bg-yellow-200 w-24"
                        />
                      ) : (
                        highlightText(`${student.marks}%`, searchQuery)
                      )}
                    </td>

                    {/* Grade Badge */}
                    <td className="p-4">
                      <span className={`px-3 py-1 font-extrabold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs ${bg}`}>
                        {letter}
                      </span>
                    </td>

                    {/* Operations Controls */}
                    <td className="p-4 text-right space-x-2 no-print">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(student.rollNumber)}
                            className="bg-neo-green hover:bg-neo-green-dark text-black border-2 border-black p-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center"
                            title="Save changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-red-400 hover:bg-red-500 text-black border-2 border-black p-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center"
                            title="Cancel edits"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(student)}
                            className="bg-white hover:bg-neo-green border-2 border-black p-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center"
                            title="Edit row inline"
                          >
                            <Edit2 className="w-4 h-4 text-black" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(student.rollNumber)}
                            className="bg-white hover:bg-red-400 border-2 border-black p-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4 text-black" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
