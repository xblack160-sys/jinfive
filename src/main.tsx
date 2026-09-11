import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter benign development websocket errors in iframe sandbox
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const msg = args[0] ? String(args[0]) : '';
    if (
      msg.includes('[vite]') ||
      msg.includes('WebSocket') ||
      msg.includes('failed to connect') ||
      msg.includes('connection refused')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
