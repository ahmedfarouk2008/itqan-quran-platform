// ==============================================
// إتقان - Type Definitions
// ==============================================

// ---------- User Types ----------
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export enum UserLevel {
  BEGINNER = 'مبتدئ',
  INTERMEDIATE = 'متوسط',
  ADVANCED = 'متقدم'
}

export enum LearningGoal {
  HIFZ = 'حفظ',
  TAJWEED = 'تجويد',
  TAFSEER = 'تفسير'
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  level?: UserLevel;
  goals?: LearningGoal[];
  timezone?: string;
  createdAt: string;
}

export interface Student extends User {
  role: UserRole.STUDENT;
  currentSurah?: string;
  currentAyah?: number;
  totalMemorized?: number; // Number of ayahs
  streak?: number; // Days streak
  points?: number;
  teacherId?: string;
}

export interface Teacher extends User {
  role: UserRole.TEACHER;
  specialty?: LearningGoal[];
  bio?: string;
  rating?: number;
  totalStudents?: number;
  availableSlots?: TimeSlot[];
}

// ---------- Session Types ----------
export enum SessionType {
  HIFZ = 'حفظ',
  TAJWEED = 'تجويد',
  TAFSEER = 'تفسير'
}

export enum SessionStatus {
  PENDING = 'قيد المراجعة',
  CONFIRMED = 'مؤكدة',
  CANCELLED = 'ملغاة',
  COMPLETED = 'مكتملة',
  IN_PROGRESS = 'جارية'
}

export enum SessionDuration {
  THIRTY = 30,
  FORTY_FIVE = 45,
  SIXTY = 60
}

export interface TimeSlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string;
  isRecurring: boolean;
}

export interface Session {
  id: string;
  studentId: string;
  teacherId: string;
  type: SessionType;
  status: SessionStatus;
  duration: SessionDuration;
  scheduledAt: string; // ISO date string
  notes?: string;
  summary?: SessionSummary;
  createdAt: string;
}

export interface SessionSummary {
  whatWasCovered: string;
  mistakes: string[];
  homework?: string;
  teacherNotes?: string;
  tags?: string[];
}

// ---------- Homework Types ----------
export enum HomeworkStatus {
  NOT_STARTED = 'لم يبدأ',
  SUBMITTED = 'تم الإرسال',
  REVIEWED = 'تم المراجعة'
}

export interface Homework {
  id: string;
  studentId: string;
  teacherId: string;
  title: string;
  description: string;
  type: SessionType;
  dueDate: string;
  status: HomeworkStatus;
  submission?: HomeworkSubmission;
  feedback?: HomeworkFeedback;
  createdAt: string;
}

export interface HomeworkSubmission {
  text?: string;
  audioUrl?: string;
  submittedAt: string;
}

export interface HomeworkFeedback {
  text: string;
  audioUrl?: string;
  errorTags?: string[];
  rating?: number; // 1-5
  reviewedAt: string;
}

// ---------- Learning Progress Types ----------
export interface MemorizationProgress {
  studentId: string;
  surah: string;
  surahNumber: number;
  totalAyahs: number;
  memorizedAyahs: number;
  lastAyahMemorized: number;
  checkpoints: MemorizationCheckpoint[];
  lastUpdated: string;
}

export interface MemorizationCheckpoint {
  ayahStart: number;
  ayahEnd: number;
  isCompleted: boolean;
  completedAt?: string;
  teacherNotes?: string;
}

export interface TajweedProgress {
  studentId: string;
  moduleId: string;
  moduleName: string;
  isCompleted: boolean;
  quizScore?: number;
  completedAt?: string;
}

export interface TafseerProgress {
  studentId: string;
  lessonId: string;
  lessonTitle: string;
  isCompleted: boolean;
  notes?: string;
  completedAt?: string;
}

// ---------- Message Types ----------
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

// ---------- Notification Types ----------
export enum NotificationType {
  SESSION_REMINDER = 'session_reminder',
  SESSION_CONFIRMED = 'session_confirmed',
  SESSION_CANCELLED = 'session_cancelled',
  HOMEWORK_ASSIGNED = 'homework_assigned',
  HOMEWORK_REVIEWED = 'homework_reviewed',
  NEW_MESSAGE = 'new_message',
  ACHIEVEMENT = 'achievement'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ---------- Quick Templates ----------
export interface QuickTemplate {
  id: string;
  text: string;
  category: 'reschedule' | 'question' | 'greeting' | 'other';
}

// ---------- Error Tags ----------
export const ERROR_TAGS = [
  'مخارج الحروف',
  'المدود',
  'الغنة',
  'الإدغام',
  'الإخفاء',
  'الإظهار',
  'الإقلاب',
  'الوقف والابتداء',
  'النطق',
  'الحفظ',
  'التشكيل',
  'أخرى'
] as const;

export type ErrorTag = typeof ERROR_TAGS[number];
