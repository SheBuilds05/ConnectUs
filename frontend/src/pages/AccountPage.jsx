import React from 'react';
import { 
  User, Mail, Phone, MapPin, Shield, 
  CreditCard, Bell, ChevronRight, Camera, LogOut 
} from 'lucide-react';

const AccountPage = () => {
  const settingsGroups = [
    {
      title: "Personal Information",
      items: [
        { icon: <Mail size={18} />, label: "Email Address", value: "alex.smith@example.com" },
        { icon: <Phone size={18} />, label: "Phone Number", value: "+27 82 123 4567" },
        { icon: <MapPin size={18} />, label: "Default Address", value: "Sandton, Johannesburg" },
      ]
    },
    {
      title: "Security & Payments",
      items: [
        { icon: <Shield size={18} />, label: "Password & Security", value: "Last changed 2 months ago" },
        { icon: <CreditCard size={18} />, label: "Payment Methods", value: "Visa •••• 4242" },
        { icon: <Bell size={18} />, label: "Notification Settings", value: "Push & Email On" },
      ]
    }
  ];

  return (
    <div className="p-4 px-6 md:px-12 max-w-5xl mx-auto w-full space-y-10 pb-20">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your profile and app preferences</p>
      </div>

      {/* Profile Card */}
      <div className="relative bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-28 h-28 bg-gray-50 rounded-[35px] border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
            <User size={48} className="text-gray-300" />
            {/* Optional: Add an image tag here if you have a real user photo */}
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 bg-[#2D531A] text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
            <Camera size={16} />
          </button>
        </div>

        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Alex Smith</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
            <span className="bg-green-50 text-[#2D531A] text-[10px] font-black uppercase px-3 py-1 rounded-lg border border-green-100">
              Premium Member
            </span>
            <span className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase px-3 py-1 rounded-lg border border-gray-100">
              Joined Jan 2024
            </span>
          </div>
        </div>
        
        <button className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-2xl transition-all text-sm">
          Edit Profile
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {settingsGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">
              {group.title}
            </h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <button 
                  key={item.label}
                  className="w-full bg-white p-5 rounded-3xl border border-gray-50 hover:border-green-100 hover:shadow-md hover:shadow-green-900/5 transition-all flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#2D531A] group-hover:bg-green-50 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">{item.label}</p>
                      <p className="text-sm font-bold text-gray-700">{item.value}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="pt-6">
        <button className="w-full md:w-auto px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
          <LogOut size={20} />
          Sign Out of All Devices
        </button>
      </div>
    </div>
  );
};

export default AccountPage;