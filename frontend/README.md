# Routine Roulette Frontend

React + TypeScript PWA built with Vite for the Routine Roulette task management app.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 PWA Features

- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen on mobile/desktop
- **Local-First**: Data stored locally, syncs when online
- **Service Worker**: Automatic updates and caching

## 🎨 Design System

### Colors
- Primary: `#8B5CF6` (Purple)
- Secondary: `#EC4899` (Pink) 
- Accent: `#06B6D4` (Cyan)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

### Typography
- **Headings**: Poppins (600/700)
- **Body**: Montserrat (400/600/700)

### Components
- **KUI.tsx**: Cute UI components (cards, buttons, badges)
- **Brain.tsx**: Animated mascot with different moods
- **Roulette.tsx**: Interactive spinning wheel

## 🗂️ Project Structure

```
src/
├── components/
│   ├── KUI.tsx          # UI component library
│   ├── Brain.tsx        # Mascot component
│   └── Roulette.tsx     # Wheel component
├── pages/
│   ├── AddTasks.tsx     # Task input and management
│   ├── Spin.tsx         # Roulette wheel page
│   ├── Timer.tsx        # Work session timer
│   └── NotFound.tsx     # 404 page
├── lib/
│   ├── normalize.ts     # Task parsing logic
│   └── time.ts          # Timer utilities
├── hooks/
│   └── usePWAInstall.ts # PWA installation hook
├── store.ts             # Zustand state management
├── theme.css            # Design system styles
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## 🔧 State Management

Uses Zustand with localStorage persistence:

```typescript
// Access store
const { tasks, addTasks, toggleTaskSelection } = useStore()

// Add tasks
addTasks([
  { title: "Check emails", est_minutes: 10, energy: "low" }
])

// Toggle selection
toggleTaskSelection("task-id")
```

## 🎯 Key Features

### Task Normalization
- Parses natural language task lists
- Estimates time (5-60 minutes)
- Classifies energy levels (low/medium/high)
- Quality assessment for safety

### Roulette Wheel
- Visual spinning animation
- Weighted selection algorithm
- Confetti celebration on selection

### Timer System
- Countdown with progress bar
- Pause/resume functionality
- Completion tracking with confetti

### Brain Mascot
- 4 moods: happy, focused, dancing, frustrated
- Contextual animations and messages
- Provides encouraging feedback

## 🌐 Environment Variables

Create `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

For mobile testing:
```bash
VITE_API_BASE_URL=http://192.168.1.100:8000
```

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview locally
npm run preview

# Deploy to Netlify/Vercel
# Upload dist/ folder or connect git repo
```

## 🔍 Troubleshooting

### PWA Not Installing
- Ensure HTTPS in production
- Check service worker registration
- Verify manifest.json is accessible

### API Connection Issues
- Check VITE_API_BASE_URL environment variable
- Verify backend is running and accessible
- Check browser network tab for CORS errors

### TypeScript Errors
- Run `npm run build` to check for compilation errors
- Ensure all dependencies are installed
- Check tsconfig.json configuration
