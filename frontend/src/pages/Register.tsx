import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  // 1. Added id_num to state because Supabase requires it
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    id_num: '', // Added this
    vehicleNumber: ''
  });
  
  const [isRunner, setIsRunner] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const inputStyle = "w-full px-4 py-3 rounded-lg border border-[#6E8649] focus:ring-2 focus:ring-[#477023] outline-none transition-all";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Updated Submission Logic
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const role = isRunner ? 'Runner' : 'User';

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          id_num: formData.id_num, // Sending the required ID number
          role: role,
          vehicleNumber: isRunner ? formData.vehicleNumber : null 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        // If backend sends an error, show it here
        setError(data.message || data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Ensure your Docker backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D3D3D3] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Visual Panel */}
        <div className="md:w-1/3 bg-[#0D330E] p-8 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Join Us.</h2>
          <p className="text-[#6E8649] text-sm leading-relaxed">
            Create an account to start booking services or become a runner and earn.
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="md:w-2/3 p-8 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-[#0D330E]">Create Account</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#2D531A]">Runner Mode</span>
              <input 
                type="checkbox" 
                checked={isRunner}
                onChange={() => setIsRunner(!isRunner)}
                className="w-4 h-4 accent-[#477023] cursor-pointer" 
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="text-xs font-bold text-[#6E8649] uppercase">First Name</label>
              <input 
                name="firstName"
                type="text" 
                required
                className={inputStyle} 
                placeholder="John" 
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <label className="text-xs font-bold text-[#6E8649] uppercase">Last Name</label>
              <input 
                name="lastName"
                type="text" 
                required
                className={inputStyle} 
                placeholder="Doe" 
                onChange={handleChange}
              />
            </div>

            {/* Added ID Number Input (Required by your Supabase Schema) */}
            <div className="col-span-2">
              <label className="text-xs font-bold text-[#6E8649] uppercase">ID Number</label>
              <input 
                name="id_num"
                type="text" 
                required
                className={inputStyle} 
                placeholder="Identity Number" 
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-[#6E8649] uppercase">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                className={inputStyle} 
                placeholder="john@example.com" 
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-[#6E8649] uppercase">Password</label>
              <input 
                name="password"
                type="password" 
                required
                className={inputStyle} 
                placeholder="••••••••" 
                onChange={handleChange}
              />
            </div>

            {isRunner && (
              <div className="col-span-2 animate-fadeIn">
                <label className="text-xs font-bold text-[#6E8649] uppercase">Vehicle / License Number</label>
                <input 
                  name="vehicleNumber"
                  type="text" 
                  className={inputStyle} 
                  placeholder="ABC-1234" 
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="col-span-2 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-[#477023] hover:bg-[#2D531A] text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Processing...' : (isRunner ? 'Register as Runner' : 'Create Account')}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-[#2D531A]">
            Already have an account? <a href="/login" className="font-bold text-[#477023] hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;