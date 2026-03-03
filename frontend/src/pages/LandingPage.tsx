import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, User } from 'lucide-react'; // Optional: install lucide-react or use SVGs

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">
          Choose Your <span className="text-blue-500">Path</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Are you here to deliver items and earn, or are you looking to get something moved?
        </p>
      </div>

      {/* Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Runner Card */}
        <Link 
          to="/runner" 
          className="group relative overflow-hidden bg-gray-800 border-2 border-transparent hover:border-blue-500 transition-all duration-300 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl"
        >
          <div className="mb-6 p-4 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform">
            <Truck size={48} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">I am a Runner</h2>
          <p className="text-gray-400 mb-6">
            View available requests, manage your wallet, and track your deliveries.
          </p>
          <span className="mt-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold group-hover:bg-blue-500 transition-colors">
            Enter Dashboard
          </span>
        </Link>

        {/* User Card */}
        <Link 
          to="/user" 
          className="group relative overflow-hidden bg-gray-800 border-2 border-transparent hover:border-green-500 transition-all duration-300 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl"
        >
          <div className="mb-6 p-4 bg-green-500/10 rounded-full group-hover:scale-110 transition-transform">
            <User size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">I am a User</h2>
          <p className="text-gray-400 mb-6">
            Book a runner, track your current orders, and manage your settings.
          </p>
          <span className="mt-auto px-6 py-2 bg-green-600 text-white rounded-lg font-semibold group-hover:bg-green-500 transition-colors">
            Start Booking
          </span>
        </Link>

      </div>

      {/* Footer Hint */}
      <p className="mt-12 text-gray-500 text-sm">
        You can switch between accounts anytime from the settings menu.
      </p>
    </div>
  );
};

export default LandingPage;