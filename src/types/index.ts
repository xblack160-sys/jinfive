// ============================================
// Complete Type Definitions for JINNA 5
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  language: 'ar' | 'en';
  role: 'student' | 'instructor' | 'admin';
  subscriptionPlan: 'free' | 'starter' | 'pro' | 'unlimited';
  subscriptionActive: boolean;
  subscriptionExpiresAt?: Date;
  completedLessons: number;
  totalHoursLearned: number;
  overallProgress: number;
  joinedAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
  socialLinks?: SocialLinks;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  publicProfile: boolean;
  allowMessaging: boolean;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  titleAr?: string;
  description: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  sections: LessonSection[];
  codeSnippets: CodeSnippet[];
  videoResources: VideoResource[];
  resources: Resource[];
  quiz?: Quiz;
  prerequisites: string[]; // lesson IDs
  order: number;
}

export interface LessonSection {
  id: string;
  type: 'theory' | 'practice' | 'exercise';
  title: string;
  titleAr?: string;
  content: string; // Markdown
  latex?: string; // LaTeX formulas
}

export interface CodeSnippet {
  id: string;
  language: 'python' | 'cuda' | 'cpp' | 'javascript';
  code: string;
  explanation: string;
  explanationAr?: string;
  output?: string;
}

export interface VideoResource {
  id: string;
  title: string;
  titleAr?: string;
  embedId: string; // YouTube video ID
  platform: 'youtube' | 'vimeo' | 'internal';
  duration: number; // seconds
  instructor?: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'paper' | 'github' | 'blog' | 'documentation';
  author?: string;
}

export interface Chapter {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  lessons: Lesson[];
  order: number;
  icon?: string;
  color?: string;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // minutes
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionAr?: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'code';
  options?: string[];
  optionsAr?: string[];
  correct: number | string;
  explanation?: string;
  explanationAr?: string;
  points: number;
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  progress: number; // 0-100
  score?: number;
  startedAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  issuedAt: Date;
  certificateUrl: string;
  verificationCode: string;
  verificationUrl: string;
  qrCode: string;
  completedHours: number;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'starter' | 'pro' | 'unlimited';
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: number; // cents
  currency: string;
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'canceled';
  plan: string;
  createdAt: Date;
  invoiceUrl?: string;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lessonId?: string;
  chapterId?: string;
  title: string;
  content: string;
  tags: string[];
  views: number;
  likes: number;
  replies: number;
  isAnswered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumReply {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'lesson_completed' | 'certificate_earned' | 'forum_reply' | 'system' | 'promotion';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface CourseStats {
  totalStudents: number;
  activeStudents: number;
  totalHoursTaught: number;
  averageRating: number;
  certificatesIssued: number;
  completionRate: number;
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalLessons: number;
  certificatesIssued: number;
  hoursTeached: number;
  averageRating: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export type Language = 'ar' | 'en';

export interface SubscriptionPlan {
  id: 'starter' | 'pro' | 'unlimited';
  name: string;
  nameAr: string;
  price: number; // USD
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  featuresAr: string[];
  stripePriceId: string;
  maxCourses?: number;
  certificatesPerMonth?: number;
  communityAccess: boolean;
  prioritySupport: boolean;
}
