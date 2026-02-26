import React from 'react';
import ImageUpload from '../components/ImageUpload';

const Home = () => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header style={{ backgroundColor: '#213502', color: '#7EA00E', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>SMART BOOKING</h1>
        <p style={{ color: 'white' }}>"If you can take a picture of it, we can get it for you."</p>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <section>
          <h2 style={{ color: '#213502' }}>Create New Request</h2>
          <p>Snap a photo of the item you need from the local store.</p>
          <ImageUpload onUpload={(file) => console.log("File ready for Sprint 3:", file)} />
          <textarea 
            placeholder="Add description (e.g., 'Organic milk from the corner shop')"
            style={{ width: '100%', marginTop: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <button style={{ width: '100%', padding: '15px', backgroundColor: '#7EA00E', color: 'white', border: 'none', borderRadius: '8px', marginTop: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Find a Runner
          </button>
        </section>
      </main>
    </div>
  );
};

export default Home;