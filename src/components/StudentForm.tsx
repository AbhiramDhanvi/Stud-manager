/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student } from '../types';
import { PlusCircle, AlertOctagon, RotateCcw, UserPlus } from 'lucide-react';

interface StudentFormProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
}

export default function StudentForm({ students, onAddStudent }: StudentFormProps) {
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [marks, setMarks] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanRoll = rollNumber.trim();
    const cleanName = name.trim();
    const cleanMarksStr = marks.trim();

    // 1. Basic Empty Check
    if (!cleanRoll || !cleanName || !cleanMarksStr) {
      setError("❌ Validation Error: All fields (Roll Number, Name, Marks) are mandatory!");
      return;
    }

    // 2. Marks Range and Numeric Validation
    const marksNum = Number(cleanMarksStr);
    if (isNaN(marksNum)) {
      setError("❌ Validation Error: Marks must be a valid numeric score.");
      return;
    }
    if (marksNum < 0 || marksNum > 100) {
      setError("❌ Validation Error: Marks must be a percentage score between 0 and 100.");
      return;
    }

    // 3. Duplicate Roll Number Check
    const rollExists = students.some(
      (s) => s.rollNumber.toLowerCase() === cleanRoll.toLowerCase()
    );
    if (rollExists) {
      setError(`❌ Conflict Error: A student with Roll Number "${cleanRoll}" already exists!`);
      return;
    }

    // All validation passed, trigger add action
    onAddStudent({
      rollNumber: cleanRoll,
      name: cleanName,
      marks: marksNum,
    });

    // Reset Form Fields
    setRollNumber('');
    setName('');
    setMarks('');
    setError(null);
  };

  const handleClear = () => {
    setRollNumber('');
    setName('');
    setMarks('');
    setError(null);
  };

  return (
    <div className="border-[6px] border-black bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative no-print">
      {/* Decorative Corner Flag */}
      <div className="absolute top-0 right-0 bg-black text-neo-green font-mono text-xs font-black px-3 py-1 border-b-4 border-l-4 border-black uppercase tracking-wider">
        Enrollment Desk
      </div>

      <div className="flex items-center space-x-2.5 mb-6 border-b-4 border-black pb-4">
        <div className="w-9 h-9 bg-neo-green border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] text-black">
          <UserPlus className="w-5 h-5" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight text-black">
          Input Portal
        </h3>
      </div>

      {error && (
        <div className="mb-6 border-4 border-black bg-red-100 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start space-x-3 text-black">
          <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="font-mono text-xs font-extrabold leading-relaxed">
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Roll Number Input */}
        <div>
          <label className="block font-black text-sm uppercase tracking-wider text-black mb-1 font-mono">
            Roll Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="e.g. 101"
            className="w-full border-4 border-black p-3 text-xl font-bold bg-white text-black focus:bg-yellow-200 focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="block font-black text-sm uppercase tracking-wider text-black mb-1 font-mono">
            Student Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full border-4 border-black p-3 text-xl font-bold bg-white text-black focus:bg-yellow-200 focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        {/* Marks Input */}
        <div>
          <label className="block font-black text-sm uppercase tracking-wider text-black mb-1 font-mono">
            Current Marks <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="0-100"
            className="w-full border-4 border-black p-3 text-xl font-bold bg-white text-black focus:bg-yellow-200 focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            className="w-full bg-black text-white text-2xl font-black py-4 uppercase border-4 border-black hover:bg-white hover:text-black transition-colors cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Commit Record +
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            className="w-full border-4 border-black bg-white hover:bg-gray-100 text-black font-extrabold uppercase text-xs tracking-widest py-2 flex items-center justify-center space-x-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Fields</span>
          </button>
        </div>
      </form>
    </div>
  );
}
