import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import the actual files you have
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import RunnerProfile from "./pages/RunnerProfile";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#D3D3D3]">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          
          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          
          {/* Runner Routes */}
          <Route path="/profile" element={<RunnerProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;