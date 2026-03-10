import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./services/api";

// Pages
import Register from "./pages/Register"; // Single register page that handles both roles
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
import {RunnerDetailsPage} from './pages/RunnerDetailsPage';

import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
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

// Role-based redirect for root path
const RoleBasedRedirect = () => {
  const authenticated = isAuthenticated();
  const role = getUserRole();
  
  if (!authenticated) {
    return <Navigate to="/landing" replace />;
  }
  
  // Redirect based on user role
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
      <Route path="/register" element={<Register />} /> {/* Single register route */}

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
              <Route path="runner/:runnerId" element={<RunnerDetailsPage />} />
              {/* Catch all for /user/* - redirect to user home */}
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
              <Route path="profile" element={<div className="p-8 text-white">Runner Profile Coming Soon</div>} />
              <Route path="earnings" element={<div className="p-8 text-white">Earnings Page Coming Soon</div>} />
              <Route path="settings" element={<div className="p-8 text-white">Runner Settings Coming Soon</div>} />
              {/* Catch all for /runner/* - redirect to runner dashboard */}
              <Route path="*" element={<Navigate to="/runner" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes (if needed) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-8 text-white">Admin Dashboard Coming Soon</div>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}

export default App;