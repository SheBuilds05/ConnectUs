// src/pages/UserHomePage.jsx
import React, { useState } from 'react';
import colors from '../constants/colors';

const UserHomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    const categories = [
        { id: 1, name: 'GROCERY', icon: '🥫' },
        { id: 2, name: 'BEAUTY', icon: '🧴' },
        { id: 3, name: 'TECH', icon: '💻' },
        { id: 4, name: 'FASHION', icon: '👔' },
        { id: 5, name: 'GIFTS', icon: '🎀' },
        { id: 6, name: 'URGENT', icon: '⚡' }
    ];
    
    const runners = [
        {
            id: 1,
            name: 'Lindiwe M.',
            rating: 4.9,
            specialties: ['GROCERY', 'PHARMACY'],
            experience: 'Expert shopper with 3+ years experience. I know the best local markets.',
            rate: 85,
            image: null,
            jobs: 238
        },
        {
            id: 2,
            name: 'Sipho K.',
            rating: 4.8,
            specialties: ['TECH', 'HARDWARE'],
            experience: 'Tech enthusiast. I can help you find the best deals on electronics.',
            rate: 95,
            image: null,
            jobs: 156
        },
        {
            id: 3,
            name: 'Thandi N.',
            rating: 4.9,
            specialties: ['FASHION', 'BEAUTY'],
            experience: 'Personal stylist and shopper. I have an eye for quality and style.',
            rate: 110,
            image: null,
            jobs: 312
        },
        {
            id: 4,
            name: 'Marcus J.',
            rating: 4.7,
            specialties: ['GROCERY', 'HOME'],
            experience: 'Efficient and reliable. I specialize in large household shopping trips.',
            rate: 75,
            image: null,
            jobs: 189
        },
        {
            id: 5,
            name: 'Nosipho D.',
            rating: 5.0,
            specialties: ['BEAUTY', 'GIFTS'],
            experience: 'Beauty expert with knowledge of all premium brands and products.',
            rate: 90,
            image: null,
            jobs: 156
        },
        {
            id: 6,
            name: 'James M.',
            rating: 4.8,
            specialties: ['TECH', 'GROCERY'],
            experience: 'Quick and thorough. I handle multiple stores efficiently.',
            rate: 80,
            image: null,
            jobs: 203
        }
    ];
    
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#FFFFFF',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid rgba(0,0,0,0.05)',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Logo */}
                <div style={{ marginBottom: '40px' }}>
                    <span style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: colors.primaryDark,
                        letterSpacing: '-0.5px'
                    }}>
                        connectus
                    </span>
                </div>
                
                {/* Location */}
                <div style={{ marginBottom: '24px', padding: '0 12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#999', letterSpacing: '0.5px', marginBottom: '8px' }}>
                        CURRENT LOCATION
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primaryDark} strokeWidth="2">
                            <path d="M12 22c-2 0-8-5.5-8-10c0-4.5 3.5-8 8-8s8 3.5 8 8c0 4.5-6 10-8 10z" />
                            <circle cx="12" cy="12" r="3" fill={colors.primaryDark} />
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#222' }}>Sandton, Johannesburg</span>
                    </div>
                </div>
                
                {/* Search */}
                <div style={{
                    backgroundColor: '#F8F9FA',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '32px',
                    border: '1px solid rgba(0,0,0,0.03)'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search runners, specialties, stores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            width: '100%',
                            fontSize: '13px',
                            color: '#333'
                        }}
                    />
                </div>
                
                {/* Navigation Menu */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <MenuItem icon="dashboard" label="Dashboard" active />
                    <MenuItem icon="bookings" label="My Bookings" />
                    <MenuItem icon="shopping" label="Shopping List" />
                    <MenuItem icon="messages" label="Messages" />
                    <MenuItem icon="favorites" label="Favorites" />
                    <MenuItem icon="account" label="Account" />
                </nav>
                
                {/* Safety Badge */}
                <div style={{
                    marginTop: 'auto',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: colors.primaryLight + '20',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primaryLight} strokeWidth="2">
                                <path d="M12 2L2 7v7c0 10 10 14 10 14s10-4 10-14V7l-10-5z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>Verified Safety</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Background checked</div>
                        </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '12px' }}>
                        All runners undergo thorough background verification.
                    </div>
                    <a href="#" style={{ color: colors.primaryLight, fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
                        Learn more →
                    </a>
                </div>
            </div>
            
            {/* Main Content */}
            <div style={{
                flex: 1,
                padding: '32px 40px',
                overflowY: 'auto',
                backgroundColor: '#FFFFFF'
            }}>
                {/* Hero Section */}
                <div style={{
                    background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryMedium} 100%)`,
                    borderRadius: '24px',
                    padding: '48px',
                    marginBottom: '48px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: '700', color: 'white', marginBottom: '16px', lineHeight: '1.2' }}>
                            Get anything delivered from anywhere
                        </h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
                            Connect with trusted local shoppers who'll find exactly what you need.
                        </p>
                        <button style={{
                            backgroundColor: 'white',
                            color: colors.primaryDark,
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px 32px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                        }}>
                            Start Shopping →
                        </button>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: '200px',
                        height: '200px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        zIndex: 1
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: -40,
                        right: 40,
                        width: '300px',
                        height: '300px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50%',
                        zIndex: 1
                    }} />
                </div>
                
                {/* Categories - Professional Icons */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#222' }}>Browse by Category</h2>
                        <a href="#" style={{ color: colors.primaryLight, fontSize: '14px', textDecoration: 'none' }}>View all →</a>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    width: '100px',
                                    height: '100px',
                                    backgroundColor: selectedCategory === cat.name ? colors.primaryMedium : '#F8F9FA',
                                    border: selectedCategory === cat.name ? `2px solid ${colors.primaryLight}` : '1px solid rgba(0,0,0,0.05)',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: selectedCategory === cat.name ? '0 4px 12px rgba(45,83,26,0.2)' : 'none'
                                }}
                            >
                                <span style={{ 
                                    fontSize: '28px',
                                    color: selectedCategory === cat.name ? 'white' : '#555'
                                }}>
                                    {cat.icon}
                                </span>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: selectedCategory === cat.name ? 'white' : '#555',
                                    letterSpacing: '0.3px'
                                }}>
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Available Runners Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#222', marginBottom: '4px' }}>
                            Available Runners
                        </h2>
                        <p style={{ fontSize: '14px', color: '#666' }}>
                            Top-rated shoppers ready to help you today
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: 'white',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#555',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                                <line x1="4" y1="21" x2="4" y2="14" />
                                <line x1="4" y1="10" x2="4" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12" y2="3" />
                                <line x1="20" y1="21" x2="20" y2="16" />
                                <line x1="20" y1="12" x2="20" y2="3" />
                                <line x1="1" y1="14" x2="7" y2="14" />
                                <line x1="9" y1="8" x2="15" y2="8" />
                                <line x1="17" y1="16" x2="23" y2="16" />
                            </svg>
                            Filters
                        </button>
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: colors.primaryLight,
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                                <line x1="8" y1="2" x2="8" y2="18" />
                                <line x1="16" y1="6" x2="16" y2="22" />
                            </svg>
                            View Map
                        </button>
                    </div>
                </div>
                
                {/* Runner Cards - Organized with Image Placeholder */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px',
                    marginBottom: '48px'
                }}>
                    {runners.map(runner => (
                        <div key={runner.id} style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            border: '1px solid rgba(0,0,0,0.05)',
                            overflow: 'hidden',
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}>
                            {/* Image Placeholder */}
                            <div style={{
                                height: '140px',
                                backgroundColor: '#F5F7FA',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '1px solid rgba(0,0,0,0.03)'
                            }}>
                                {runner.image ? (
                                    <img src={runner.image} alt={runner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5">
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M5 20v-2a7 7 0 0 1 14 0v2" />
                                        </svg>
                                        <div style={{ fontSize: '12px', color: '#AAAAAA', marginTop: '4px' }}>No photo</div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Content */}
                            <div style={{ padding: '20px' }}>
                                {/* Top Row: Rating and Name */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <h3 style={{ 
                                        fontSize: '18px', 
                                        fontWeight: '700', 
                                        color: '#222',
                                        margin: 0
                                    }}>
                                        {runner.name}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        backgroundColor: '#FFF9E6',
                                        padding: '4px 8px',
                                        borderRadius: '20px'
                                    }}>
                                        <span style={{ color: '#FFB800', fontSize: '12px' }}>★</span>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#222' }}>{runner.rating}</span>
                                    </div>
                                </div>
                                
                                {/* Experience */}
                                <p style={{ 
                                    fontSize: '13px', 
                                    color: '#666', 
                                    lineHeight: '1.5', 
                                    marginBottom: '16px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    height: '40px'
                                }}>
                                    {runner.experience}
                                </p>
                                
                                {/* Jobs Count */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginBottom: '16px'
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                                        <rect x="2" y="7" width="20" height="14" rx="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                    <span style={{ fontSize: '13px', color: '#666' }}>
                                        {runner.jobs} jobs completed
                                    </span>
                                </div>
                                
                                {/* Categories - Green Shaded */}
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    marginBottom: '20px',
                                    flexWrap: 'wrap'
                                }}>
                                    {runner.specialties.map((spec, index) => (
                                        <span key={index} style={{
                                            backgroundColor: '#2D531A10',
                                            color: '#2D531A',
                                            padding: '4px 12px',
                                            borderRadius: '30px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            letterSpacing: '0.3px'
                                        }}>
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Rate and Book */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTop: '1px solid rgba(0,0,0,0.03)',
                                    paddingTop: '16px'
                                }}>
                                    <div>
                                        <span style={{ 
                                            fontSize: '12px', 
                                            color: '#999',
                                            fontWeight: '500',
                                            marginRight: '4px'
                                        }}>
                                            Rate
                                        </span>
                                        <span style={{ 
                                            fontSize: '22px', 
                                            fontWeight: '700', 
                                            color: '#222' 
                                        }}>
                                            R{runner.rate}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#999' }}>/hr</span>
                                    </div>
                                    
                                    <button style={{
                                        backgroundColor: '#2D531A',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '30px',
                                        padding: '8px 20px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        Book
                                        <span style={{ fontSize: '16px' }}>→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Footer */}
                <footer style={{
                    marginTop: '32px',
                    paddingTop: '32px',
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        gap: '40px',
                        marginBottom: '32px'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#222', marginBottom: '16px' }}>connectus</h4>
                            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                                The smartest way to get exactly what you need from any store, delivered to your door.
                            </p>
                        </div>
                        <div>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#222', marginBottom: '16px' }}>Company</h5>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>About</a></li>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Careers</a></li>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#222', marginBottom: '16px' }}>Support</h5>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Help Center</a></li>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Safety</a></li>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Terms</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#222', marginBottom: '16px' }}>Connect</h5>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Twitter</a></li>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>LinkedIn</a></li>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', padding: '24px 0 0' }}>
                        © 2026 ConnectUs. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
};

// Menu Item Component
const MenuItem = ({ icon, label, active = false }) => {
    const icons = {
        dashboard: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#666'} strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <line x1="8" y1="2" x2="8" y2="22" />
                <line x1="16" y1="2" x2="16" y2="22" />
            </svg>
        ),
        bookings: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#666'} strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        shopping: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#666'} strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.5 13h13L22 5H6" />
            </svg>
        ),
        messages: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#666'} strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        favorites: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#666'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        account: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#666'} strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20v-2a7 7 0 0 1 14 0v2" />
            </svg>
        )
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: active ? colors.primaryLight : 'transparent',
            color: active ? 'white' : '#666',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}>
            {icons[icon]}
            <span style={{ fontSize: '14px', fontWeight: active ? '600' : '400' }}>{label}</span>
        </div>
    );
};

export default UserHomePage;