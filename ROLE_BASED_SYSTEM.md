# Role-Based Account System

## Overview
The AST Secure CBT system now features **3 distinct account types** with dedicated dashboards and permissions. Each role has specific capabilities tailored to their responsibilities.

## 🎭 Account Types

### 1. 👨‍🎓 Student
**Purpose:** Take exams and view results

**Permissions:**
- `take_exam` - Access and complete exams
- `view_results` - View exam scores and reports

**Mock Account:**
- **Name:** John Doe
- **Email:** student@astcbt.com
- **ID:** student-001

**Dashboard Features:**
- Upcoming exams calendar
- Recent exam results
- Average score tracking
- Pending submissions
- Quick access to take exams
- Download certificates

---

### 2. 👨‍🏫 Examiner
**Purpose:** Create exams and manage student submissions

**Permissions:**
- `create_exam` - Create new exams
- `edit_exam` - Modify exam content
- `view_submissions` - View student responses
- `grade_exam` - Grade and provide feedback
- `invite_students` - Send exam invitations
- `import_students` - Bulk import student emails via CSV

**Mock Account:**
- **Name:** Dr. Sarah Smith
- **Email:** examiner@astcbt.com
- **ID:** examiner-001

**Dashboard Features:**
- My Exams management
- Pending grading queue
- Student invitation system (email/CSV)
- Exam statistics
- Quick exam creation
- Export results

**Special Capabilities:**
- **Invite Students:** Input emails directly or upload CSV file
- **Bulk Import:** CSV format: `email,name,student_id`
- **Grade Management:** Review and grade student submissions
- **Analytics:** View per-exam performance metrics

---

### 3. 🏢 Organization
**Purpose:** Manage examiners, students, and platform configuration

**Permissions:**
- `manage_examiners` - Add/remove/configure examiners
- `manage_students` - Oversee all students
- `view_analytics` - System-wide reports
- `configure_settings` - Platform settings
- `billing` - Billing and subscription management

**Mock Account:**
- **Name:** AST Education Institute
- **Email:** admin@astcbt.com
- **ID:** org-001

**Dashboard Features:**
- Examiner management
- Student overview (across all examiners)
- Platform analytics
- Recent activity log
- System configuration
- Revenue tracking
- Uptime monitoring

**Special Capabilities:**
- **Examiner Management:** Add, disable, configure permissions
- **System Settings:** Configure platform-wide settings
- **Analytics:** View system-wide performance
- **Billing:** Manage subscriptions and payments

## 🚀 Quick Login (Demo Accounts)

On the splash screen, you'll see **3 colored quick-login buttons**:

1. **🔵 Blue - Student** 
   - Click to instantly login as John Doe
   - Redirects to Student Dashboard

2. **🟣 Purple - Examiner**
   - Click to instantly login as Dr. Sarah Smith
   - Redirects to Examiner Dashboard

3. **🟢 Green - Organization**
   - Click to instantly login as AST Education Institute
   - Redirects to Organization Dashboard

## 📊 Dashboard Navigation

### Student Dashboard (`/student-dashboard`)
```
📈 Stats:
- Upcoming Exams: 2
- Completed: 12
- Average Score: 87.5%
- Pending: 2

📚 Sections:
- Upcoming Exams
- Recent Results
- Quick Actions
```

### Examiner Dashboard (`/examiner-dashboard`)
```
📈 Stats:
- Total Exams: 3
- Total Students: 125
- Pending Grading: 2
- Completion Rate: 89%

📚 Sections:
- My Exams (with status badges)
- Pending Grading
- Invite Students Dialog
- Quick Actions
```

### Organization Dashboard (`/organization-dashboard`)
```
📈 Stats:
- Total Examiners: 3
- Total Students: 405
- Total Exams: 25
- Revenue: $12,450

📚 Sections:
- Examiners Management
- Recent Activity
- Platform Analytics
- Quick Actions
```

## 🔄 Role-Based Routing

The system automatically routes users based on their role:

```javascript
Student → /student-dashboard
Examiner → /examiner-dashboard
Organization → /organization-dashboard
```

### Navigation Menu (Dynamic)
The header navigation changes based on role:

**Student:**
- Dashboard
- Take Exam
- Results

**Examiner:**
- Dashboard
- Create Exam
- Submissions

**Organization:**
- Dashboard
- Manage
- Analytics

## 📧 Student Invitation System (Examiner Feature)

### Manual Email Entry
```
1. Click "Invite Students" button
2. Select exam from dropdown
3. Enter emails (one per line):
   student1@example.com
   student2@example.com
   student3@example.com
4. Click "Send Invitations"
```

### CSV Bulk Import
```csv
email,name,student_id
john@example.com,John Doe,STU001
jane@example.com,Jane Smith,STU002
bob@example.com,Bob Johnson,STU003
```

**Import Process:**
1. Click "Upload CSV File"
2. Select CSV with headers
3. System validates and imports
4. Sends automatic exam invitations

## 🔐 Permissions System

Each account has specific permissions that control access:

```typescript
Student Permissions:
- take_exam
- view_results

Examiner Permissions:
- create_exam
- edit_exam
- view_submissions
- grade_exam
- invite_students
- import_students

Organization Permissions:
- manage_examiners
- manage_students
- view_analytics
- configure_settings
- billing
```

## 📱 User Flow

### Student Flow
```
1. Login as Student
2. See Student Dashboard
3. View upcoming exams
4. Click "Take Exam"
5. Complete exam
6. View results
```

### Examiner Flow
```
1. Login as Examiner
2. See Examiner Dashboard
3. Click "Create Exam"
4. Configure exam settings
5. Click "Invite Students"
6. Import student emails (CSV or manual)
7. Students receive invitations
8. Grade submissions
9. Export results
```

### Organization Flow
```
1. Login as Organization
2. See Organization Dashboard
3. Click "Add Examiner"
4. Configure examiner permissions
5. View system analytics
6. Manage platform settings
7. Monitor all exams/students
```

## 🎨 UI Differentiation

Each dashboard uses distinct color accents:

**Student:** Blue theme (primary)
**Examiner:** Purple accents
**Organization:** Green accents

## 🔧 Testing the System

### Test All Roles:
1. **Clear session:**
   ```javascript
   localStorage.removeItem('ast-cbt-user')
   ```

2. **Refresh page** - Splash screen appears

3. **Click role button:**
   - Student (Blue)
   - Examiner (Purple)
   - Organization (Green)

4. **Explore dashboard** for that role

5. **Logout** and test another role

### Test CSV Import (Examiner):
1. Login as Examiner
2. Click "Invite Students"
3. Create CSV file:
   ```csv
   email,name,student_id
   test1@example.com,Test Student 1,001
   test2@example.com,Test Student 2,002
   ```
4. Upload and verify

## 🗄️ Data Structure

### User Object
```typescript
{
  id: string
  name: string
  email: string
  avatar?: string
  role: "student" | "examiner" | "organization"
  organizationId?: string  // Links examiner/student to org
  permissions?: string[]   // Role-based permissions
}
```

### Exam with Invitations
```typescript
{
  id: string
  title: string
  examiner_id: string
  invited_students: [
    { email: string, name: string, student_id: string }
  ]
  status: "draft" | "active" | "completed"
}
```

## 🚀 Production Considerations

### For Real Implementation:

1. **Backend API:**
   - Create role-based endpoints
   - Implement permission middleware
   - Add JWT with role claims

2. **CSV Processing:**
   - Server-side CSV parsing
   - Email validation
   - Duplicate detection
   - Batch invitation sending

3. **Email System:**
   - SMTP configuration
   - Invitation templates
   - Automated reminders
   - Result notifications

4. **Access Control:**
   - Route guards per role
   - Permission checks on actions
   - Audit logging
   - Rate limiting

5. **Database Schema:**
   - Users table with roles
   - Permissions junction table
   - Organizations table
   - Exam_Invitations table

## 📝 Summary

✅ **3 Distinct Roles** - Student, Examiner, Organization
✅ **Custom Dashboards** - Tailored to each role
✅ **Permission System** - Fine-grained access control
✅ **Quick Login** - One-click demo accounts
✅ **Smart Routing** - Automatic dashboard selection
✅ **CSV Import** - Bulk student invitation
✅ **Role-Based Nav** - Dynamic menu items
✅ **Beautiful UI** - Color-coded by role

The system is now ready for role-based testing and development! 🎉
