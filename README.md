# ast-secure-cbt-system

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/damidreys-projects/v0-ast-secure-cbt-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/vnKrpub3dnG)

## Overview

AST Secure CBT System is a modern, browser-based Computer-Based Testing (CBT) platform with strong proctoring, flexible scheduling, rich question types, and comprehensive reporting. It’s built with Next.js App Router and Tailwind CSS, and ships an end-to-end flow:

- Author exams in an Admin Panel and export as JSON
- Schedule access windows with timezone-aware rules and penalties for late submissions
- Deliver secure test sessions with tab switch detection, copy/paste and right-click protection, and optional fullscreen
- Record attempts, score automatically, and generate printable/downloadable comprehensive reports

The app is structured as a single-page experience with multiple views: Admin Panel, Student Dashboard, Exam Player, Result Checker, and Results Summary.

## Key Features

- Security & Proctoring
  - Tab switching detection and window blur tracking via `hooks/use-security.ts`
  - Optional fullscreen mode and violation logging
  - Copy/paste and right‑click protection; keyboard shortcut blocking (e.g., Ctrl+C/V, F12)
  - Violation badges and late‑submission penalties reflected in results

- Exam Authoring (Admin Panel)
  - Create and edit rich question types: multiple choice, true/false, fill‑in‑the‑blank, essay, and matching
  - Control points, difficulty, categories, per‑question calculator allowlist
  - Configure exam behavior: time limit, total questions, passing score, attempts, randomization, auto‑save, auto‑submit
  - Import/export full exams as JSON files
  - `components/admin-panel.tsx`, `components/exam-scheduler.tsx`

- Scheduling & Availability
  - Time window with timezone selection, early start, late submission with penalty, and max late minutes
  - Clear availability states: not‑started, open, late‑submission, closed
  - `hooks/use-exam-schedule.ts` powers availability checks across views

- Secure Exam Player
  - Timer with warning intervals and optional auto‑save (`hooks/use-timer.ts`)
  - Answer navigation, progress bar, calculator utility, responsive layout
  - Randomization of questions/options and back navigation controls
  - `components/cbt-system.tsx`, `components/question-renderer.tsx`, `components/calculator.tsx`
  - New: Visual timer warning levels (warn/danger) and screen-reader announcements via aria-live
  - New: Question flagging and navigation filters (All/Unanswered/Flagged)
  - New: Mobile sticky action bar (Prev/Next/Submit)

- Student Dashboard
  - Upload multiple exam files, preview schedules, and start only when allowed
  - `components/exam-dashboard.tsx`

- Result Checker & Reporting
  - Load original exam JSON and a student answer JSON to generate a full report
  - Score calculation, answer-by-answer correctness, time spent, violations, tab switches
  - Download structured JSON report and print-friendly HTML summary
  - `components/result-checker.tsx`, `components/comprehensive-report.tsx`

## Tech Stack

- Next.js 15 (App Router) — `app/` directory
- React 19
- Tailwind CSS (+ tailwindcss-animate) — `tailwind.config.ts`, `postcss.config.mjs`
- Radix UI + custom UI components in `components/ui/`
- TypeScript — `tsconfig.json`

Package excerpts are in `package.json`:

- Core: `next`, `react`, `react-dom`
- UI/UX: `@radix-ui/*`, `lucide-react`, `tailwindcss`, `tailwindcss-animate`, `clsx`, `class-variance-authority`
- Forms/validation: `react-hook-form`, `zod`, `@hookform/resolvers`
- Charts and widgets: `recharts`, `embla-carousel-react`

## Project Structure

- `app/layout.tsx` — global layout, metadata, and `app/globals.css`
- `app/page.tsx` — main entry with navigation across Admin, Exam, Results, Result Checker, and Dashboard views
- `components/` — feature modules and UI building blocks
  - `admin-panel.tsx`, `exam-scheduler.tsx`, `cbt-system.tsx`, `exam-dashboard.tsx`, `result-checker.tsx`, `comprehensive-report.tsx`
  - `question-renderer.tsx`, `calculator.tsx`, `student-name-input.tsx`, `exam-availability.tsx`
  - `ui/*` — primitive UI components (buttons, cards, inputs, dialogs, etc.)
- `hooks/` — core behaviors
  - `use-security.ts` (proctoring), `use-timer.ts` (timer & autosave), `use-exam-schedule.ts` (availability), `use-mobile.tsx`, `use-toast.ts`
- `types/` — shared TypeScript types (e.g., `types/cbt`)
- `public/`, `styles/`, config files: `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`

## Data Formats

Exam JSON (exported from Admin Panel) roughly follows:

```json
{
  "config": {
    "title": "Algebra 101 Midterm",
    "description": "...",
    "timeLimit": 60,
    "totalQuestions": 40,
    "passingScore": 70,
    "maxAttempts": 1,
    "allowCalculator": true,
    "allowBackNavigation": false,
    "randomizeQuestions": true,
    "randomizeOptions": true,
    "enableTabSwitchDetection": true,
    "enableFullScreenMode": false,
    "enableCopyPasteProtection": true,
    "enableRightClickProtection": true,
    "autoSubmitOnTimeExpiry": true,
    "showTimeWarnings": true,
    "timeWarningIntervals": [30, 10, 5],
    "enableAutoSave": true,
    "autoSaveInterval": 30,
    "schedule": {
      "id": "schedule-...",
      "startDate": "2025-09-21T09:00:00.000Z",
      "endDate": "2025-09-21T10:30:00.000Z",
      "timezone": "Europe/London",
      "allowEarlyStart": false,
      "allowLateSubmission": true,
      "lateSubmissionPenalty": 10,
      "maxLateMinutes": 30,
      "isActive": true
    }
  },
  "questions": [
    {
      "id": "q-1",
      "type": "multiple-choice",
      "question": "2 + 2 = ?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4",
      "points": 1,
      "difficulty": "easy",
      "category": "arithmetic",
      "allowCalculator": false
    }
  ]
}
```

Student Answer JSON (downloaded on submission from `CBTSystem`) includes attempt metadata and answers:

```json
{
  "studentInfo": { "id": "236damilare", "name": "Jane Doe" },
  "examTitle": "Algebra 101 Midterm",
  "examId": "Algebra 101 Midterm",
  "attempt": {
    "id": "attempt-...",
    "examId": "Algebra 101 Midterm",
    "studentId": "236damilare",
    "startTime": "2025-09-21T09:02:00.000Z",
    "endTime": "2025-09-21T10:00:00.000Z",
    "answers": { "q-1": "4" },
    "status": "completed",
    "tabSwitchCount": 1,
    "violations": ["Tab switched at 2025-09-21T09:30:00.000Z"],
    "score": 85,
    "isLateSubmission": false,
    "penaltyApplied": 0
  },
  "questions": [/* snapshot of delivered questions */],
  "submissionTime": "2025-09-21T10:00:05.000Z"
}
```

These files are consumed by `components/result-checker.tsx` to build a detailed `ExamReport` object rendered in `components/comprehensive-report.tsx`.

## Getting Started

Prerequisites

- Node.js 18+ (or 20+ recommended)
- pnpm, npm, or yarn

Install dependencies

```bash
# with npm
npm install

# or with pnpm
pnpm install
```

Run the app (development)

```bash
npm run dev
# Next.js dev server at http://localhost:3000
```

Build and start (production)

```bash
npm run build
npm start
```

Project scripts (from `package.json`)

- `dev` — start Next.js dev server
- `build` — build production output
- `start` — run production server
- `lint` — run Next.js lint (ESLint during build is disabled in `next.config.mjs`)

## Usage Guide

- Admin Panel
  1. Open the app and select “Admin Panel”
  2. Configure exam metadata and security options
  3. Add questions (choose type, set correct answer, points, difficulty)
  4. Optionally define a schedule window
  5. Export the exam as JSON

- Student Dashboard
  1. Upload one or more exam JSON files
  2. Review schedule availability; start is enabled only when allowed
  3. Begin the exam; the timer, security protections, and violations tracking will activate

- During Exam
  - Navigate questions, view progress, toggle calculator (if allowed)
  - Auto‑save and warning intervals can be enabled in exam config
  - Submit to finish; a student answer JSON is automatically downloaded
  - New: Flag a question for review; filter navigator by All/Unanswered/Flagged
  - New: Timer changes color near deadlines and announces warnings for accessibility
  - New: On mobile, use the bottom sticky bar for quick navigation and submit

- Result Checker
  1. Upload the original exam JSON and the student’s answer JSON
  2. Generate a comprehensive report, download JSON, or open a print view

## Configuration Notes

- `next.config.mjs` disables type and lint errors during builds and uses unoptimized images for portability.
- `tailwind.config.ts` defines CSS variables and palettes for light/dark themes and charts.
- New: Updated color palette tokens in `app/globals.css` (primary, secondary, accent, destructive, ring, chart.*)
- The app is client‑heavy by design; server routes/APIs are not required for the core flow (JSON in/out).

## Deployment

The project is deployable on Vercel and already configured to work without custom image optimization.

- Live deployment (example): https://vercel.com/damidreys-projects/v0-ast-secure-cbt-system
- Build command: `next build`
- Output: Next.js server

## Roadmap Ideas

- Authentication, roles, and multi‑tenant exam management
- Persistent storage for attempts and reports (e.g., database + APIs)
- Camera/mic proctoring and AI‑assisted violation detection
- Item banks, randomized forms, and statistical analysis

## License

Add your license here (e.g., MIT). If none is provided, usage defaults to “All rights reserved.”
