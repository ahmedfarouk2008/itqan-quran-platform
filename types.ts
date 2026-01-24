
export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum SessionType {
  LIVE = 'LIVE',
  RECORDED = 'RECORDED'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  level?: string;
  specialty?: string;
  points?: number;
  avatar: string;
}

export interface Session {
  id: string;
  title: string;
  teacherId: string;
  date: string;
  time: string;
  type: SessionType;
  studentIds: string[];
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  date: string;
  part: string;
}

export interface ProgressEntry {
  id: string;
  studentId: string;
  surah: string;
  ayahRange: string;
  grade: number;
  notes: string;
  date: string;
}
