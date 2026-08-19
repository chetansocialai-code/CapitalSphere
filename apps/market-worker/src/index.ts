import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

console.log('🚀 CAPITALSPHERE Market Data Worker Service Initialized');
console.log(`📡 Stream Base Endpoint: ${process.env.UPSTOX_WS_URL || 'wss://api.upstox.com/v3/feed/market-data-feed'}`);
console.log(`🔒 Upstox Client Application Registered: ${process.env.UPSTOX_CLIENT_ID}`);
