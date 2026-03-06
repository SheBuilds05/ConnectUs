import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  User, 
  ClipboardList, 
  Settings, 
  LogOut, 
  ShoppingCart,
  DollarSign, 
  Clock, 
  Bike, 
  Star, 
  TrendingUp,
  Bell,
  Award,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import "./Runnerdashboard.css";

const Runnerdashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
    { name: 'Profile', icon: <User size={20} />, id: 'profile' },
    { name: 'Wallet', icon: <Wallet size={20} />, id: 'wallet' },
    { name: 'View Requests', icon: <ClipboardList size={20} />, id: 'requests' },
    { name: 'Settings', icon: <Settings size={20} />, id: 'settings' },
  ];

  const recentTrips = [
    { id: 1, restaurant: "Momofuku Ko", time: "11:20 PM", earnings: 12.50, address: "162 2nd Ave, New York, NY" },
    { id: 2, restaurant: "Oceana Grill", time: "10:30 PM", earnings: 15.75, address: "456 Oak Ave, New York, NY" },
    { id: 3, restaurant: "Bubba Gump Shrimp Co.", time: "9:23 PM", earnings: 18.20, address: "789 Pine Rd, New York, NY" },
    { id: 4, restaurant: "Gabriel Kreuther", time: "8:10 PM", earnings: 22.30, address: "321 Elm St, New York, NY" }
  ];

  const handleNavigation = (pageId) => {
    setActivePage(pageId);
  };

  const handleOnlineToggle = () => {
    setIsOnline(!isOnline);
  };

  // Render different content based on active page
  const renderContent = () => {
    switch(activePage) {
      case 'dashboard':
        return (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon earnings">
                  <DollarSign size={24} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">Today's Earnings</span>
                  <span className="stat-value">$220.00</span>
                  <span className="stat-trend positive">+12% from yesterday</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon time">
                  <Clock size={24} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">Active Time</span>
                  <span className="stat-value">5h 40m</span>
                  <span className="stat-trend">Online now</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon trips">
                  <Bike size={24} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">Trips Today</span>
                  <span className="stat-value">12</span>
                  <span className="stat-trend">4 pending</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon rating">
                  <Star size={24} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">4.92</span>
                  <span className="stat-trend positive">Top 10%</span>
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="dashboard-grid">
              {/* Left Column - Current Delivery & Bonus */}
              <div className="grid-left">
                {/* Current Delivery Card */}
                <div className="card current-delivery-card">
                  <div className="card-header">
                    <h3>Current Delivery</h3>
                    <span className="badge active">In Progress</span>
                  </div>

                  <div className="delivery-timeline">
                    <div className="timeline-item pickup">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-label">Pickup</span>
                        <h4>Momofuku Ko</h4>
                        <p className="timeline-address">162 2nd Ave, New York, NY</p>
                        <span className="timeline-time">Ready in 5 min</span>
                      </div>
                    </div>

                    <div className="timeline-line"></div>

                    <div className="timeline-item dropoff">
                      <div className="timeline-dot dropoff"></div>
                      <div className="timeline-content">
                        <span className="timeline-label">Dropoff</span>
                        <h4>123 Main Street</h4>
                        <p className="timeline-address">Apt 4B, New York, NY</p>
                        <span className="timeline-time">2.4 km • 35 min</span>
                      </div>
                    </div>
                  </div>

                  <div className="delivery-actions">
                    <button className="btn-primary" onClick={() => alert('Starting delivery...')}>
                      Start Delivery
                      <ChevronRight size={18} />
                    </button>
                    <button className="btn-secondary" onClick={() => alert('Contacting customer...')}>
                      Contact Customer
                    </button>
                  </div>
                </div>

                {/* Bonus Progress Card */}
                <div className="card bonus-card">
                  <div className="card-header">
                    <h3>Today's Bonus Progress</h3>
                    <span className="badge">12am - 11:59pm</span>
                  </div>

                  <div className="bonus-table">
                    <div className="bonus-row header">
                      <span>Bonus</span>
                      <span>$10</span>
                      <span>$30</span>
                      <span>$60</span>
                      <span>$100</span>
                    </div>
                    <div className="bonus-row">
                      <span>Orders</span>
                      <span>$100</span>
                      <span>$140</span>
                      <span>$230</span>
                      <span>$340+</span>
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Progress to next bonus</span>
                      <span className="progress-value">$220 / $340</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '65%' }}></div>
                    </div>
                    <p className="progress-note">Need $120 more to unlock $60 bonus</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Recent Trips */}
              <div className="grid-right">
                <div className="card trips-card">
                  <div className="card-header">
                    <h3>Recent Trips</h3>
                    <span className="badge">Last 4 deliveries</span>
                  </div>

                  <div className="trips-list">
                    {recentTrips.map((trip) => (
                      <div key={trip.id} className="trip-item">
                        <div className="trip-main">
                          <div className="trip-icon">
                            <Bike size={16} />
                          </div>
                          <div className="trip-details">
                            <h4>{trip.restaurant}</h4>
                            <p className="trip-address">{trip.address}</p>
                            <span className="trip-time">{trip.time}</span>
                          </div>
                        </div>
                        <div className="trip-earnings">
                          <span className="earnings-amount">${trip.earnings}</span>
                          <span className="trip-status">Delivered</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="view-all-btn" onClick={() => setActivePage('trips')}>
                    View All Trips
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats-grid">
                  <div className="quick-stat">
                    <span className="quick-stat-label">Acceptance Rate</span>
                    <span className="quick-stat-value">98%</span>
                  </div>
                  <div className="quick-stat">
                    <span className="quick-stat-label">On-Time</span>
                    <span className="quick-stat-value">96%</span>
                  </div>
                  <div className="quick-stat">
                    <span className="quick-stat-label">This Week</span>
                    <span className="quick-stat-value">$1,247</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'profile':
        return (
          <div className="page-content">
            <h2 className="page-title">Profile</h2>
            <div className="profile-card">
              <div className="profile-header">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200" alt="Profile" />
                <h3>Sarah Johnson</h3>
                <p>Verified Runner · ID: #RN2473</p>
              </div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <span>Rating</span>
                  <strong>4.92 ⭐</strong>
                </div>
                <div className="profile-stat">
                  <span>Total Trips</span>
                  <strong>1,247</strong>
                </div>
                <div className="profile-stat">
                  <span>Member Since</span>
                  <strong>2023</strong>
                </div>
              </div>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="page-content">
            <h2 className="page-title">Wallet</h2>
            <div className="earnings-summary">
              <div className="earnings-total-card">
                <h3>Total Balance</h3>
                <p className="earnings-amount-large">$4,892</p>
                <span className="earnings-period">Available for withdrawal</span>
              </div>
              <div className="earnings-stats-grid">
                <div className="earnings-stat-item">
                  <span>This Week</span>
                  <strong>$1,247</strong>
                </div>
                <div className="earnings-stat-item">
                  <span>Last Week</span>
                  <strong>$1,102</strong>
                </div>
                <div className="earnings-stat-item">
                  <span>Pending</span>
                  <strong>$350</strong>
                </div>
              </div>
            </div>
          </div>
        );

      case 'requests':
        return (
          <div className="page-content">
            <h2 className="page-title">View Requests</h2>
            <div className="requests-list">
              <div className="request-card">
                <div className="request-header">
                  <h3>Chipotle Mexican Grill</h3>
                  <span className="badge active">2.5 km away</span>
                </div>
                <p className="request-address">123 Broadway, New York, NY</p>
                <div className="request-footer">
                  <span className="request-payout">$12.50</span>
                  <button className="btn-primary small" onClick={() => alert('Request accepted!')}>Accept</button>
                </div>
              </div>
              <div className="request-card">
                <div className="request-header">
                  <h3>Starbucks</h3>
                  <span className="badge active">1.8 km away</span>
                </div>
                <p className="request-address">456 Park Ave, New York, NY</p>
                <div className="request-footer">
                  <span className="request-payout">$8.75</span>
                  <button className="btn-primary small" onClick={() => alert('Request accepted!')}>Accept</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="page-content">
            <h2 className="page-title">Settings</h2>
            <div className="settings-section">
              <h3>Account Settings</h3>
              <div className="settings-item">
                <span>Email Notifications</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="settings-item">
                <span>Push Notifications</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="settings-item">
                <span>Dark Mode</span>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'trips':
        return (
          <div className="page-content">
            <h2 className="page-title">My Trips</h2>
            <div className="trips-full-list">
              {recentTrips.map((trip) => (
                <div key={trip.id} className="trip-full-card">
                  <div className="trip-full-header">
                    <h3>{trip.restaurant}</h3>
                    <span className="trip-status-badge">Completed</span>
                  </div>
                  <p className="trip-full-address">{trip.address}</p>
                  <div className="trip-full-details">
                    <span><Clock size={14} /> {trip.time}</span>
                    <span><DollarSign size={14} /> ${trip.earnings}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="runner-dashboard">
      {/* YOUR EXACT SIDEBAR CODE */}
      <div className={`h-screen w-64 bg-[#0D330E] flex flex-col fixed left-0 top-0 shadow-2xl transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-[#6E8649] p-2 rounded-xl">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ConnectUs</span>
          </div>
        </div>

        <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
  {/* Logo Section */}
  <div className="sidebar-logo">
    <div className="logo-wrapper">
      <div className="logo-icon">
        <ShoppingCart size={24} />
      </div>
      <span className="logo-text">ConnectUs</span>
    </div>
  </div>

  {/* Navigation Links */}
  <nav className="sidebar-nav">
    <div className="nav-items">
      {menuItems.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </button>
        );
      })}
    </div>
  </nav>

  {/* User & Logout Section */}
  <div className="sidebar-footer">
    <div className="user-info">
      <img 
        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100" 
        className="user-avatar"
        alt="User"
      />
      <div className="user-details">
        <p className="user-name">Sarah J.</p>
        <p className="user-role">Verified Runner</p>
      </div>
    </div>
    
    <button className="logout-btn" onClick={() => alert('Logging out...')}>
      <LogOut size={20} />
      <span className="font-medium">Logout</span>
    </button>
  </div>
</div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#6E8649] text-white shadow-lg shadow-[#6E8649]/20' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-[#6E8649] group-hover:text-white'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User & Logout Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <img 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100" 
              className="w-10 h-10 rounded-full border-2 border-[#6E8649]"
              alt="User"
            />
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm truncate">Sarah J.</p>
              <p className="text-white/50 text-xs">Verified Runner</p>
            </div>
          </div>
          
          <button className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors" onClick={() => alert('Logging out...')}>
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content - Adjust margin to account for fixed sidebar */}
      <main className="main-content" style={{ marginLeft: isOpen ? '16rem' : '0', transition: 'margin-left 0.3s ease' }}>
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
              <Menu size={24} />
            </button>
            <div className="welcome">
              <h1>Welcome back, Sarah</h1>
              <p>Ready for your next delivery?</p>
            </div>
          </div>

          <div className="top-bar-right">
            <button className="notification-btn" onClick={() => alert('You have 3 new notifications')}>
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="online-toggle">
              <button 
                className={`toggle-btn ${isOnline ? 'online' : 'offline'}`}
                onClick={handleOnlineToggle}
              >
                <span className="dot"></span>
                {isOnline ? 'Online' : 'Offline'}
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default Runnerdashboard;