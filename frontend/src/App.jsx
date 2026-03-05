import { Sidebar } from './components/Sidebar'; 
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Existing Imports
import Dashboard from "./pages/Dashboard";
import RunnerProfile from "./pages/RunnerProfile";
import SettingsPage from "./pages/SettingsPage";
import WalletPage from "./pages/WalletPage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";

// NEW Imports from your updated file tree
import AccountPage from "./pages/AccountPage";
import BookingsPage from "./pages/BookingsPage";
import FavoritesPage from "./pages/FavoritesPage";
import MessagesPage from "./pages/MessagesPage";
import UserHomePage from "./pages/UserHomePage";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Public pages that do NOT show the Sidebar
  const authPaths = ["/", "/login", "/register"];
  const isAuthPage = authPaths.includes(location.pathname);

  if (isAuthPage) {
    return <div className="min-h-screen bg-[#D3D3D3]">{children}</div>;
  }

  // Private/App pages that DO show the Sidebar
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
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* --- PRIVATE USER ROUTES (With Sidebar) --- */}
          <Route path="/home" element={<UserHomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<RunnerProfile />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Placeholder for requests from previous code */}
          <Route path="/requests" element={<div className="p-8 text-white">Requests Page Coming Soon</div>} />
          
          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* --- CATCH-ALL --- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;