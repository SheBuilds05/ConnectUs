import React, { useState } from 'react';
import { Moon, Sun, Bell, Lock, Truck, CreditCard, ShieldCheck, Map } from 'lucide-react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`p-8 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Runner Settings</h1>
        <p className="text-gray-500 mb-8">Manage your shopping and delivery preferences</p>

        <div className="space-y-6">
          
          {/* 1. SERVICE STATUS & APPEARANCE */}
          <section className={`p-6 rounded-3xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-[#4ade80]" size={22} /> Availability & View
            </h2>
            <div className="space-y-4">
              <ToggleOption 
                label="Accepting New Requests" 
                description="Go 'Online' to see shopping requests in your area"
                isActive={true}
              />
              <div className="h-[1px] bg-gray-100 dark:bg-gray-700 my-2" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm opacity-60">Easier on the eyes during night deliveries</p>
                </div>
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </section>

          {/* 2. DELIVERY & VEHICLE (Specific to Errand-Running) */}
          <section className={`p-6 rounded-3xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Truck className="text-[#4ade80]" size={22} /> Delivery Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase opacity-50">Vehicle Type</label>
                <select className="w-full mt-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-none outline-none">
                  <option>Bicycle (Small items only)</option>
                  <option>Sedan (Standard groceries)</option>
                  <option>SUV/Truck (Large furniture/Bulky items)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase opacity-50">Max Shopping Distance</label>
                <select className="w-full mt-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-none outline-none">
                  <option>Within 5 miles</option>
                  <option>Within 15 miles</option>
                  <option>Anywhere in city</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <ToggleOption 
                label="Heavy Lifting" 
                description="I can carry items over 40 lbs (e.g., cases of water, small furniture)"
                isActive={false}
              />
            </div>
          </section>

          {/* 3. PAYOUTS & EARNINGS */}
          <section className={`p-6 rounded-3xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="text-[#4ade80]" size={22} /> Payout Method
            </h2>
            <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <CreditCard size={20} />
                </div>
                <p className="font-medium">Connect your bank account</p>
              </div>
              <button className="text-[#4ade80] font-bold text-sm">Setup</button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

const ToggleOption = ({ label, description, isActive }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-sm opacity-60">{description}</p>
    </div>
    <div className={`w-12 h-6 rounded-full relative ${isActive ? 'bg-[#4ade80]' : 'bg-gray-300'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isActive ? 'right-1' : 'left-1'}`} />
    </div>
  </div>
);

export default SettingsPage;