# Quick Start Guide - AST Secure CBT System

## What You Have Now

✅ **Clean Minimal UI** with soft pastel colors (lavender, mint, periwinkle)  
✅ **Professional Splash Screen** with 5-second loading animation  
✅ **Smart Authentication** - detects if user is logged in  
✅ **Mock Login System** - accepts ANY credentials  
✅ **Social Login** - Google & GitHub buttons (mock)  
✅ **User Profile** - Dropdown in header with logout  

## First Run

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   ```
   http://localhost:3000
   ```

3. **What you'll see:**
   - Splash screen loads for 5 seconds
   - After loading: Login/Sign up options appear
   - Three buttons: Google, GitHub, Email

## Login (Mock Authentication)

### Using Social Login
- Click **"Continue with Google"** or **"Continue with GitHub"**
- Wait 1 second (simulated)
- Auto-generates a mock user profile
- Redirects to dashboard

### Using Email
1. Click **"Continue with Email"**
2. Toggle between Login/Sign Up
3. Enter ANY credentials (all accepted):
   - Email: `test@example.com`
   - Password: `anything`
4. Click **"Log In"** or **"Sign Up"**
5. Mock user created instantly

## Mock User Data

**All logins create profiles like:**
```json
{
  "id": "abc123",
  "name": "Student ABCD", // or from email
  "email": "student@gmail.com",
  "avatar": "/placeholder-user.jpg",
  "role": "student"
}
```

## After Login

### Header Changes
- User icon appears (top right)
- Click it to see dropdown:
  - Your name & email
  - Dashboard link
  - Results link  
  - **Log Out** button (red)

### Session Persistence
- Login saved to `localStorage`
- Refresh page → Still logged in
- Close browser → Still logged in
- Click logout → Session cleared

## Testing Different States

### Test Authenticated State
1. Login with any method
2. Refresh page
3. Splash screen → "Continue to Dashboard" button

### Test Non-Authenticated State
```javascript
// In browser console (F12)
localStorage.removeItem('ast-cbt-user')
// Then refresh
```

### Force Splash to Always Show
In `app/layout.tsx`:
```tsx
<AppWithSplash alwaysShow={true}>
```

### Disable Splash Completely  
In `app/layout.tsx`:
```tsx
<AppWithSplash disableSplash={true}>
```

## Current Features

### 🎨 UI/UX
- Pastel color scheme (lavender primary, mint secondary)
- Rounded buttons (pill-shaped)
- Glass morphism effects
- Soft shadows & transitions
- Slow, elegant background animations

### 🔐 Authentication
- Email/Password login
- Google OAuth (mock)
- GitHub OAuth (mock)
- Persistent sessions
- User profiles with avatars
- Role-based (student/admin)

### 📱 Responsive
- Mobile-friendly
- Tablet optimized
- Desktop enhanced
- Touch-friendly buttons

## Troubleshooting

### "useAuth is not defined" Error
- **Fixed!** Added try/catch wrapper
- Auth context loaded after initial render
- Should work now on refresh

### Splash Screen Not Showing
- Check `alwaysShow={true}` in layout
- Clear `sessionStorage`: 
  ```js
  sessionStorage.removeItem('splash-shown')
  ```

### Can't Login
- **ALL credentials work!** 
- It's mock authentication
- Just enter anything and submit
- Check console for errors if it fails

## File Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Homepage
└── globals.css         # Pastel theme colors

components/
├── splash-screen.tsx   # Smart splash with auth
├── app-with-splash.tsx # Splash wrapper
├── site-header.tsx     # Header with user dropdown
└── site-footer.tsx     # Footer

contexts/
└── auth-context.tsx    # Authentication state

```

## Next Steps

### To Add Real Authentication:
1. Create backend API (`/api/auth/login`, etc.)
2. Replace mock functions in `auth-context.tsx`
3. Add JWT token handling
4. Configure OAuth apps (Google, GitHub)
5. Add password hashing
6. Implement email verification

### To Customize Colors:
Edit `app/globals.css` → `:root` variables:
```css
--primary: 240 45% 75%;    /* lavender */
--secondary: 160 35% 85%;  /* mint */
--background: 220 25% 98%; /* periwinkle */
```

### To Change Splash Duration:
In `components/splash-screen.tsx`:
```tsx
export function SplashScreen({ 
  onComplete, 
  duration = 3000  // Change to 3 seconds
}: SplashScreenProps)
```

## Important Notes

⚠️ **Current Limitations:**
- Mock authentication only (no real security)
- No backend API (client-side only)
- No password validation
- No rate limiting
- localStorage only (not secure for production)

✅ **Production Ready:**
- UI/UX design
- Component structure
- Color system
- Responsive layout
- User experience flow

## Demo Credentials

Since authentication is mocked, **anything works:**

```
Email: literally-anything@example.com
Password: 123 or qwerty or blank - doesn't matter!
```

The system creates a user on the fly with your email!

## Support

Check these files for detailed docs:
- `DESIGN_UPDATES.md` - UI color system
- `AUTH_IMPLEMENTATION.md` - Authentication details
- `SPLASH_SCREEN.md` - Splash screen features

Enjoy your new CBT system! 🚀
