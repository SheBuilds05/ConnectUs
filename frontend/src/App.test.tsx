import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('renders the main application title', () => {
    render(<App />);
    
    // We look for the heading that specifically contains "ConnectUs"
    const heading = screen.getByRole('heading', { name: /ConnectUs/i });
    
    expect(heading).toBeDefined();
  });
});
