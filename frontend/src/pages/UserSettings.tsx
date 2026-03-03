import React, { useState, useRef } from 'react';
import { User, Bell, HelpCircle, Save, Camera, Check, Loader2, Copy, Phone } from 'lucide-react';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSupportNumber, setShowSupportNumber] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportNumber = "+27 12 345 6789";

  const [notificationSettings, setNotificationSettings] = useState({
    'Booking Confirmations': true,
    'Runner Messages': true,
    'Promotions & News': false,
  });

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
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Support number copied to clipboard!');
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Changes saved successfully!');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-[#0D330E] mb-8">Settings</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 space-y-2">
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
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </aside>

        <div className="flex-1 bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-black/5 relative overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-[#D3D3D3]/50">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-full bg-[#D3D3D3] border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="text-[#6E8649]" />
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-[#0D330E] text-white p-2 rounded-full border-2 border-white hover:scale-110 transition-transform shadow-lg"
                    >
                      <Camera size={16} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-[#0D330E]">Profile Picture</h3>
                    <p className="text-sm text-[#6E8649] mb-3">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#6E8649] uppercase ml-1">Full Name</label>
                    <input type="text" className="w-full p-4 bg-[#D3D3D3]/20 rounded-2xl outline-none" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#6E8649] uppercase ml-1">Email Address</label>
                    <input type="email" className="w-full p-4 bg-[#D3D3D3]/20 rounded-2xl outline-none" defaultValue="john@example.com" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h4 className="font-bold text-[#0D330E] mb-4">How should we reach you?</h4>
                {Object.keys(notificationSettings).map((item) => (
                  <div 
                    key={item} 
                    onClick={() => toggleNotification(item)}
                    className="flex justify-between items-center p-5 bg-[#D3D3D3]/10 rounded-2xl border border-transparent hover:border-[#6E8649]/20 transition-all cursor-pointer"
                  >
                    <span className="font-bold text-[#0D330E]">{item}</span>
                    <button 
                      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                        notificationSettings[item as keyof typeof notificationSettings] ? 'bg-[#477023]' : 'bg-[#D3D3D3]'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                        notificationSettings[item as keyof typeof notificationSettings] ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-8 bg-[#477023]/5 rounded-[32px] border border-[#477023]/10 text-center">
                  <div className="w-16 h-16 bg-[#477023]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="text-[#477023]" size={32} />
                  </div>
                  <h4 className="font-bold text-[#0D330E] mb-2 text-xl">Need Assistance?</h4>
                  <p className="text-[#6E8649] text-sm mb-8 max-w-xs mx-auto">Our support team is available 24/7 to assist you with any issues.</p>
                  
                  {!showSupportNumber ? (
                    <button 
                      onClick={() => setShowSupportNumber(true)}
                      className="w-full py-4 bg-[#0D330E] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                      <Phone size={18} />
                      Contact Support
                    </button>
                  ) : (
                    <div className="animate-in zoom-in duration-300">
                      <div className="bg-white p-4 rounded-2xl border border-[#D3D3D3] flex items-center justify-between mb-4 shadow-sm">
                        <span className="font-mono font-bold text-[#0D330E] text-lg">{supportNumber}</span>
                        <button 
                          onClick={() => copyToClipboard(supportNumber)}
                          className="p-2 hover:bg-[#D3D3D3]/30 rounded-lg text-[#477023] transition-colors"
                        >
                          <Copy size={20} />
                        </button>
                      </div>
                      <button 
                        onClick={() => setShowSupportNumber(false)}
                        className="text-[#6E8649] text-xs font-bold uppercase tracking-widest underline"
                      >
                        Hide Number
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Conditional Footer: Hidden for Support Tab */}
          {activeTab !== 'support' && (
            <div className="mt-12 pt-6 border-t border-[#D3D3D3]/50 flex justify-end">
              <button 
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-[#0D330E] text-white px-10 py-4 rounded-[20px] font-bold flex items-center gap-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
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