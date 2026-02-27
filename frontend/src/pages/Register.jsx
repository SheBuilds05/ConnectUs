import React, { useState } from 'react';

const RegisterPage = () => {
  const [isRunner, setIsRunner] = useState(false);

  const inputStyle = "w-full px-4 py-3 rounded-lg border border-[#6E8649] focus:ring-2 focus:ring-[#477023] outline-none";

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
                onChange={() => setIsRunner(!isRunner)}
                className="w-4 h-4 accent-[#477023]" 
              />
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="text-xs font-bold text-[#6E8649] uppercase">First Name</label>
              <input type="text" className={inputStyle} placeholder="John" />
            </div>
            <div className="col-span-1">
              <label className="text-xs font-bold text-[#6E8649] uppercase">Last Name</label>
              <input type="text" className={inputStyle} placeholder="Doe" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-[#6E8649] uppercase">Email Address</label>
              <input type="email" className={inputStyle} placeholder="john@example.com" />
            </div>

            {/* Dynamic Runner Field */}
            {isRunner && (
              <div className="col-span-2 animate-fadeIn">
                <label className="text-xs font-bold text-[#6E8649] uppercase">Vehicle / License Number</label>
                <input type="text" className={inputStyle} placeholder="ABC-1234" />
              </div>
            )}

            <div className="col-span-2 pt-4">
              <button className="w-full bg-[#477023] hover:bg-[#2D531A] text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all">
                {isRunner ? 'Register as Runner' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-[#2D531A]">
            Already have an account? <a href="/login" className="font-bold text-[#477023]">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;