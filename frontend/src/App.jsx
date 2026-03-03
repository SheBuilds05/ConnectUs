import Sidebar from './components/sidebar';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RunnerProfile from "./pages/RunnerProfile";
import SettingsPage from "./pages/SettingsPage";
import WalletPage from "./pages/WalletPage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";

// This helper component decides whether to show the Sidebar layout or the Auth layout
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Define paths where we DON'T want the sidebar (Landing, Login, Register)
  const authPaths = ["/", "/login", "/register"];
  const isAuthPage = authPaths.includes(location.pathname);

  if (isAuthPage) {
    // Full screen layout for Landing/Auth
    return <div className="min-h-screen bg-[#D3D3D3]">{children}</div>;
  }

  // Dashboard layout with Sidebar
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen bg-runner-bg">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* 1. Public Entry Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* 2. Authenticated User Pages (Sidebar will show) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<RunnerProfile />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/requests" element={<div className="p-8 text-white">Requests Page Coming Soon</div>} />
          
          {/* 3. Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;