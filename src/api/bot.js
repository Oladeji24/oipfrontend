// src/api/bot.js
// API utility for bot trading actions
import api from './index';

export const startBot = (market) => api.post('/bot/start', { market });
export const stopBot = () => api.post('/bot/stop');
export const switchBotMarket = (market) => api.post('/bot/switch', { market });
