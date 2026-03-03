import Sidebar from './components/sidebar';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RunnerProfile from "./pages/RunnerProfile";
import SettingsPage from "./pages/SettingsPage";
import WalletPage from "./pages/WalletPage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* 1. Sidebar stays fixed on the left */}
        <Sidebar />

        {/* 2. Main Content Area starts here */}
        <main className="flex-1 ml-64 min-h-screen bg-runner-bg">
          <Routes>
            {/* The Home route now points to Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* The Profile route */}
            <Route path="/profile" element={<RunnerProfile />} />

            {/* The wallet route */}
            <Route path="/wallet" element={<WalletPage />} />
            
            {/* The Settings route */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* View Requests Placeholder */}
            <Route path="/requests" element={<div className="p-8 text-white">Requests Page Coming Soon</div>} />
            
            {/* Catch-all route (MUST BE LAST) */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        </div>
      <div className="min-h-screen bg-[#D3D3D3]">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
