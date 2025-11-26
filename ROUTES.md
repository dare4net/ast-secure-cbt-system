# Route Structure

## Student Routes (`/students`)
- `/students/dashboard` - Student dashboard with stats and overview
- `/students/exams` - Browse and select available exams
- `/students/exam` - Take an exam (selected from exams page)
- `/students/results` - View exam results and scores

## Examiner Routes (`/examiner`)
- `/examiner/dashboard` - Examiner dashboard with exam management
- `/examiner/create-exam` - Create and edit exams (Admin Panel)
- `/examiner/results` - View student submissions and results

## Organization Routes (`/organization`)
- `/organization/dashboard` - Organization overview with analytics
- `/organization/manage` - Manage examiners and students
- `/organization/reports` - View system-wide reports

## Legacy Routes (Keep for compatibility)
- `/` - Landing/Login page
- `/dashboard` - Redirects based on role or shows exam dashboard
- `/admin` - Admin panel (can be aliased)
- `/result-checker` - Result checker component
- `/exam/[id]` - Exam editor for specific exam

## Navigation Updates
- Header navigation now dynamically shows role-appropriate links
- Dropdown menu updated with new route structure
- Mobile menu updated with new routes
