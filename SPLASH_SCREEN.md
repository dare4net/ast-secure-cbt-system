# Splash Screen Implementation

## Overview
A professional 5-second splash screen has been added to your AST Secure CBT system, featuring smooth animations and matching your new pastel aesthetic.

## Features

### Visual Elements
- **Animated Icon**: Pulsating shield icon that changes through 4 stages
- **Gradient Background**: Soft pastel gradient with floating particles
- **Progress Bar**: Smooth gradient progress bar (lavender to mint)
- **Stage Indicators**: Dot navigation showing loading progress
- **Stage Text**: Dynamic loading messages

### Loading Stages (5 seconds total)
1. 🛡️ **Initializing security protocols** (0-1.25s)
2. 🔒 **Verifying exam integrity** (1.25-2.5s)
3. 🖥️ **Preparing exam environment** (2.5-3.75s)
4. ✅ **Ready to begin** (3.75-5s)

### Animations
- **Floating particles**: 15 animated background orbs
- **Pulsating icon**: Smooth scale animation
- **Progress bar**: Gradient animation with smooth transitions
- **Fade out**: 500ms smooth exit transition

## Technical Details

### Components Created
1. **`splash-screen.tsx`**: Main splash screen component
   - Customizable duration (default 5000ms)
   - Smooth animations
   - Progress tracking
   - Stage transitions

2. **`app-with-splash.tsx`**: Wrapper component
   - Session-based display (only shows once per session)
   - Optional disable flag
   - Clean integration

### CSS Animations
Added to `globals.css`:
```css
@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
  50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
}
```

### Integration
The splash screen is integrated into the root layout (`app/layout.tsx`) and will automatically display:
- ✅ On first page load
- ✅ Once per browser session
- ✅ With smooth fade transitions

## How It Works

1. **User visits site** → Splash screen appears
2. **5 seconds pass** → Progress bar fills, stages update
3. **Completion** → Smooth fade out
4. **Session marked** → Won't show again until browser session ends
5. **Main app loads** → User sees homepage

## Customization

### Change Duration
Edit `app/layout.tsx`:
```tsx
<AppWithSplash duration={3000}> // 3 seconds instead of 5
```

### Disable Splash Screen
```tsx
<AppWithSplash disableSplash={true}>
```

### Customize Stages
Edit `components/splash-screen.tsx` → `stages` array:
```tsx
const stages = [
  { icon: YourIcon, text: "Your custom message" },
  // Add more stages...
]
```

### Change Colors
The splash screen automatically uses your theme colors:
- `primary` - Main accent color (lavender)
- `secondary` - Secondary accent (mint)
- `background` - Base background
- `muted` - Subtle elements

## Session Behavior

The splash screen uses `sessionStorage` to track if it's been shown:
- ✅ Shows on first visit
- ❌ Hidden on subsequent navigations
- ✅ Shows again after closing browser
- ❌ Doesn't show when navigating between pages

To force it to show again during development:
1. Open DevTools (F12)
2. Console → Type: `sessionStorage.removeItem('splash-shown')`
3. Refresh page

## Visual Design

### Background
- Soft gradient from background → primary/5% → secondary/5%
- 15 floating particles with staggered animations
- Smooth, non-distracting motion

### Center Content
- Large pulsating icon (96x96px)
- Title: "AST Secure CBT"
- Subtitle: "Computer Based Testing System"
- Current stage text (animated)
- Progress bar with gradient
- Percentage display
- Stage dots indicator

### Colors Match Pastel Theme
- Progress bar: Lavender → Mint gradient
- Icon: Pastel lavender
- Background: Soft periwinkle with pastel overlays
- Text: Following theme foreground colors

## Testing

Run your dev server:
```bash
npm run dev
```

Visit `http://localhost:3000` - you should see:
1. Splash screen for 5 seconds
2. Smooth transition to homepage
3. On refresh, it goes straight to homepage (session stored)

To test again:
- Clear session storage (DevTools)
- Open in incognito window
- Close and reopen browser

## Files Modified/Created

✅ **Created:**
- `components/splash-screen.tsx` - Main splash component
- `components/app-with-splash.tsx` - Integration wrapper
- `SPLASH_SCREEN.md` - This documentation

✅ **Modified:**
- `app/layout.tsx` - Added splash screen wrapper
- `app/globals.css` - Added float animation

## Preview

The splash screen features:
- 🎨 Matches your pastel color scheme
- ⚡ Smooth 60fps animations
- 📱 Fully responsive
- ♿ Accessible with proper semantic HTML
- 🔄 Progressive loading stages
- ✨ Professional appearance

Perfect for giving users a polished first impression while your app loads!
