import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { identifyDemoUser, initAnalytics, trackViewedDashboard } from './lib/analytics';
import './index.css';

initAnalytics();
identifyDemoUser();
trackViewedDashboard();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
