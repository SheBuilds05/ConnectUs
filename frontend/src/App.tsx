import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import "./App.css";

import Sidebar from './components/sidebar';
import RunnerDashboard from "./pages/Dashboard"; 
import RunnerProfile from "./pages/RunnerProfile";
import SettingsPage from "./pages/SettingsPage";
import WalletPage from "./pages/WalletPage";
import MainLayout from './layout/MainLayout'; 
import UserBookings from "./pages/UserBookings";
import UserTrackOrder from './pages/UserTrackOrder';
import UserSettings from "./pages/UserSettings";

// landing page
const LandingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-4xl font-bold mb-8">Welcome to the Platform</h1>
    <div className="flex gap-6">
      <Link to="/runner" className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
        Enter as Runner
      </Link>
      <Link to="/user" className="px-8 py-4 bg-green-600 rounded-lg hover:bg-green-700 transition">
        Enter as User
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* RUNNER ROUTES */}
        <Route path="/runner/*" element={
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen bg-runner-bg">
              <Routes>
                <Route path="/" element={<RunnerDashboard />} />
                <Route path="profile" element={<RunnerProfile />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="requests" element={<div className="p-8 text-white">Requests Page Coming Soon</div>} />
              </Routes>
            </main>
          </div>
        } />

        {/* USER ROUTES */}
        <Route path="/user/*" element={
          <Routes>
              <Route path="/" element={<UserBookings/>} />
              <Route path="track" element={<UserTrackOrder />} />
              <Route path="settings" element={<UserSettings />} />
              <Route path="best-runners" element={<div className="p-10 text-center">Best Runners Content</div>} />
          </Routes>
        } />

        {/* Catch-all redirect to Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;