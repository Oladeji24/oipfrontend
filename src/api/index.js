// src/api/index.js
// Centralized API utility for backend communication

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export async function fetchWallet(userId) {
  const res = await fetch(`${API_BASE_URL}/wallet/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch wallet');
  return res.json();
}

export async function fetchTrades(userId) {
  const res = await fetch(`${API_BASE_URL}/trades/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch trades');
  return res.json();
}

// Add more API functions as needed (deposit, withdraw, start bot, etc.)
