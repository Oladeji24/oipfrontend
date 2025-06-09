import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import TraderPage from './pages/TraderPage';
import AdminPage from './pages/AdminPage';
import DemoPage from './pages/DemoPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<TraderPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
