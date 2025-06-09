// src/pages/TraderPage.js
import React, { useEffect, useState } from 'react';
import TraderDashboard from '../components/TraderDashboard';
import { fetchWallet, fetchTrades } from '../api';

const TraderPage = () => {
  const [wallet, setWallet] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Replace '1' with actual user ID from auth context
        const walletData = await fetchWallet(1);
        const tradesData = await fetchTrades(1);
        setWallet(walletData);
        setTrades(tradesData);
      } catch (e) {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return <TraderDashboard wallet={wallet} trades={trades} loading={loading} />;
};

export default TraderPage;
