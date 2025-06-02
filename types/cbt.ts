export interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "fill-blank" | "essay" | "matching"
  question: string
  options?: string[]
  correctAnswer?: string | string[]
  points: number
  timeLimit?: number // in seconds, optional per-question time limit
  allowCalculator?: boolean
  explanation?: string
  difficulty?: "easy" | "medium" | "hard"
  category?: string
  image?: string
}

export interface ExamSchedule {
  id: string
  startDate: string // ISO string
  endDate: string // ISO string
  timezone: string
  allowEarlyStart: boolean
  allowLateSubmission: boolean
  lateSubmissionPenalty: number // percentage penalty
  maxLateMinutes: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ExamAvailability {
  isAvailable: boolean
  status: "not-started" | "active" | "ended" | "late-submission" | "closed"
  message: string
  timeUntilStart?: number // seconds
  timeUntilEnd?: number // seconds
  timeUntilClosure?: number // seconds
  canStart: boolean
  canSubmit: boolean
  penaltyPercentage?: number
}

export interface ExamConfig {
  title: string
  description: string
  timeLimit: number // in minutes
  totalQuestions: number
  passingScore: number // percentage
  allowCalculator: boolean
  allowBackNavigation: boolean
  randomizeQuestions: boolean
  randomizeOptions: boolean
  showResultsImmediately: boolean
  maxAttempts: number
  enableTabSwitchDetection: boolean
  enableFullScreenMode: boolean
  enableCopyPasteProtection: boolean
  enableRightClickProtection: boolean
  autoSubmitOnTimeExpiry: boolean
  showTimeWarnings: boolean
  timeWarningIntervals: number[] // minutes before expiry
  enableAutoSave: boolean
  autoSaveInterval: number // seconds
  schedule?: ExamSchedule
}

export interface ExamAttempt {
  id: string
  examId: string
  studentId: string
  startTime: Date | string
  endTime?: Date | string
  answers: Record<string, string | string[]>
  score?: number
  status: "in-progress" | "completed" | "abandoned"
  tabSwitchCount: number
  violations: string[]
  isLateSubmission?: boolean
  penaltyApplied?: number
}

export interface ExamData {
  config: ExamConfig
  questions: Question[]
}

export interface StudentInfo {
  name: string
  id: string
  email?: string
}

export interface StudentAnswerData {
  studentInfo: StudentInfo
  examTitle: string
  examId: string
  attempt: ExamAttempt
  questions: Question[]
  submissionTime: string
}

export interface ExamReport {
  studentInfo: StudentInfo
  examConfig: ExamConfig
  attempt: ExamAttempt
  questions: Question[]
  detailedAnswers: {
    questionId: string
    question: string
    studentAnswer: string | string[]
    correctAnswer: string | string[]
    isCorrect: boolean
    points: number
    earnedPoints: number
  }[]
  summary: {
    totalQuestions: number
    answeredQuestions: number
    correctAnswers: number
    totalPoints: number
    earnedPoints: number
    percentage: number
    passed: boolean
    timeSpent: number
    violations: string[]
    tabSwitchCount: number
  }
}
