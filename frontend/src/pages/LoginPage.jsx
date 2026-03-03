import React, { useState } from 'react';

const LoginPage = () => {
  const [role, setRole] = useState('User');

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
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === r ? 'bg-[#477023] text-white shadow' : 'text-[#2D531A] hover:bg-gray-200'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0D330E] mb-1">Email Address</label>
              <input type="email" placeholder="name@company.com" className={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D330E] mb-1">Password</label>
              <input type="password" placeholder="••••••••" className={inputStyle} />
            </div>
            
            <button className="w-full bg-[#477023] hover:bg-[#2D531A] text-white font-bold py-3 rounded-lg shadow-lg transition-colors">
              Login as {role}
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