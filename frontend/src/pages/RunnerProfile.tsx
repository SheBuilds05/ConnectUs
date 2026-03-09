import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  Bike, 
  Star, 
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Wallet,
  Award,
  ChevronRight,
  MapPin,
  Package,
  Search,
  Phone,
  MessageCircle,
  Navigation,
  Zap,
  CheckCircle,
  Filter,
  ChevronLeft,
  MessageSquare,
  Download,
  ThumbsUp
} from 'lucide-react';
import './Runnerdashboard.css';

const Runnerdashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('available');

  // Stats data
  const stats = [
    { label: 'Total Earnings', value: '$4,892', icon: <DollarSign size={24} />, change: '+12%' },
    { label: 'Completed Trips', value: '156', icon: <Bike size={24} />, change: '+23' },
    { label: 'Rating', value: '4.92', icon: <Star size={24} />, change: 'Top 5%' },
    { label: 'Online Time', value: '128h', icon: <Clock size={24} />, change: 'This month' },
  ];

  // Available orders
  const availableOrders = [
    {
      id: '#ORD-7890',
      restaurant: 'Momofuku Ko',
      items: 'Spicy Ramen • Gyoza',
      customer: 'Michael C.',
      distance: '1.2 km',
      time: '15 min',
      payout: 12.50,
    },
    {
      id: '#ORD-7891',
      restaurant: 'Oceana Grill',
      items: 'Grilled Salmon • Salad',
      customer: 'Sarah J.',
      distance: '2.5 km',
      time: '20 min',
      payout: 15.75,
    },
    {
      id: '#ORD-7892',
      restaurant: 'Bubba Gump',
      items: 'Shrimp Platter • Fries',
      customer: 'David L.',
      distance: '3.1 km',
      time: '25 min',
      payout: 18.20,
    },
  ];

  // Active orders
  const activeOrders = [
    {
      id: '#ORD-7885',
      restaurant: 'Chipotle',
      customer: 'Robert Taylor',
      timeRemaining: '8 min',
      payout: 12.50,
      address: '456 Park Ave, Apt 2B',
    }
  ];

  // Completed orders
  const completedOrders = [
    {
      id: '#ORD-7870',
      restaurant: 'Starbucks',
      customer: 'Amanda Wilson',
      date: 'Today, 10:30 AM',
      payout: 8.75,
      rating: 5
    },
    {
      id: '#ORD-7865',
      restaurant: 'Dunkin\'',
      customer: 'James Brown',
      date: 'Today, 9:15 AM',
      payout: 7.50,
      rating: 5
    },
  ];

  // Reviews data
  const reviews = [
    {
      id: 1,
      name: 'John D.',
      rating: 5,
      comment: 'Fast delivery, very professional! Food was still hot.',
      date: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50'
    },
    {
      id: 2,
      name: 'Sarah M.',
      rating: 5,
      comment: 'Excellent service! Would definitely recommend.',
      date: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1494790108777-2f3bdbce8c3b?w=50'
    },
    {
      id: 3,
      name: 'Mike R.',
      rating: 4,
      comment: 'Friendly runner, order was accurate and on time.',
      date: '2 days ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50'
    },
  ];

  // All orders data
  const allOrders = [
    { id: '#ORD-7890', restaurant: 'Momofuku Ko', date: 'Today, 11:20 AM', status: 'Delivered', payout: 12.50 },
    { id: '#ORD-7891', restaurant: 'Oceana Grill', date: 'Today, 10:30 AM', status: 'Delivered', payout: 15.75 },
    { id: '#ORD-7892', restaurant: 'Bubba Gump', date: 'Today, 9:23 AM', status: 'Delivered', payout: 18.20 },
    { id: '#ORD-7885', restaurant: 'Chipotle', date: 'Today, 8:15 AM', status: 'In Progress', payout: 12.50 },
    { id: '#ORD-7880', restaurant: 'Starbucks', date: 'Yesterday, 4:30 PM', status: 'Delivered', payout: 8.75 },
    { id: '#ORD-7875', restaurant: 'Dunkin\'', date: 'Yesterday, 2:20 PM', status: 'Delivered', payout: 7.50 },
  ];

  // Earnings data
  const earningsData = {
    today: 48.50,
    week: 324.75,
    month: 1482.50,
    total: 4892.25,
    transactions: [
      { id: 1, order: '#ORD-7890', amount: 12.50, date: 'Today, 11:20 AM' },
      { id: 2, order: '#ORD-7891', amount: 15.75, date: 'Today, 10:30 AM' },
      { id: 3, order: '#ORD-7892', amount: 18.20, date: 'Today, 9:23 AM' },
      { id: 4, order: '#ORD-7885', amount: 12.50, date: 'Today, 8:15 AM' },
      { id: 5, order: '#ORD-7880', amount: 8.75, date: 'Yesterday, 4:30 PM' },
      { id: 6, order: '#ORD-7875', amount: 7.50, date: 'Yesterday, 2:20 PM' },
    ]
  };

  // Recent trips
  const recentTrips = [
    { id: 1, restaurant: "Momofuku Ko", time: "11:20 PM", earnings: 12.50, address: "162 2nd Ave", rating: 4.8 },
    { id: 2, restaurant: "Oceana Grill", time: "10:30 PM", earnings: 15.75, address: "456 Oak Ave", rating: 4.9 },
    { id: 3, restaurant: "Bubba Gump", time: "9:23 PM", earnings: 18.20, address: "789 Pine Rd", rating: 4.7 },
  ];

  // ===== ALL BUTTONS WORK =====
  const handleAcceptOrder = (orderId: string) => {
    alert(`✅ Order ${orderId} accepted!`);
    setActiveTab('active');
  };

  const handleUpdateStatus = (orderId: string) => {
    alert(`✅ Order ${orderId} marked as delivered!`);
    setActiveTab('completed');
  };

  const handleSupport = () => alert('📞 Contacting support...');
  const handleMessages = () => alert('💬 Opening messages...');
  const handleNavigate = () => alert('🗺️ Opening navigation...');
  const handleLogout = () => {
    alert('👋 Logging out...');
    // In real app: localStorage.removeItem('token'); window.location.href = '/login';
  };
  
  const handleFilter = () => alert('🔍 Filter options opened');
  const handleViewAllTrips = () => setActivePage('orders');
  const handleTabChange = (tab: string) => setActiveTab(tab);
  const handleToggleOnline = () => setIsOnline(!isOnline);
  const handleNotifications = () => alert('🔔 You have 3 new notifications');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert('🔍 Searching for: ' + (e.currentTarget.querySelector('input')?.value || ''));
  };
  const handleWithdraw = () => alert('💰 Withdrawal requested');
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      alert('Account deleted');
    }
  };

  // Render different pages
  const renderContent = () => {
    switch(activePage) {
      case 'dashboard':
        return (
          <>
            {/* Welcome Banner */}
            <div className="welcome-banner">
              <div>
                <h1>Welcome back, Sarah! 👋</h1>
                <p>You have <span className="highlight">{availableOrders.length} new orders</span> waiting for you</p>
              </div>
              <div className="banner-stats">
                <div className="banner-stat">
                  <span className="banner-stat-value">${earningsData.today}</span>
                  <span className="banner-stat-label">Today</span>
                </div>
                <div className="banner-stat">
                  <span className="banner-stat-value">{activeOrders.length + completedOrders.length}</span>
                  <span className="banner-stat-label">Trips</span>
                </div>
                <div className="banner-stat">
                  <span className="banner-stat-value">4.92</span>
                  <span className="banner-stat-label">Rating</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: '#6E8649' }}>
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                    <span className="stat-change">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Section */}
            <div className="orders-section">
              <div className="section-header">
                <h2>Active Orders</h2>
                <button className="view-all-btn" onClick={() => setActivePage('orders')}>
                  View All <ChevronRight size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="tabs-container">
                <button
                  className={`tab ${activeTab === 'available' ? 'active' : ''}`}
                  onClick={() => handleTabChange('available')}
                >
                  Available ({availableOrders.length})
                </button>
                <button
                  className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => handleTabChange('active')}
                >
                  Active ({activeOrders.length})
                </button>
                <button
                  className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => handleTabChange('completed')}
                >
                  Completed ({completedOrders.length})
                </button>
              </div>

              {/* Orders Grid */}
              <div className="orders-grid">
                {activeTab === 'available' && availableOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <span className="order-id">{order.id}</span>
                        <h3>{order.restaurant}</h3>
                      </div>
                      <span className="order-payout">${order.payout}</span>
                    </div>
                    <p className="order-items">{order.items}</p>
                    <div className="order-customer">
                      <User size={14} color="#6E8649" />
                      <span>{order.customer}</span>
                    </div>
                    <div className="order-details">
                      <span><MapPin size={14} /> {order.distance}</span>
                      <span><Clock size={14} /> {order.time}</span>
                    </div>
                    <button className="accept-btn" onClick={() => handleAcceptOrder(order.id)}>
                      Accept Order <ChevronRight size={16} />
                    </button>
                  </div>
                ))}

                {activeTab === 'active' && activeOrders.map((order) => (
                  <div key={order.id} className="order-card active">
                    <div className="order-header">
                      <div>
                        <span className="order-id">{order.id}</span>
                        <h3>{order.restaurant}</h3>
                      </div>
                      <span className="status-badge">In Progress</span>
                    </div>
                    <p className="order-customer-name">{order.customer}</p>
                    <p className="order-address">{order.address}</p>
                    <div className="timer">{order.timeRemaining} remaining</div>
                    <div className="action-buttons">
                      <button className="action-btn" onClick={handleSupport}><Phone size={14} /> Call</button>
                      <button className="action-btn" onClick={handleMessages}><MessageCircle size={14} /> Message</button>
                      <button className="action-btn" onClick={handleNavigate}><Navigation size={14} /> Navigate</button>
                    </div>
                    <button className="complete-btn" onClick={() => handleUpdateStatus(order.id)}>
                      Mark as Delivered
                    </button>
                  </div>
                ))}

                {activeTab === 'completed' && completedOrders.map((order) => (
                  <div key={order.id} className="order-card completed">
                    <div className="order-header">
                      <div>
                        <span className="order-id">{order.id}</span>
                        <h3>{order.restaurant}</h3>
                      </div>
                      <span className="completed-badge">Delivered</span>
                    </div>
                    <p className="order-customer-name">{order.customer}</p>
                    <div className="order-footer">
                      <span className="order-date">{order.date}</span>
                      <span className="order-payout">${order.payout}</span>
                    </div>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < order.rating ? '#F59E0B' : 'none'} color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trips */}
            <div className="recent-trips">
              <div className="section-header">
                <h3>Recent Trips</h3>
                <button className="view-all-btn" onClick={() => setActivePage('orders')}>
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="trips-list">
                {recentTrips.map((trip) => (
                  <div key={trip.id} className="trip-item">
                    <div className="trip-info">
                      <Bike size={16} />
                      <div>
                        <h4>{trip.restaurant}</h4>
                        <p>{trip.address} · {trip.time}</p>
                      </div>
                    </div>
                    <div className="trip-meta">
                      <span className="earnings">${trip.earnings}</span>
                      <span className="rating">
                        <Star size={10} fill="#F59E0B" color="#F59E0B" /> {trip.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'orders':
        return (
          <div className="page-content">
            <h2 className="page-title">All Orders</h2>
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Restaurant</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.restaurant}</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`status-badge ${order.status === 'Delivered' ? 'delivered' : 'progress'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="payout">${order.payout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'earnings':
        return (
          <div className="page-content">
            <h2 className="page-title">Earnings</h2>
            <div className="earnings-cards">
              <div className="earnings-card total">
                <span className="earnings-label">Total Balance</span>
                <span className="earnings-amount">${earningsData.total}</span>
                <button className="withdraw-btn" onClick={handleWithdraw}>
                  <Download size={14} /> Withdraw
                </button>
              </div>
              <div className="earnings-card">
                <span className="earnings-label">Today</span>
                <span className="earnings-value">${earningsData.today}</span>
              </div>
              <div className="earnings-card">
                <span className="earnings-label">This Week</span>
                <span className="earnings-value">${earningsData.week}</span>
              </div>
              <div className="earnings-card">
                <span className="earnings-label">This Month</span>
                <span className="earnings-value">${earningsData.month}</span>
              </div>
            </div>
            
            <h3 className="section-subtitle">Recent Transactions</h3>
            <div className="transactions-list">
              {earningsData.transactions.map((t) => (
                <div key={t.id} className="transaction-item">
                  <div>
                    <span className="transaction-order">{t.order}</span>
                    <span className="transaction-date">{t.date}</span>
                  </div>
                  <span className="transaction-amount">+${t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="page-content">
            <h2 className="page-title">Customer Reviews</h2>
            <div className="reviews-summary">
              <div className="rating-box">
                <span className="rating-number">4.92</span>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <span className="rating-count">Based on 128 reviews</span>
              </div>
            </div>
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <img src={review.avatar} alt={review.name} className="review-avatar" />
                    <div className="review-info">
                      <h4>{review.name}</h4>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? '#F59E0B' : 'none'} color="#F59E0B" />
                        ))}
                      </div>
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-comment">"{review.comment}"</p>
                  <button className="helpful-btn" onClick={() => alert('Marked as helpful')}>
                    <ThumbsUp size={14} /> Helpful
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="page-content">
            <h2 className="page-title">Settings</h2>
            <div className="settings-container">
              <div className="settings-section">
                <h3>Account Settings</h3>
                <div className="settings-list">
                  <div className="setting-item">
                    <span>Email Notifications</span>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <span>Push Notifications</span>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <span>Language</span>
                    <select className="setting-select">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <span>Time Zone</span>
                    <select className="setting-select">
                      <option>EST (UTC-5)</option>
                      <option>CST (UTC-6)</option>
                      <option>PST (UTC-8)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Privacy</h3>
                <div className="settings-list">
                  <div className="setting-item">
                    <span>Share Location</span>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <span>Show Profile</span>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <span>Activity Status</span>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Payment</h3>
                <div className="settings-list">
                  <div className="setting-item">
                    <span>Bank Account</span>
                    <button className="edit-btn" onClick={() => alert('Edit bank account')}>Edit</button>
                  </div>
                  <div className="setting-item">
                    <span>Payment Methods</span>
                    <button className="edit-btn" onClick={() => alert('Edit payment methods')}>Edit</button>
                  </div>
                  <div className="setting-item">
                    <span>Payout Schedule</span>
                    <button className="edit-btn" onClick={() => alert('Edit payout schedule')}>Edit</button>
                  </div>
                </div>
              </div>

              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Original Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Bike size={28} />
            </div>
            {sidebarOpen && <h2>Connect<span>Us</span></h2>}
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {sidebarOpen && (
          <>
            <div className="sidebar-user">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" 
                alt="Profile"
              />
              <div>
                <h3>Sarah Johnson</h3>
                <p>Verified Runner · 4.92 ⭐</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>
                <Home size={20} />
                <span>Dashboard</span>
              </button>
              <button className={`nav-item ${activePage === 'orders' ? 'active' : ''}`} onClick={() => setActivePage('orders')}>
                <Package size={20} />
                <span>Orders</span>
              </button>
              <button className={`nav-item ${activePage === 'earnings' ? 'active' : ''}`} onClick={() => setActivePage('earnings')}>
                <Wallet size={20} />
                <span>Earnings</span>
              </button>
              <button className={`nav-item ${activePage === 'reviews' ? 'active' : ''}`} onClick={() => setActivePage('reviews')}>
                <MessageSquare size={20} />
                <span>Reviews</span>
              </button>
              <button className={`nav-item ${activePage === 'settings' ? 'active' : ''}`} onClick={() => setActivePage('settings')}>
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </nav>

            <div className="sidebar-footer">
              <div className="online-status">
                <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
                <span>{isOnline ? 'Online' : 'Offline'}</span>
                <button className="toggle-status" onClick={handleToggleOnline}>Toggle</button>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
            </button>
            <div className="page-title">
              <h1>Welcome back, Sarah</h1>
              <p>Ready for your next delivery?</p>
            </div>
          </div>

          <div className="top-bar-right">
            <form onSubmit={handleSearch} className="search-container">
              <Search size={18} color="#6E8649" />
              <input type="text" placeholder="Search orders, customers..." />
            </form>
            <button className="notification-btn" onClick={handleNotifications}>
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" alt="User" />
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