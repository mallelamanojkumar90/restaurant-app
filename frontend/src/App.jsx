import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import StaffLogin from './pages/StaffLogin'
import StaffPanel from './pages/StaffPanel'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staff" element={<StaffLogin />} />
        <Route path="/staff/panel" element={<StaffPanel />} />
      </Routes>
    </Router>
  )
}

export default App
