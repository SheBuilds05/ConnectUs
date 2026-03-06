
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [showAbout, setShowAbout] = useState(false);

  // Updated color palette
  const colors = {
    resedaGreen: '#6E8649',
    fernGreen: '#477023',
    darkMoss: '#2D531A',
    pakistanGreen: '#0D330E',
    gray: '#D3D3D3',
    white: '#FFFFFF',
    text: '#0D330E'
  };

  // Icons updated with Reseda and Pakistan Green
  const UploadIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V4M12 4L8 8M12 4L16 8" stroke={colors.resedaGreen} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke={colors.pakistanGreen} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const AIIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke={colors.resedaGreen} strokeWidth="1.5"/>
      <path d="M12 5V3M12 21V19M19 12H21M3 12H5M17.66 6.34L19.07 4.93M4.93 19.07L6.34 17.66M17.66 17.66L19.07 19.07M4.93 4.93L6.34 6.34" 
            stroke={colors.fernGreen} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const PaymentIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke={colors.pakistanGreen} strokeWidth="1.5"/>
      <path d="M2 10H22M7 15H9M16 15H18" stroke={colors.resedaGreen} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1" fill={colors.fernGreen}/>
    </svg>
  );

  const RunnerIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3" stroke={colors.pakistanGreen} strokeWidth="1.5"/>
      <path d="M5 18L7 15L10 18L14 13L17 16L19 14" stroke={colors.resedaGreen} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 21L15 18L12 20L9 18L6 21" stroke={colors.fernGreen} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.pakistanGreen} strokeWidth="1.5"/>
      <path d="M3 9H21M8 2V6M16 2V6" stroke={colors.resedaGreen} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="14" r="1" fill={colors.fernGreen}/>
      <circle cx="16" cy="14" r="1" fill={colors.fernGreen}/>
      <circle cx="8" cy="14" r="1" fill={colors.fernGreen}/>
    </svg>
  );

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: colors.gray, minHeight: '100vh', width: '100%', position: 'absolute', top: 0, left: 0, overflow: 'auto' }}>
      
      {/* Decorative Background Blobs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: `linear-gradient(135deg, ${colors.resedaGreen}20, ${colors.fernGreen}20)`, zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: `linear-gradient(135deg, ${colors.pakistanGreen}10, ${colors.resedaGreen}20)`, zIndex: 0 }} />

      {/* Navigation */}
      <nav style={{ backgroundColor: colors.white, borderBottom: `1px solid ${colors.resedaGreen}30`, padding: '1rem 5%', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.95)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ background: `linear-gradient(135deg, ${colors.pakistanGreen}, ${colors.resedaGreen})`, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 10px ${colors.pakistanGreen}40` }}>
              <span style={{ color: colors.white, fontWeight: '600', fontSize: '1.2rem' }}>C</span>
            </div>
            <span style={{ color: colors.pakistanGreen, fontWeight: '700', fontSize: '1.3rem', letterSpacing: '-0.5px' }}>
              ConnectUs<span style={{ color: colors.resedaGreen }}>.</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            {['About', 'Services', 'How It Works', 'Contact'].map((item) => (
              <button key={item} 
                onClick={() => item === 'About' ? setShowAbout(true) : scrollToSection(item.toLowerCase().replace(/ /g, '-'))}
                style={{ color: colors.darkMoss, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.resedaGreen}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.darkMoss}
              >
                {item}
              </button>
            ))}
            <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
              <Link to="/login" style={{ color: colors.pakistanGreen, textDecoration: 'none', fontWeight: '500', padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/register" style={{ background: `linear-gradient(135deg, ${colors.pakistanGreen}, ${colors.darkMoss})`, color: colors.white, padding: '0.6rem 1.8rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', boxShadow: `0 4px 10px ${colors.pakistanGreen}30` }}>Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Banner */}
      <div id="services" style={{ margin: '2rem 5% 0', padding: '3rem', background: `linear-gradient(135deg, ${colors.pakistanGreen}, ${colors.darkMoss})`, borderRadius: '20px', position: 'relative', zIndex: 1, boxShadow: `0 10px 30px ${colors.pakistanGreen}40` }}>
        <h1 style={{ color: colors.white, fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Your Local Items, Delivered</h1>
        <p style={{ color: colors.gray, opacity: 0.9, fontSize: '1.1rem' }}>Connect with trusted local runners in your area</p>
      </div>

      {/* Hero Section */}
      <div style={{ padding: '4rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ backgroundColor: colors.white, color: colors.fernGreen, padding: '0.5rem 1rem', borderRadius: '50px', display: 'inline-block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1.5rem', border: `1px solid ${colors.resedaGreen}30` }}>⚡ Trusted by 10,000+ users</div>
          <h2 style={{ color: colors.pakistanGreen, fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem' }}>
            Your Local Items,<br /><span style={{ color: colors.resedaGreen }}>Delivered Instantly</span>
          </h2>
          <p style={{ color: colors.darkMoss, fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>Connect with trusted local runners who can shop and deliver anything you need. Fast, reliable, and secure.</p>
          
          <div style={{ display: 'flex', backgroundColor: colors.white, borderRadius: '12px', border: `1px solid ${colors.resedaGreen}30`, marginBottom: '2rem', overflow: 'hidden' }}>
            <input type="text" placeholder="What would you like delivered?" style={{ flex: 1, padding: '1rem', border: 'none', outline: 'none' }} />
            <button style={{ backgroundColor: colors.pakistanGreen, color: colors.white, padding: '1rem 2rem', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Search</button>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/find-runner" style={{ backgroundColor: colors.pakistanGreen, color: colors.white, padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>Find a Runner</Link>
            <Link to="/become-runner" style={{ border: `2px solid ${colors.pakistanGreen}`, color: colors.pakistanGreen, padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>Become a Runner</Link>
          </div>
        </div>

        {/* Stats Card */}
        <div style={{ backgroundColor: colors.white, borderRadius: '20px', padding: '2rem', border: `1px solid ${colors.resedaGreen}20`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[{v:'10k+',l:'Runners'}, {v:'50k+',l:'Deliveries'}, {v:'98%',l:'Happy'}, {v:'100+',l:'Cities'}].map((s,i)=>(
              <div key={i} style={{ backgroundColor: colors.gray + '40', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ color: colors.fernGreen, fontSize: '2rem', fontWeight: '700' }}>{s.v}</div>
                <div style={{ color: colors.darkMoss, fontSize: '0.9rem' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" style={{ backgroundColor: colors.white, padding: '5rem 5%', position: 'relative', zIndex: 1 }}>
        <h2 style={{ textAlign: 'center', color: colors.pakistanGreen, fontSize: '2.5rem', marginBottom: '4rem' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {[
            { icon: <UploadIcon />, title: 'Upload Photos', desc: 'Take photos of the items you need and upload them.' },
            { icon: <AIIcon />, title: 'AI Matching', desc: 'Our AI matches you with the perfect local runner.' },
            { icon: <PaymentIcon />, title: 'Secure Payments', desc: 'Pay securely with our protected escrow system.' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '2rem', backgroundColor: colors.gray + '20', borderRadius: '16px', textAlign: 'center', border: `1px solid ${colors.resedaGreen}10` }}>
              <div style={{ marginBottom: '1.5rem' }}>{item.icon}</div>
              <h3 style={{ color: colors.pakistanGreen, marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: colors.darkMoss }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div id="contact" style={{ backgroundColor: colors.pakistanGreen, padding: '5rem 5%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2 style={{ color: colors.white, fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Get Started?</h2>
        <p style={{ color: colors.gray, marginBottom: '2rem', fontSize: '1.2rem' }}>Join thousands of users who trust ConnectUs today.</p>
        <Link to="/register" style={{ backgroundColor: colors.resedaGreen, color: colors.white, padding: '1rem 3rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', display: 'inline-block' }}>Create Free Account</Link>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#081f09', padding: '4rem 5% 2rem', color: colors.white }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: colors.white }}>ConnectUs</h3>
            <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '1.5rem' }}>
              The most trusted local runner network. We make getting items from your favorite local shops easier and faster than ever before.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Simple Social Media Placeholders */}
              {['FB', 'TW', 'IG', 'LN'].map(social => (
                <div key={social} style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  border: `1px solid ${colors.resedaGreen}`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: colors.resedaGreen
                }}>
                  {social}
                </div>
              ))}
            </div>
          </div>

          {[
            { 
              title: 'Company', 
              links: ['About Our Mission', 'Our Story', 'Press & Media', 'Careers'] 
            },
            { 
              title: 'Services', 
              links: ['Find a Runner', 'Become a Runner', 'Business Solutions', 'Pricing'] 
            },
            { 
              title: 'Support', 
              links: ['Help Center', 'Safety Standards', 'Terms of Service', 'Privacy Policy'] 
            }
          ].map((cat, i) => (
            <div key={i}>
              <h4 style={{ marginBottom: '1.5rem', color: colors.resedaGreen, fontWeight: '600' }}>{cat.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7, lineHeight: '2.2' }}>
                {cat.links.map(link => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} style={{ 
                      color: colors.white, 
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.resedaGreen}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.white}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}  
        </div>

        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          marginTop: '3rem', 
          paddingTop: '2rem', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: 0.5,
          fontSize: '0.9rem'
        }}>
          <div>© 2026 ConnectUs Marketplace Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '2rem' }}>
          
          </div>
        </div>
      </footer>
      {/* About Modal */}
      {showAbout && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: colors.white, padding: '3rem', borderRadius: '20px', maxWidth: '500px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowAbout(false)} style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: colors.pakistanGreen }}>✕</button>
            <h2 style={{ color: colors.pakistanGreen, marginBottom: '1rem' }}>About ConnectUs</h2>
            <p style={{ color: colors.darkMoss, lineHeight: '1.6' }}>ConnectUs is a professional marketplace connecting people with local shopping assistants (Runners) using AI and secure escrow payments.</p>
            <button onClick={() => setShowAbout(false)} style={{ marginTop: '2rem', backgroundColor: colors.pakistanGreen, color: colors.white, padding: '0.8rem 2rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
