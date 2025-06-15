import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="app-footer">
    <div className="footer-content">
      <div className="footer-brand">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="logo" className="footer-logo" />
        <span className="footer-title">OIP Trading Platform</span>
      </div>
      <div className="footer-links">
        <a href="/contact">Contact</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} OIP Trading. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
