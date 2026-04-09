import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/toast.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div id="toast-container"></div>
    <App />
  </React.StrictMode>
);
