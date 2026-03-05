import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  // 1. State Management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // 2. Login Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- IMPORTANT FIXES HERE ---
        
        // 1. Save the token
        localStorage.setItem('token', data.token);
        
        // 2. Attach the role to the user object before saving 
        // This ensures ProtectedRoute in App.tsx knows who you are
        const userWithRole = { 
          ...data.user, 
          role: role // Use the role selected in the UI
        };
        localStorage.setItem('user', JSON.stringify(userWithRole));
        
        // 3. Conditional Navigation (Matches your App.tsx routes)
        if (role === 'Admin') {
          navigate('/admin');
        } else if (role === 'Runner') {
          navigate('/runner'); // Changed from /dashboard to /runner
        } else {
          navigate('/user'); // Changed from /home to /user
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-lg border border-[#6E8649] bg-white focus:outline-none focus:ring-2 focus:ring-[#477023] transition-all";
  
  return (
    <div className="min-h-screen bg-[#D3D3D3] flex items-center justify-center font-sans p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border-b-8 border-[#0D330E]">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-[#0D330E] mb-2 text-center">Welcome Back</h2>
          <p className="text-[#6E8649] text-center mb-8">Please enter your details to sign in</p>
          
          {/* Role Switcher */}
          <div className="flex bg-[#D3D3D3] rounded-lg p-1 mb-6">
            {['User', 'Runner', 'Admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  role === r ? 'bg-[#477023] text-white shadow' : 'text-[#2D531A] hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0D330E] mb-1 text-left">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                className={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D330E] mb-1 text-left">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-[#477023] hover:bg-[#2D531A] text-white font-bold py-3 rounded-lg shadow-lg transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : `Login as ${role}`}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-[#2D531A]">
            Don't have an account? <a href="/register" className="font-bold text-[#477023] hover:underline">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;