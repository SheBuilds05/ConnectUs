import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRunner, setSelectedRunner] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactType, setContactType] = useState('runner');

  // Your exact color codes
  const colors = {
    background: '#D3D3D3',    // Gray background
    forest: '#0D330E',        // Pakistan Green
    leaf: '#2D531A',          // Dark Moss
    moss: '#477023',          // Fern Green
    sage: '#6E8649',          // Reseda Green
    white: '#FFFFFF',
    text: '#1F2E2A'
  };

  // Professional SVG Icons with your green palette
  const UsersIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="#477023" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="#477023" strokeWidth="1.5"/>
      <path d="M23 21V19C22.9986 17.1771 21.7652 15.5857 20 15.13" stroke="#6E8649" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="18" cy="5" r="3" stroke="#6E8649" strokeWidth="1.5"/>
    </svg>
  );

  const RunnersIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3" stroke="#477023" strokeWidth="1.5"/>
      <path d="M5 18L7 15L10 18L14 13L17 16L19 14" stroke="#0D330E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 21L15 18L12 20L9 18L6 21" stroke="#6E8649" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const DeliveriesIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="#477023" strokeWidth="1.5"/>
      <path d="M16 3L20 7H12L16 3Z" stroke="#6E8649" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="8" cy="17" r="2" stroke="#0D330E" strokeWidth="1.5"/>
      <circle cx="16" cy="17" r="2" stroke="#0D330E" strokeWidth="1.5"/>
    </svg>
  );

  const RevenueIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#477023" strokeWidth="1.5"/>
      <path d="M12 6V8M12 16V18M15 9L13 11M9 13L7 15" stroke="#0D330E" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1" fill="#6E8649"/>
    </svg>
  );

  const stats = [
    { label: 'Total Users', value: '1,234', icon: <UsersIcon />, change: '+12%' },
    { label: 'Active Runners', value: '456', icon: <RunnersIcon />, change: '+8%' },
    { label: 'Total Deliveries', value: '3,789', icon: <DeliveriesIcon />, change: '+23%' },
    { label: 'Revenue', value: 'R45,678', icon: <RevenueIcon />, change: '+18%' }
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', type: 'Customer', status: 'Active', date: '2024-03-01', email: 'john@example.com', phone: '+27 123 4567', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', type: 'Runner', status: 'Active', date: '2024-03-02', email: 'jane@example.com', phone: '+27 234 5678', rating: 4.8, deliveries: 156, avatar: 'JS' },
    { id: 3, name: 'Bob Johnson', type: 'Customer', status: 'Pending', date: '2024-03-03', email: 'bob@example.com', phone: '+27 345 6789', avatar: 'BJ' },
    { id: 4, name: 'Alice Brown', type: 'Runner', status: 'Active', date: '2024-03-04', email: 'alice@example.com', phone: '+27 456 7890', rating: 4.9, deliveries: 234, avatar: 'AB' }
  ];

  const runnerLocations = [
    { id: 1, name: 'Jane Smith', location: 'CBD', status: 'Delivering', eta: '5 min', phone: '+27 234 5678', avatar: 'JS' },
    { id: 2, name: 'Alice Brown', location: 'Northern Suburbs', status: 'Available', eta: null, phone: '+27 456 7890', avatar: 'AB' },
    { id: 3, name: 'Tom Harris', location: 'Southern Suburbs', status: 'Delivering', eta: '12 min', phone: '+27 789 0123', avatar: 'TH' },
    { id: 4, name: 'Lisa White', location: 'Eastern Suburbs', status: 'Available', eta: null, phone: '+27 890 1234', avatar: 'LW' }
  ];

  const handleBlockRunner = (runnerId) => {
    if (window.confirm('Are you sure you want to block this runner?')) {
      console.log('Blocked runner:', runnerId);
    }
  };

  const handlePenalizeRunner = (runnerId) => {
    const penalty = window.prompt('Enter penalty amount (R):', '50');
    if (penalty) {
      console.log('Penalized runner:', runnerId, 'Amount: R' + penalty);
    }
  };

  const handleContact = (type, name) => {
    setContactType(type);
    setSelectedRunner(name);
    setShowContactModal(true);
  };

  const sendContactMessage = () => {
    alert(`Message sent to ${selectedRunner}`);
    setShowContactModal(false);
    setContactMessage('');
  };

  return (
    <div style={{ 
      backgroundColor: '#D3D3D3', 
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #47702320, #6E864920)',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0D330E20, #2D531A20)',
        zIndex: 0
      }} />

      {/* Admin Navigation */}
      <div style={{ 
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #6E864930',
        padding: '1rem 5%',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.95)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #0D330E, #477023)',
              width: '45px', 
              height: '45px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 15px #0D330E40'
            }}>
              <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '1.4rem' }}>C</span>
            </div>
            <div>
              <span style={{ color: '#0D330E', fontWeight: '700', fontSize: '1.3rem', letterSpacing: '-0.5px' }}>Admin</span>
              <span style={{ color: '#6E8649', fontWeight: '500', fontSize: '1.3rem', marginLeft: '0.3rem' }}>Dashboard</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#2D531A', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Home</Link>
            <Link to="/login" style={{ color: '#2D531A', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Logout</Link>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #477023, #6E8649)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: '600',
              boxShadow: '0 4px 10px #47702340'
            }}>
              A
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div style={{
        margin: '2rem 5% 0',
        padding: '2rem 3rem',
        background: 'linear-gradient(135deg, #0D330E, #477023)',
        borderRadius: '20px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        boxShadow: '0 10px 30px #0D330E40'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FFFFFF20, transparent)',
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: '#FFFFFF', fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Welcome back, Admin
          </h1>
          <p style={{ color: '#FFFFFF', opacity: 0.9, fontSize: '1.1rem' }}>
            Here's what's happening with your platform today
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ padding: '2rem 5% 0', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          background: '#FFFFFF',
          padding: '0.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px #00000010',
          width: 'fit-content'
        }}>
          {['overview', 'tracking', 'runners', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 2rem',
                background: activeTab === tab ? 'linear-gradient(135deg, #477023, #6E8649)' : 'transparent',
                color: activeTab === tab ? '#FFFFFF' : '#2D531A',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                boxShadow: activeTab === tab ? '0 4px 10px #47702340' : 'none'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Content */}
      <div style={{ padding: '2rem 5%', position: 'relative', zIndex: 1 }}>
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '1.5rem', 
              marginBottom: '2rem' 
            }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ 
                  background: '#FFFFFF',
                  padding: '1.5rem', 
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px #00000010',
                  transition: 'all 0.3s',
                  border: '1px solid #6E864920',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px #47702330';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px #00000010';
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #47702310, transparent)',
                    zIndex: 0
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      {stat.icon}
                      <span style={{ 
                        background: '#47702320',
                        color: '#477023',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {stat.change}
                      </span>
                    </div>
                    <div style={{ color: '#0D330E', fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{stat.value}</div>
                    <div style={{ color: '#2D531A', fontSize: '0.95rem', fontWeight: '500' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity & Users */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '1.5rem'
            }}>
              {/* Recent Users Table */}
              <div style={{ 
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px #00000010',
                border: '1px solid #6E864920'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0D330E', fontSize: '1.3rem', fontWeight: '600' }}>Recent Users</h3>
                  <button style={{
                    background: 'transparent',
                    border: `1px solid #477023`,
                    color: '#477023',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    View All
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid #6E864930` }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>User</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Type</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Status</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Joined</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid #6E864920` }}>
                          <td style={{ padding: '1rem 0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{
                                width: '35px',
                                height: '35px',
                                borderRadius: '10px',
                                background: user.type === 'Runner' ? 'linear-gradient(135deg, #477023, #6E8649)' : '#D3D3D3',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: user.type === 'Runner' ? '#FFFFFF' : '#0D330E',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                              }}>
                                {user.avatar}
                              </div>
                              <span style={{ color: '#2D531A', fontWeight: '500' }}>{user.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', color: '#2D531A' }}>{user.type}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              background: user.status === 'Active' ? '#47702320' : 
                                          user.status === 'Blocked' ? '#dc354520' : '#6E864920',
                              color: user.status === 'Active' ? '#477023' : 
                                    user.status === 'Blocked' ? '#dc3545' : '#6E8649',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '50px',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}>
                              {user.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', color: '#2D531A' }}>{user.date}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <button
                              onClick={() => handleContact('user', user.name)}
                              style={{
                                background: 'transparent',
                                color: '#477023',
                                border: '1px solid #477023',
                                borderRadius: '6px',
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#477023';
                                e.currentTarget.style.color = '#FFFFFF';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#477023';
                              }}
                            >
                              Contact
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ 
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px #00000010',
                border: '1px solid #6E864920'
              }}>
                <h3 style={{ color: '#0D330E', fontSize: '1.3rem', fontWeight: '600', marginBottom: '1.5rem' }}>Quick Actions</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #47702310, #6E864910)',
                    border: '1px solid #47702330',
                    borderRadius: '12px',
                    color: '#0D330E',
                    fontWeight: '500',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #47702320, #6E864920)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #47702310, #6E864910)'}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Add New Runner</div>
                    <div style={{ color: '#2D531A', fontSize: '0.9rem' }}>Register a new delivery runner</div>
                  </button>
                  
                  <button style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #47702310, #6E864910)',
                    border: '1px solid #47702330',
                    borderRadius: '12px',
                    color: '#0D330E',
                    fontWeight: '500',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #47702320, #6E864920)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #47702310, #6E864910)'}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Generate Report</div>
                    <div style={{ color: '#2D531A', fontSize: '0.9rem' }}>Download monthly analytics</div>
                  </button>
                  
                  <button style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #47702310, #6E864910)',
                    border: '1px solid #47702330',
                    borderRadius: '12px',
                    color: '#0D330E',
                    fontWeight: '500',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #47702320, #6E864920)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #47702310, #6E864910)'}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>View Analytics</div>
                    <div style={{ color: '#2D531A', fontSize: '0.9rem' }}>Check platform performance</div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'tracking' && (
          <>
            <h2 style={{ 
              color: '#0D330E', 
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '2rem',
              letterSpacing: '-0.5px'
            }}>
              Live Runner Tracking
            </h2>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {runnerLocations.map((runner, i) => (
                <div key={i} style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 10px 30px #00000010',
                  border: '1px solid #6E864920',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px #47702330';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px #00000010';
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '15px',
                    background: runner.status === 'Delivering' ? 'linear-gradient(135deg, #477023, #6E8649)' : '#D3D3D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: runner.status === 'Delivering' ? '#FFFFFF' : '#0D330E',
                    fontWeight: '600',
                    fontSize: '1.2rem'
                  }}>
                    {runner.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#0D330E', fontWeight: '600', fontSize: '1.2rem' }}>{runner.name}</h3>
                      <span style={{
                        background: runner.status === 'Delivering' ? '#47702320' : '#6E864920',
                        color: runner.status === 'Delivering' ? '#477023' : '#6E8649',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {runner.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ color: '#2D531A', fontSize: '0.85rem' }}>Location</span>
                        <div style={{ color: '#0D330E', fontWeight: '500' }}>{runner.location}</div>
                      </div>
                      <div>
                        <span style={{ color: '#2D531A', fontSize: '0.85rem' }}>ETA</span>
                        <div style={{ color: '#0D330E', fontWeight: '500' }}>{runner.eta || 'Available'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleContact('runner', runner.name)}
                      style={{
                        background: 'transparent',
                        color: '#477023',
                        border: '1px solid #477023',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#477023';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#477023';
                      }}
                    >
                      Contact Runner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'runners' && (
          <>
            <h2 style={{ 
              color: '#0D330E', 
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '2rem',
              letterSpacing: '-0.5px'
            }}>
              Manage Runners
            </h2>
            
            <div style={{ 
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px #00000010',
              border: '1px solid #6E864920'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid #6E864930` }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Runner</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Rating</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Deliveries</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Contact</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#0D330E', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.filter(u => u.type === 'Runner').map((runner, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid #6E864920` }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #477023, #6E8649)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontWeight: '600'
                            }}>
                              {runner.avatar}
                            </div>
                            <span style={{ color: '#2D531A', fontWeight: '500' }}>{runner.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#2D531A' }}>{runner.rating || 'N/A'} ⭐</td>
                        <td style={{ padding: '1rem', color: '#2D531A' }}>{runner.deliveries || 0}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            background: runner.status === 'Active' ? '#47702320' : 
                                          runner.status === 'Blocked' ? '#dc354520' : '#6E864920',
                            color: runner.status === 'Active' ? '#477023' : 
                                  runner.status === 'Blocked' ? '#dc3545' : '#6E8649',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '50px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            {runner.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#2D531A' }}>{runner.phone}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleContact('runner', runner.name)}
                              style={{
                                background: 'transparent',
                                color: '#477023',
                                border: '1px solid #477023',
                                borderRadius: '6px',
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#477023';
                                e.currentTarget.style.color = '#FFFFFF';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#477023';
                              }}
                            >
                              Contact
                            </button>
                            <button
                              onClick={() => handleBlockRunner(runner.id)}
                              style={{
                                background: '#dc3545',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                              }}
                            >
                              Block
                            </button>
                            <button
                              onClick={() => handlePenalizeRunner(runner.id)}
                              style={{
                                background: '#ffc107',
                                color: '#0D330E',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                              }}
                            >
                              Penalize
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: '#FFFFFF',
            padding: '2.5rem',
            borderRadius: '20px',
            maxWidth: '450px',
            width: '90%',
            position: 'relative',
            boxShadow: '0 20px 50px #0D330E40'
          }}>
            <button
              onClick={() => setShowContactModal(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#2D531A'
              }}
            >
              ×
            </button>
            
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #477023, #6E8649)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <span style={{ color: '#FFFFFF', fontSize: '1.8rem', fontWeight: '600' }}>C</span>
            </div>
            
            <h3 style={{ 
              color: '#0D330E', 
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Contact {selectedRunner}
            </h3>
            
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Type your message here..."
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: `1px solid #6E864930`,
                marginBottom: '1.5rem',
                minHeight: '120px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#477023';
                e.currentTarget.style.boxShadow = '0 0 0 3px #47702320';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#6E864930';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={sendContactMessage}
                style={{
                  background: 'linear-gradient(135deg, #477023, #6E8649)',
                  color: '#FFFFFF',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px #47702340';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Send Message
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                style={{
                  background: 'transparent',
                  color: '#2D531A',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '50px',
                  border: '1px solid #6E8649',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D3D3D3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;