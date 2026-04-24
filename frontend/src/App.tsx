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
import AdminDashboard from "./pages/AdminDashboard";
import RunnerProfile from './pages/RunnerProfile'; 
import "./App.css";
import SettingsPage from './pages/SettingsPage';
import RunnerDetailsPage from './pages/RunnerDetailsPage';
import RunnerActivities from './pages/RunnerActivities';

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
              <Route index element={<UserHomePage onMenuClick={() => {}} />} />
              {/* FIXED: Move runner details route outside the nested structure */}
              <Route path="*" element={<Navigate to="/user" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* FIXED: Move RunnerDetailsPage to a separate route outside the nested structure */}
      <Route
        path="/view-runner/:runnerId"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <RunnerDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/book-runner/:runnerId"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <UserBookings />
          </ProtectedRoute>
        }
      />

      {/* Keep other customer routes as separate routes */}
      <Route
        path="/user/bookings"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <UserBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/track"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <UserTrackOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/settings"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <UserSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/favorites"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/messages"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MessagesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/account"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <AccountPage />
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
        <Route path="profile" element={<RunnerProfile />} />
        <Route path="wallet" element={<RunnerWallet />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="activities" element={<RunnerActivities />} />
        <Route path="*" element={<Navigate to="/runner" replace />} />
      </Routes>
    </ProtectedRoute>
  }
/>

      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}

export default App;
