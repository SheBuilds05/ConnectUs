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

// --- NEW: PROTECTED ROUTE COMPONENT ---
// This checks if the user is logged in and has the right role
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    // Not logged in? Back to login
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== 'admin') {
    // Not an admin but trying to access admin pages? Back to home
    return <Navigate to="/home" />;
  }

  return children;
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Public pages that do NOT show the Sidebar
  const authPaths = ["/", "/login", "/register"];
  const isAuthPage = authPaths.includes(location.pathname);

  if (isAuthPage) {
    return <div className="min-h-screen bg-[#D3D3D3]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#D3D3D3]">
      <main className="flex-1">
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

          {/* --- PRIVATE USER ROUTES (Protected) --- */}
          <Route path="/home" element={<ProtectedRoute><UserHomePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><RunnerProfile /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          
          <Route path="/requests" element={
            <ProtectedRoute>
              <div className="p-8 text-white">Requests Page Coming Soon</div>
            </ProtectedRoute>
          } />
          
          {/* --- ADMIN ROUTES (Protected + Admin Only) --- */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* --- CATCH-ALL --- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;