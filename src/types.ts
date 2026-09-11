export interface Section {
  id: string;
  title: string;
  content: string;
  mathFormulas?: string[];
  architectureDiagram?: string;
  takeaway: string;
}

export interface PythonCodeSnippet {
  title: string;
  filename: string;
  code: string;
  explanation: string;
  runnablePreset?: string;
}

export interface CourseLecture {
  id?: string;
  title: string;
  duration: string;
  embedId: string;
  videoUrl?: string;
  startTime?: number;
  topic?: string;
  lectureNumber?: number;
  description?: string;
}

export interface HandsOnLab {
  title: string;
  description: string;
  colabUrl?: string;
  githubUrl?: string;
  kaggleUrl?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Research Grade' | string;
  estimatedHours: string;
}

export interface HoursBreakdown {
  lecturesHours: number;
  labHours: number;
  readingHours: number;
  projectHours: number;
  totalHours: number;
}

export interface VideoResource {
  title: string;
  instructor: string;
  institution?: string;
  duration: string;
  totalCourseHours?: string;
  courseType?: 'Full University Course' | 'Complete Series' | 'Industry Masterclass' | 'Research Seminar' | string;
  videoUrl: string;
  embedId?: string;
  playlistId?: string;
  playlistUrl?: string;
  slidesUrl?: string;
  codeRepoUrl?: string;
  platform: 'YouTube' | 'Stanford' | 'MIT' | 'Conference' | 'JINNA AI Academy' | 'Fast.ai' | string;
  summary: string;
  keyTakeaways: string[];
  lectures?: CourseLecture[];
}

export interface ReferencePaper {
  title: string;
  authors: string;
  year: number;
  arxivUrl: string;
  githubUrl?: string;
  badge: string;
  citation: string;
}

export interface PracticalExercise {
  prompt: string;
  initialCode: string;
  expectedOutputHint: string;
  solutionCode: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  readTime: string;
  hoursBreakdown?: HoursBreakdown;
  sections: Section[];
  pythonCode: PythonCodeSnippet;
  videoResources: VideoResource[];
  handsOnLabs?: HandsOnLab[];
  referencePapers: ReferencePaper[];
  practicalExercise: PracticalExercise;
  interviewTips: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  estimatedHours: number;
  badge: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export interface UserProgress {
  completedLessons: string[];
  completedQuizzes: Record<number, { score: number; total: number; passed: boolean }>;
  completedLessonQuizzes?: Record<string, { score: number; total: number; passed: boolean }>;
  grandExamResult?: {
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    completedAt: string;
  };
  bypassLocking?: boolean;
  activeChapterId: number;
  activeLessonId: string;
  savedNotes: Record<string, string>;
  studentName?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isThinking?: boolean;
}

export interface AdsConfig {
  enabled: boolean;
  publisherId: string;
  adSlotId: string;
  showLessonAd: boolean;
  showBottomAd: boolean;
  testMode: boolean;
}
