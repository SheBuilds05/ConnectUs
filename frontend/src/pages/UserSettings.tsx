import React, { useState, useRef, useEffect } from 'react';
import { User, Bell, HelpCircle, Save, Camera, Check, Loader2, Copy, Phone, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSupportNumber, setShowSupportNumber] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    'Booking Confirmations': true,
    'Runner Messages': true,
    'Promotions & News': false,
  });

  const supportNumber = "+27 12 345 6789";

  /**
   * 1. LOAD USER DATA
   * Fetch user profile from the backend on component mount
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Replace '1' with actual logged-in user ID
        const response = await fetch('http://localhost:5000/api/users/1/profile');
        if (response.ok) {
          const data = await response.json();
          setFormData({
            full_name: data.full_name || '',
            email: data.email || '',
          });
          if (data.profile_pic) setProfilePic(data.profile_pic);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const menu = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const toggleNotification = (item: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [item]: !prev[item as keyof typeof notificationSettings]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
      // In a real app, you would upload this file to Supabase Storage/S3 here
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could replace this with a toast notification
  };

  /**
   * 2. SAVE CHANGES
   * Send updated profile data to the Express API
   */
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          notifications: notificationSettings
        }),
      });

      if (response.ok) {
        alert('Changes saved successfully!');
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExit = () => {
    navigate('/user'); // Navigate to user homepage
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#477023]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10 relative">
      {/* Exit Button - Fixed position on the right bottom */}
      <button
        onClick={handleExit}
        className="fixed bottom-8 right-8 z-50 bg-[#0D330E] text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group border-2 border-[#A3B18A]/30 hover:border-[#A3B18A]"
        title="Back to Home"
      >
        <LogOut size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
        <span className="text-sm">Exit</span>
      </button>

      <h2 className="text-3xl font-black text-[#0D330E] mb-8">Settings</h2>
      
      <div className="flex gap-6">
        {/* Menu Items - Vertical layout */}
        <div className="w-48 space-y-2">
          {menu.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowSupportNumber(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-[#477023] text-white shadow-lg' 
                : 'bg-white/50 text-[#6E8649] hover:bg-white'
              }`}
            >
              <item.icon size={18} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Card - Smaller size */}
        <div className="flex-1 max-w-xl bg-white rounded-[32px] p-6 shadow-sm border border-black/5">
          <div className="min-h-[400px]">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-[#D3D3D3]/30">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-[#D3D3D3] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={28} className="text-[#6E8649]" />
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-[#0D330E] text-white p-1.5 rounded-full border-2 border-white hover:scale-110 transition-transform shadow-sm"
                    >
                      <Camera size={12} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D330E]">Profile Picture</h3>
                    <p className="text-xs text-[#6E8649]">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-[#6E8649] uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-[#D3D3D3]/10 rounded-xl outline-none focus:ring-2 focus:ring-[#477023]/20 border border-[#D3D3D3]/20" 
                      value={formData.full_name} 
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-[#6E8649] uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full p-3 bg-[#D3D3D3]/10 rounded-xl outline-none focus:ring-2 focus:ring-[#477023]/20 border border-[#D3D3D3]/20" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#0D330E] mb-4">Notification Preferences</h4>
                {Object.keys(notificationSettings).map((item) => (
                  <div 
                    key={item} 
                    onClick={() => toggleNotification(item)}
                    className="flex justify-between items-center p-3 bg-[#D3D3D3]/5 rounded-xl border border-transparent hover:border-[#6E8649]/20 transition-all cursor-pointer"
                  >
                    <span className="font-medium text-sm text-[#0D330E]">{item}</span>
                    <button 
                      className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                        notificationSettings[item as keyof typeof notificationSettings] ? 'bg-[#477023]' : 'bg-[#D3D3D3]'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                        notificationSettings[item as keyof typeof notificationSettings] ? 'right-0.5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-[#477023]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HelpCircle className="text-[#477023]" size={28} />
                  </div>
                  <h4 className="font-bold text-[#0D330E] mb-1 text-lg">Need Assistance?</h4>
                  <p className="text-xs text-[#6E8649] mb-5 max-w-xs mx-auto">
                    Our support team is available 24/7 to assist you.
                  </p>
                  
                  {!showSupportNumber ? (
                    <button 
                      onClick={() => setShowSupportNumber(true)}
                      className="w-full py-3 bg-[#0D330E] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-sm text-sm"
                    >
                      <Phone size={16} />
                      Contact Support
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-[#F5F5F5] p-3 rounded-xl border border-[#D3D3D3]/20 flex items-center justify-between">
                        <span className="font-mono font-bold text-[#0D330E] text-sm">{supportNumber}</span>
                        <button 
                          onClick={() => copyToClipboard(supportNumber)}
                          className="p-1.5 hover:bg-white rounded-lg text-[#477023] transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => setShowSupportNumber(false)}
                        className="text-[#6E8649] text-xs font-bold hover:underline"
                      >
                        Hide Number
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {activeTab !== 'support' && (
            <div className="mt-6 pt-4 border-t border-[#D3D3D3]/30 flex justify-end">
              <button 
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-[#0D330E] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 text-sm"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;