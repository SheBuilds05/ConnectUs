import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import Landing from './pages/Landing'; // This is your "Runner-On-Demand" screen

function App() {
  // This state acts as a temporary navigator until we add React Router
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <Router>
      <div className="min-h-screen bg-[#D3D3D3]">
        <Routes>
          {/* This is the main page with the buttons */}
          <Route path="/" element={<Landing />} /> 
          
          {/* These are your new pages */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/register" element={<AdminRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

// Simple style for your temporary buttons using your brand colors
const navBtnStyle = {
  backgroundColor: '#7EA00E',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default App;