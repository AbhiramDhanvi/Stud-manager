/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { rollNumber: "101", name: "Alex Mercer", marks: 92 },
  { rollNumber: "102", name: "Beatrix Kiddo", marks: 88 },
  { rollNumber: "103", name: "Cobb Mal", marks: 45 },
  { rollNumber: "104", name: "Dana Scully", marks: 76 },
  { rollNumber: "105", name: "Elio Perlman", marks: 58 },
  { rollNumber: "106", name: "Fox Mulder", marks: 81 },
];

export interface TheoryQA {
  id: string;
  question: string;
  difficulty: string;
  countermeasure: string;
}

export const THEORY_QUESTIONS: TheoryQA[] = [
  {
    id: "q1",
    question: "How do you ensure data integrity and prevent duplicate roll numbers when managing state on the client side?",
    difficulty: "In standard HTML forms, basic validation only checks for empty inputs or numeric constraints. However, in a Student Management System, 'Roll Number' serves as a unique primary identifier. Simply checking fields for non-emptiness would allow adding multiple students with the exact same roll number, corrupting analytics, search, and deletion logic.",
    countermeasure: "We resolved this by writing a robust pre-submission validation routine. Before modifying the student array state, the handler normalizes the input roll number (trimming whitespaces) and runs a check against the existing student list using `.some()`. If a collision is detected, a custom, high-visibility visual alert is triggered, and form submission is halted. The roll number field is automatically highlighted to guide the user's focus."
  },
  {
    id: "q2",
    question: "What are the complexities of implementing in-place inline editing in a highly responsive table without modal overlays?",
    difficulty: "When implementing 'Inline Edit Mode', clicking edit changes a specific table row into input fields. A naive implementation of editing active state would overwrite the global student list immediately during typing, causing: 1) data loss if the user cancels, 2) chaotic layout jumps, and 3) infinite state recalculations in downstream chart sub-components on every single keystroke.",
    countermeasure: "We countered this by separating the 'Active Edit State' from the main student list. When a row enters edit mode, we copy its data into a local `editingStudent` state variable inside the row or parent container. All keystrokes are captured strictly within this temporary buffer. Only when the user clicks 'Save' do we trigger a parent action that updates the master array. If the user clicks 'Cancel', the temporary state is discarded, instantly restoring the pristine original record."
  },
  {
    id: "q3",
    question: "How do you preserve high-performance sorting and searching while highlighting matched search terms in real-time inside the JSX render loop?",
    difficulty: "Highlighting matched text dynamically requires splitting string results on search keywords and wrapping the matching segments in visual tags (like a yellow `<mark>`). However, doing this during rendering while handling multi-column sorting and filtering can cause severe lag, infinite re-renders, and break column layouts due to non-sanitized HTML tags or disrupted text nodes.",
    countermeasure: "We implemented a clean, memoized text-splitting utility. It processes name, roll number, and marks by escaping special regex characters, locating the index of the lowercase query, and splitting the string into an array of parts (matched and unmatched). This is wrapped inside standard React state filters and a `useMemo` block that guarantees that filtering, sorting, and highlighting only re-run when the search query or sorting parameters actually change."
  }
];
