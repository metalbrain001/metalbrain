import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

test('renders welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/welcome to react/i);
  expect(linkElement).toBeDefined();
});
