import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from './components/SideBar';
import MainLayout from './layout/MainLayout'; 
import RunnerProfile from "./pages/RunnerProfile";
import SettingsPage from "./pages/SettingsPage";
import WalletPage from "./pages/WalletPage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import AccountPage from "./pages/AccountPage";
import FavoritesPage from "./pages/FavoritesPage";
import MessagesPage from "./pages/MessagesPage";
import UserHomePage from "./pages/UserHomePage";
import UserBookings from "./pages/UserBookings";
import UserTrackOrder from './pages/UserTrackOrder';
import UserSettings from "./pages/UserSettings";

import "./App.css";

// --- 1. Fixed Protected Route Helper ---
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  // If no token, they aren't logged in at all
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  // If the role doesn't match, send them to the landing page
  if (user.role !== allowedRole) {
    console.warn(`Access denied: User role is ${user.role}, but ${allowedRole} is required.`);
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// --- Runner Layout Wrapper ---
const RunnerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar onClose={undefined} currentPage={undefined} onNavigate={undefined} />
      <main className="flex-1 ml-64 min-h-screen bg-runner-bg">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      {/* --- RUNNER ROUTES --- */}
      <Route
        path="/runner/*"
        element={
          <ProtectedRoute allowedRole="Runner">
            <RunnerLayout>
              <Routes>
                <Route index element={<RunnerProfile />} />
                <Route path="profile" element={<RunnerProfile />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="requests" element={<div className="p-8 text-white">Requests Page Coming Soon</div>} />
              </Routes>
            </RunnerLayout>
          </ProtectedRoute>
        }
      />

      {/* --- USER ROUTES --- */}
      <Route 
        path="/user" 
        element={
          <ProtectedRoute allowedRole="User">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserHomePage />} />
        <Route path="bookings" element={<UserBookings />} />
        <Route path="track" element={<UserTrackOrder />} />
        <Route path="settings" element={<UserSettings />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="best-runners" element={<div className="p-10 text-center font-bold text-[#0D330E]">Top Runners Leaderboard</div>} />
      </Route>

      {/* --- ADMIN ROUTES --- */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Final Catch-all (This was bouncing you back) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;