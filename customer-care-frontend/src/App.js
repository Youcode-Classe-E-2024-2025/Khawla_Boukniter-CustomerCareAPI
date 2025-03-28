// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
