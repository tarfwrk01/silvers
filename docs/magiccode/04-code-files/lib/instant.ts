import { init } from '@instantdb/react-native';

// Get app ID from environment variable
// Replace EXPO_PUBLIC_INSTANT_APP_ID in .env with your actual app ID from https://www.instantdb.com/dash
const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || 'your-app-id-here';

// Initialize Instant DB
const db = init({
  appId: APP_ID,
});

export default db;
