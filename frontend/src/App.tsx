import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AddTasks } from './pages/AddTasks'
import { Spin } from './pages/Spin'
import { Timer } from './pages/Timer'
import { RouletteWheel } from './pages/RouletteWheel'
import { NotFound } from './pages/NotFound'
import './theme.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/add-tasks" replace />} />
          <Route path="/add-tasks" element={<AddTasks />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="/roulette" element={<RouletteWheel />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
