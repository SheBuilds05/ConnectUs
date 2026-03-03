import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

// Components & Layouts
import Sidebar from './components/sidebar';
import MainLayout from './layout/MainLayout'; 

// Pages (Note: Dashboard import has been removed)
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

// --- Runner Layout Wrapper ---
const RunnerLayout = ({ children }: { children: React.ReactNode }) => {
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
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* --- RUNNER ROUTES (Dashboard removed) --- */}
        <Route
          path="/runner/*"
          element={
            <RunnerLayout>
              <Routes>
                {/* We now default the index route to Profile since Dashboard is gone */}
                <Route index element={<RunnerProfile />} />
                <Route path="profile" element={<RunnerProfile />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="requests" element={<div className="p-8 text-white">Requests Page Coming Soon</div>} />
              </Routes>
            </RunnerLayout>
          }
        />

        {/* --- USER ROUTES --- */}
        <Route path="/user" element={<MainLayout />}>
          <Route index element={<UserHomePage />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="track" element={<UserTrackOrder />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="best-runners" element={<div className="p-10 text-center font-bold text-[#0D330E]">Top Runners Leaderboard</div>} />
        </Route>

        {/* --- ADMIN --- */}
        <Route path="/admin" element={<AdminDashboard />} />

       
      </Routes>
    </Router>
  );
}

export default App;