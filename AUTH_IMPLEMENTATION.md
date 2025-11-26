# Smart Authentication Splash Screen

## Overview
The splash screen now features intelligent authentication! It detects whether a user is logged in and shows appropriate options.

## Features

### 🎯 Smart Behavior
- **No Session**: Shows authentication options (Login/Sign Up)
- **Active Session**: Shows "Continue to Dashboard" button
- **Persistent**: User session saved in localStorage
- **Seamless**: Auth happens during splash screen loading

### 🔐 Authentication Methods

#### 1. **Social Login**
- **Google Sign In** - OAuth integration ready
- **GitHub Sign In** - OAuth integration ready
- One-click authentication
- Auto-populated user profiles

#### 2. **Email/Password**
- Traditional email + password login
- Sign up with name, email, password
- Toggle between login/signup modes
- Form validation

### 📱 User Interface

#### Loading Phase (0-5 seconds)
- Progress bar with stages
- Security initialization messages
- Background particle animation

#### Authentication Phase (After Loading)
**For Non-Authenticated Users:**
- Welcome message
- 3 authentication buttons:
  1. 🌐 Continue with Google
  2. 🐙 Continue with GitHub  
  3. ✉️ Continue with Email

**For Authenticated Users:**
- "Continue to Dashboard" button
- Direct access to the app

#### Email Auth Form
- Switch between Login/Sign Up
- Fields: Name (signup only), Email, Password
- Back button to return to social options
- Submit button with loading state

## Implementation Details

### Files Created/Modified

1. **`contexts/auth-context.tsx`** - NEW
   - Authentication state management
   - User session handling
   - Login/logout functions
   - Social auth handlers

2. **`components/splash-screen.tsx`** - UPDATED
   - Smart authentication detection
   - Social login buttons
   - Email auth form
   - Conditional rendering based on auth state

3. **`components/site-header.tsx`** - UPDATED
   - User profile dropdown
   - Logout functionality
   - Shows user info when logged in
   - Sign in button when logged out

4. **`app/layout.tsx`** - UPDATED
   - Wrapped app with `AuthProvider`
   - Makes auth available everywhere

### Authentication Flow

```
1. User loads app
   ↓
2. Splash screen shows (5s loading)
   ↓
3. Check localStorage for session
   ↓
4. If authenticated → "Continue to Dashboard"
   If not authenticated → Show auth options
   ↓
5. User selects auth method
   ↓
6. Login/signup completes
   ↓
7. Session saved to localStorage
   ↓
8. Redirect to dashboard
```

### Mock Authentication

Currently uses **mock authentication** (simulated API calls):
- Google/GitHub: Creates user with provider info
- Email: Creates user with form data
- All accounts are created instantly (1-1.5s delay for UX)

### User Object Structure

```typescript
interface User {
  id: string           // Unique identifier
  name: string         // Display name
  email: string        // Email address
  avatar?: string      // Profile picture (optional)
  role: "student" | "admin"  // User role
}
```

## Usage

### Check Authentication Status
```tsx
import { useAuth } from "@/contexts/auth-context"

function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <p>Welcome, {user.name}!</p>
  }
  return <p>Please log in</p>
}
```

### Login Programmatically
```tsx
const { login, loginWithGoogle, loginWithGithub } = useAuth()

// Email login
await login("user@example.com", "password")

// Social login
await loginWithGoogle()
await loginWithGithub()
```

### Logout
```tsx
const { logout } = useAuth()

logout() // Clears session and user data
```

## Session Management

### Storage
- **Location**: `localStorage`
- **Key**: `ast-cbt-user`
- **Data**: JSON stringified User object

### Persistence
- Session persists across page refreshes
- Survives browser restart
- Cleared only on explicit logout or localStorage clear

### Testing Different States

**To test authenticated state:**
1. Go through login flow
2. Refresh page - you'll see "Continue to Dashboard"

**To test non-authenticated state:**
1. Open DevTools (F12)
2. Console → Type: `localStorage.removeItem('ast-cbt-user')`
3. Refresh page - you'll see auth options

**To test again with always-show:**
```tsx
// In layout.tsx
<AppWithSplash alwaysShow={true}>
```

## UI Components

### Social Login Buttons
- **Google**: White background, colored Google logo
- **GitHub**: Dark background, white text
- **Email**: Light background, mail icon

All have:
- Rounded full (pill-shaped)
- Hover effects (scale + shadow)
- Disabled state during loading
- Smooth transitions

### Email Form
- Clean, minimal design
- Rounded inputs (rounded-xl)
- Toggle link for login/signup
- Two-button layout (Back + Submit)
- Loading states

### User Dropdown (Header)
- User icon button
- Dropdown with:
  - User name & email
  - Dashboard link
  - Results link
  - Logout option (red text)

## Customization

### Change Authentication Duration
```tsx
// In app-with-splash.tsx
<AppWithSplash alwaysShow={true} duration={3000} />
```

### Add More Social Providers
Edit `auth-context.tsx`:
```typescript
const loginWithTwitter = async () => {
  // Add Twitter OAuth logic
}
```

Then add button in `splash-screen.tsx`

### Connect Real API
Replace mock functions in `auth-context.tsx`:
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  const user = await response.json()
  setUser(user)
  localStorage.setItem('ast-cbt-user', JSON.stringify(user))
}
```

## Security Notes

⚠️ **Current Implementation**:
- Mock authentication (for demo purposes)
- Client-side only
- No password hashing
- No token validation

🔒 **For Production**:
- Implement proper backend API
- Use JWT tokens or session cookies
- Hash passwords (bcrypt)
- Add CSRF protection
- Implement rate limiting
- Add OAuth provider credentials
- Use httpOnly cookies for tokens

## Color Scheme

Matches your pastel design:
- Primary buttons: Lavender (`hsl(240, 45%, 75%)`)
- Secondary elements: Soft mint
- Backgrounds: Light periwinkle
- Borders: Minimal, subtle
- Shadows: Soft, layered

## Accessibility

- ✅ Keyboard navigation
- ✅ Focus states
- ✅ ARIA labels
- ✅ Semantic HTML
- ✅ Color contrast compliant
- ✅ Screen reader friendly

## Next Steps

1. **Backend Integration**: Connect to real authentication API
2. **OAuth Setup**: Configure Google/GitHub OAuth apps
3. **Password Reset**: Add forgot password flow
4. **Email Verification**: Add email confirmation
5. **Two-Factor Auth**: Implement 2FA for security
6. **Role-Based Access**: Use user roles for permissions

## Demo Credentials

Since it's mock auth, **any credentials work**:
- Email: anything@example.com
- Password: anything

The system will create a user on the fly!
