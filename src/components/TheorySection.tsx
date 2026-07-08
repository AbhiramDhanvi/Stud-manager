/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { THEORY_QUESTIONS } from '../data';
import { BookOpen, ChevronDown, ChevronUp, Terminal, Code } from 'lucide-react';

export default function TheorySection() {
  const [activeId, setActiveId] = useState<string | null>("q1");

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="border-[6px] border-black bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative no-print">
      {/* Corner Graphic */}
      <div className="absolute top-0 right-0 bg-black text-neo-green font-mono text-xs font-black px-3 py-1 border-b-4 border-l-4 border-black uppercase tracking-wider flex items-center space-x-1">
        <Terminal className="w-3.5 h-3.5" />
        <span>Vette-Theory</span>
      </div>

      <div className="flex items-center space-x-2.5 mb-6 border-b-4 border-black pb-4">
        <div className="w-9 h-9 bg-black text-neo-green border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-black">
            Theoretical Debriefing
          </h3>
          <p className="text-xs font-mono font-bold text-gray-500 uppercase tracking-tight mt-0.5">
            Difficulties Faced & Countermeasures Implemented
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {THEORY_QUESTIONS.map((item, index) => {
          const isOpen = activeId === item.id;
          return (
            <div 
              key={item.id} 
              className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden"
            >
              {/* Question Trigger Header */}
              <button
                onClick={() => toggleAccordion(item.id)}
                className="w-full text-left p-4 bg-gray-50 hover:bg-yellow-100 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-start space-x-3">
                  <span className="font-mono font-black text-xs bg-black text-white px-2 py-1 shrink-0 border-2 border-black">
                    Q{index + 1}
                  </span>
                  <span className="font-sans font-extrabold text-sm text-black leading-snug">
                    {item.question}
                  </span>
                </div>
                <div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-black shrink-0 border-2 border-black bg-white p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-black shrink-0 border-2 border-black bg-white p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                  )}
                </div>
              </button>

              {/* Collapsible Answer Body */}
              {isOpen && (
                <div className="p-4 border-t-4 border-black bg-white space-y-4">
                  {/* The Challenge Block */}
                  <div className="border-2 border-black p-3.5 bg-red-50 relative">
                    <span className="absolute top-0 right-4 -mt-2.5 bg-black text-white font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black">
                      The Obstacle
                    </span>
                    <p className="font-sans font-bold text-xs text-red-950 leading-relaxed pt-1">
                      {item.difficulty}
                    </p>
                  </div>

                  {/* The Mitigation Block */}
                  <div className="border-2 border-black p-3.5 bg-neo-green-light relative">
                    <span className="absolute top-0 right-4 -mt-2.5 bg-neo-green text-black font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black">
                      The Resolution
                    </span>
                    <div className="flex items-start space-x-2 pt-1">
                      <Code className="w-4 h-4 text-black shrink-0 mt-0.5" />
                      <p className="font-mono text-xs font-bold text-black leading-relaxed">
                        {item.countermeasure}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
