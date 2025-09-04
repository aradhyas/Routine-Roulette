# 🎯 Routine Roulette

**Transform your productivity with the power of randomness!**

Routine Roulette is a mobile-first PWA built for ADHD brains. It turns choice paralysis into play: dump your messy list, spin a friendly wheel, and jump into a short focus sprint. Low friction, tiny wins, dopamine hits—so you start faster, stick longer, and feel better about progress.

## 🌟 What Makes Routine Roulette Special?

**🎲 Gamified Task Selection**: Say goodbye to decision paralysis! The interactive roulette wheel randomly selects your next task, making productivity feel like a game rather than a chore.

**🧠 AI-Powered Intelligence**: Built-in smart task parsing automatically estimates time requirements and energy levels for each task, helping you plan your day more effectively.

**📱 True Mobile-First Design**: Optimized for smartphones and tablets with a beautiful, intuitive interface that works seamlessly across all devices.

**⚡ Offline-First Architecture**: Works completely offline with local storage, syncing seamlessly when you're back online. No internet? No problem!

**🎨 Delightful User Experience**: Features a cute animated brain mascot, smooth animations, confetti celebrations, and a carefully crafted design system that makes task management enjoyable.

**⏱️ Built-in Focus Timer**: Integrated Pomodoro-style timer helps you stay focused and track your productivity sessions.

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.8+** for the backend
- **Node.js 16+** for the frontend
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/routine-roulette.git
cd routine-roulette
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at:
- **Local**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create environment file
cp .env.example .env
# Edit .env to add VITE_API_BASE_URL=http://localhost:8000

npm run dev
```

The frontend will be available at:
- **Local**: http://localhost:5173
- **Network**: http://192.168.1.x:5173 (for mobile testing)

### 4. Production Build
```bash
cd frontend
npm run build
npm run preview
```

## 🌐 Environment Configuration

### Frontend Environment Variables
Create a `.env` file in the `frontend/` directory:

```bash
# Required - Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# Optional - AI Features (for enhanced task parsing)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

### Network Access Configuration
For testing on mobile devices or other network devices:
```bash
# Use your machine's IP address
VITE_API_BASE_URL=http://192.168.1.100:8000
```

Find your IP address:
- **macOS/Linux**: `ifconfig | grep inet`
- **Windows**: `ipconfig`

## 📱 PWA Installation Guide

Routine Roulette is a Progressive Web App that can be installed on any device for a native app-like experience!

### 📱 Android Installation
1. Open the app in **Chrome** browser
2. Tap the **menu** (three dots in top-right)
3. Select **"Add to Home Screen"** or **"Install App"**
4. Confirm installation when prompted
5. Find the app icon on your home screen!

### 🍎 iOS Installation  
1. Open the app in **Safari** browser
2. Tap the **Share button** (square with arrow)
3. Scroll down and select **"Add to Home Screen"**
4. Customize the name if desired and tap **"Add"**
5. The app will appear on your home screen!

### 💻 Desktop Installation
1. Look for the **install button** (⊕) in the address bar
2. Or use browser menu → **"Install Routine Roulette"**
3. The app will open in its own window
4. Pin to taskbar/dock for easy access

## ✨ Core Features

### 🎯 Smart Task Management
- **Natural Language Input**: Just type your tasks naturally - "Call mom", "Finish project report", "Go for a 30-minute walk"
- **AI-Powered Analysis**: Automatically estimates time requirements (10-60 minutes) and energy levels (Low/Medium/High)
- **Task Quality Assessment**: Ensures tasks are actionable and appropriate
- **Bulk Task Import**: Paste multiple tasks at once and let AI parse them intelligently

### 🎲 Gamified Selection System
- **Interactive Roulette Wheel**: Beautiful, smooth-spinning wheel with customizable colors
- **Fair Randomization**: Advanced algorithms ensure truly random selection
- **Visual Feedback**: Satisfying animations and confetti celebrations
- **Task Filtering**: Choose which tasks to include in the wheel based on energy level or time available

### ⏱️ Focus & Productivity Tools
- **Built-in Timer**: Pomodoro-style countdown timer with audio notifications
- **Session Tracking**: Monitor your work sessions and completion rates
- **Progress Analytics**: View statistics on tasks completed, time spent, and productivity patterns
- **Motivational Feedback**: Cute brain mascot provides encouragement and celebrates your wins

### 📱 Mobile-First Experience
- **Responsive Design**: Optimized for phones, tablets, and desktop
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Offline Capability**: Full functionality without internet connection
- **Cross-Device Sync**: Your tasks sync across all your devices (when online)


## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Local Storage**: Tasks persist offline using Zustand
- **PWA**: Service worker with Workbox for offline functionality
- **Responsive**: Mobile-first design with cute UI components
- **Fonts**: Poppins for headings, Montserrat for body text

### Backend (FastAPI + SQLite)
- **Device-based Sync**: No user accounts, uses device IDs
- **Task Normalization**: Smart parsing of task lists
- **Session Tracking**: Monitor work sessions and statistics
- **Metrics**: API performance monitoring

## 🎯 How It Works - User Journey

### 1. 📝 Add Your Tasks
- Type tasks naturally: *"Write weekly report"*, *"Call dentist"*, *"Organize desk"*
- Paste multiple tasks at once from your notes or other apps
- Tasks are automatically saved locally on your device

### 2. 🧠 Smart Analysis
- AI analyzes each task and estimates:
  - **Time Required**: 10-60 minutes based on task complexity
  - **Energy Level**: Low, Medium, or High based on task type
  - **Quality Check**: Ensures tasks are actionable and appropriate

### 3. 🎛️ Customize Your Wheel
- Select which tasks to include in today's roulette
- Filter by energy level (when you're tired, show only low-energy tasks)
- Filter by available time (only show tasks you can complete now)

### 4. 🎲 Spin the Wheel!
- Tap the colorful roulette wheel to spin
- Watch the satisfying animation as it selects your next task
- Celebrate with confetti when a task is chosen!

### 5. ⏱️ Focus & Work
- Start the built-in timer for your selected task
- Get audio notifications when time is up
- Mark tasks as complete and earn celebration animations

### 6. 📊 Track Progress
- View your productivity statistics
- See completion rates and time spent on different task types
- Get motivational feedback from your brain mascot friend

## 🛠️ Technical Architecture & Development

### 🏗️ Project Structure
```
routine-roulette/
├── backend/                 # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py         # FastAPI application & CORS setup
│   │   ├── models.py       # SQLModel database models
│   │   ├── schemas.py      # Pydantic request/response schemas
│   │   ├── routes.py       # API endpoint definitions
│   │   └── utils/
│   │       └── metrics.py  # API performance tracking
│   ├── requirements.txt    # Python dependencies
│   └── routine_roulette.db # SQLite database (auto-created)
├── frontend/               # React TypeScript Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Brain.tsx   # Animated mascot component
│   │   │   ├── Roulette.tsx # Interactive spinning wheel
│   │   │   ├── KnittingCat.tsx # Additional mascot
│   │   │   └── SmartSuggestions.tsx # AI task suggestions
│   │   ├── lib/           # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store.ts       # Zustand state management
│   │   ├── App.tsx        # Main application component
│   │   └── theme.css      # Design system & styling
│   ├── public/
│   │   ├── icons/         # PWA app icons (various sizes)
│   │   ├── brains/        # Mascot SVG assets
│   │   └── manifest.json  # PWA manifest
│   ├── package.json       # Node.js dependencies
│   ├── vite.config.ts     # Vite build configuration
│   └── .env              # Environment variables
└── README.md             # This comprehensive guide!
```

### 🔧 Technology Stack

**Frontend Technologies:**
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and dev server
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Vite PWA Plugin** - Service worker generation
- **Canvas Confetti** - Celebration animations
- **Workbox** - Offline functionality

**Backend Technologies:**
- **FastAPI** - High-performance Python web framework
- **SQLModel** - Modern ORM with type hints
- **SQLite** - Lightweight embedded database
- **Uvicorn** - ASGI server for production
- **Pydantic** - Data validation and serialization
- **Python-Jose** - JWT token handling (optional)

**Development Tools:**
- **ESLint** - Code linting and formatting
- **TypeScript Compiler** - Type checking
- **Vite Dev Server** - Hot module replacement
- **FastAPI Docs** - Auto-generated API documentation

### 📡 API Endpoints Reference

**User Management:**
- `POST /api/register` - Register device and create user profile
- `GET /api/health` - Health check endpoint

**Task Management:**
- `POST /api/normalize` - Parse raw text into structured tasks with AI
- `GET /api/tasks?device_id=...` - Retrieve all tasks for a device
- `POST /api/tasks/bulk_upsert` - Bulk create/update tasks for sync

**Session & Analytics:**
- `POST /api/session/start` - Start a focused work session
- `POST /api/session/finish` - Complete work session with results
- `GET /api/stats?device_id=...` - Get productivity statistics
- `GET /api/metrics` - API performance metrics

**Interactive API Documentation:**
Visit `http://localhost:8000/docs` when running the backend to explore all endpoints with an interactive Swagger UI!

## 🚀 Deployment & Production

### 🌐 Frontend Deployment (Netlify/Vercel)
```bash
# Build for production
cd frontend
npm run build

# The dist/ folder contains your production-ready files
# Deploy the dist/ folder to your hosting platform
```

### 🖥️ Backend Deployment
```bash
# Install production server
pip install gunicorn

# Run with Gunicorn (production)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Or use Docker (create Dockerfile)
FROM python:3.9
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔧 Troubleshooting Guide

### 🐛 Common Backend Issues
- **Port 8000 in use**: Try `lsof -ti:8000 | xargs kill -9` or use a different port
- **Python version**: Ensure Python 3.8+ with `python --version`
- **Dependencies**: Run `pip install -r requirements.txt` in a virtual environment
- **Database**: SQLite file is auto-created, check file permissions

### 🌐 Frontend Issues
- **Node.js version**: Ensure Node.js 16+ with `node --version`
- **Environment variables**: Check `.env` file exists with correct `VITE_API_BASE_URL`
- **Cache issues**: Clear browser cache or try incognito mode
- **Network errors**: Verify backend is running on the specified port

### 📱 PWA Installation Issues
- **HTTPS required**: PWA features need HTTPS in production (localhost works for development)
- **Install prompt**: Some browsers require user interaction before showing install option
- **Service worker**: Updates may take time to propagate, try hard refresh (Ctrl+Shift+R)

### 🔍 Debugging Tips
- **Backend logs**: Check terminal output for FastAPI error messages
- **Frontend console**: Open browser DevTools (F12) to see JavaScript errors
- **Network tab**: Monitor API calls and responses in browser DevTools
- **API documentation**: Visit `http://localhost:8000/docs` to test endpoints directly

## 🧪 Testing & Quality Assurance

### 🧪 Manual Testing Checklist
- [ ] Add tasks via text input
- [ ] Spin the roulette wheel
- [ ] Start and complete timer sessions
- [ ] Install as PWA on mobile device
- [ ] Test offline functionality
- [ ] Verify task persistence across browser sessions

### 🔄 API Testing
```bash
# Test backend health
curl http://localhost:8000/health

# Register a test device
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"device_id": "test-device-123"}'

# Test task normalization
curl -X POST http://localhost:8000/api/normalize \
  -H "Content-Type: application/json" \
  -d '{"raw_text": "Check emails\nWater plants\nWrite documentation"}'
```

## 🎯 Use Cases & Target Audience

### 👥 Perfect For:
- **Procrastinators**: Let randomness break the paralysis of choice
- **ADHD individuals**: Gamification helps maintain focus and engagement
- **Busy professionals**: Quick task selection without overthinking
- **Students**: Make studying and assignments more engaging
- **Remote workers**: Structure your day with fun task selection
- **Anyone overwhelmed by to-do lists**: Simplify decision-making

### 🏢 Potential Applications:
- **Personal productivity**: Daily task management
- **Team activities**: Random assignment of group tasks
- **Educational settings**: Gamified learning activities
- **Therapy tools**: Structured activity selection for mental health
- **Habit building**: Random reinforcement of positive behaviors

## 🔮 Future Enhancement Ideas

### 🚀 Potential Features:
- **Team collaboration**: Share wheels with friends or colleagues
- **Habit tracking**: Long-term progress visualization
- **Voice commands**: "Hey Roulette, add a task"
- **Smart scheduling**: AI-powered optimal task timing
- **Rewards system**: Points, badges, and achievements
- **Integration**: Connect with calendar apps and other productivity tools
- **Themes**: Customizable visual themes and mascots
- **Analytics**: Detailed productivity insights and recommendations

## 📄 License & Contributing

### 📜 MIT License
This project is open source under the MIT License. Feel free to:
- ✅ Use for personal or commercial projects
- ✅ Modify and distribute
- ✅ Create derivative works
- ✅ Use for learning and education

### 🤝 Contributing Guidelines
While this is primarily a demo project, contributions are welcome!

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### 🙏 Acknowledgments
- Built with love for the productivity community
- Inspired by the need to make task management fun
- Thanks to all the open-source libraries that made this possible

---

## 🎉 Ready to Spin Your Way to Productivity?

**Start your Routine Roulette journey today!** 

1. Clone this repository
2. Follow the quick start guide
3. Add your tasks
4. Spin the wheel
5. Get things done! 🚀

*Remember: Sometimes the best way to decide what to do next is to let chance decide for you. Embrace the randomness, and watch your productivity soar!*
