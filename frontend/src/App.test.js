import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the ConnectUs welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Connect with Runners/i);
  expect(linkElement).toBeInTheDocument();
});
