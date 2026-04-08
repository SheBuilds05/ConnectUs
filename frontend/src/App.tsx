import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./services/api";

// Pages
import Register from "./pages/Register"; 
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import UserHomePage from "./pages/UserHomePage";
import RunnerDashboard from "./pages/Runnerdashboard";
import UserBookings from "./pages/UserBookings";
import UserTrackOrder from './pages/UserTrackOrder';
import UserSettings from "./pages/UserSettings";
import FavoritesPage from "./pages/FavoritesPage";
import MessagesPage from "./pages/MessagesPage";
import AccountPage from "./pages/AccountPage";
import RunnerWallet from "./pages/RunnerWallet";
// REPLACED: Imported your RunnerProfile component
import RunnerProfile from './pages/RunnerProfile'; 
import RunnerActivities from './pages/RunnerActivities'; 

import "./App.css";
import SettingsPage from './pages/SettingsPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    if (userRole === 'runner') {
      return <Navigate to="/runner" replace />;
    } else if (userRole === 'customer') {
      return <Navigate to="/user" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

const RoleBasedRedirect = () => {
  const authenticated = isAuthenticated();
  const role = getUserRole();
  
  if (!authenticated) {
    return <Navigate to="/landing" replace />;
  }
  
  switch(role) {
    case 'runner':
      return <Navigate to="/runner" replace />;
    case 'customer':
      return <Navigate to="/user" replace />;
    default:
      return <Navigate to="/landing" replace />;
  }
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Routes>
              <Route index element={<UserHomePage />} />
              <Route path="bookings" element={<UserBookings />} />
              <Route path="track" element={<UserTrackOrder />} />
              <Route path="settings" element={<UserSettings />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="account" element={<AccountPage />} />
              {/* NOTE: If customers still need to see a runner's details, 
                  you might need a different component here later */}
              <Route path="runner/:runnerId" element={<RunnerProfile />} />
              <Route path="*" element={<Navigate to="/user" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Runner Routes */}
      <Route
        path="/runner/*"
        element={
          <ProtectedRoute allowedRoles={['runner']}>
            <Routes>
              <Route index element={<RunnerDashboard />} />
              <Route path="dashboard" element={<RunnerDashboard />} />
              {/* FIXED: Replaced the "Coming Soon" div with your RunnerProfile component */}
              <Route path="profile" element={<RunnerProfile />} />
              <Route path="wallet" element={<RunnerWallet />} />
              <Route path="Settings" element={<SettingsPage />} />
              <Route path="Activities" element={<RunnerActivities />} />
              
              <Route path="*" element={<Navigate to="/runner" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-8 text-white">Admin Dashboard Coming Soon</div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}

export default App;