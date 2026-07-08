/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  rollNumber: string;
  name: string;
  marks: number;
}

export interface SortConfig {
  key: keyof Student | null;
  direction: 'asc' | 'desc';
}

export interface GradeStats {
  average: number;
  highest: Student | null;
  lowest: Student | null;
  passCount: number;
  failCount: number;
  total: number;
  passRate: number;
}

export interface GradeDistribution {
  A: number; // 90-100
  B: number; // 80-89
  C: number; // 70-79
  D: number; // 60-69
  F: number; // <60
}
