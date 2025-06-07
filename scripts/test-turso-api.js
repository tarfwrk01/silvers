// Simple test script to verify Turso API integration
const fetch = require('node-fetch');

const TURSO_URL = 'https://skjsilverssmithgmailcom-tarframework.turso.io/v2/pipeline';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDkxNTQ0NzYsImlkIjoiNTMxNmFiZjEtMmU5ZC00ZjRjLTljMTItMmU4ODdkMmRhNjgyIiwicmlkIjoiZjRmYWQ0ODAtNmNmNC00NGEyLTk3MTAtMWI1OTJkNzdkNTE5In0.08KY_FG0_xEpdOIbjS4ilzzrjU2HvXJSZNC4_Gk6hGXsTCHi09fpSdT2MhiDNTSwB7oA24hQ6cKFkEHybrtcAQ';

async function testTursoApi() {
  try {
    console.log('Testing Turso API connection...');
    
    const response = await fetch(TURSO_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TURSO_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql: 'SELECT COUNT(*) as count FROM products',
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.results && data.results[0] && data.results[0].response) {
      const result = data.results[0].response.result;
      if (result.rows && result.rows.length > 0) {
        const count = result.rows[0][0].value;
        console.log(`✅ Successfully connected! Found ${count} products in database.`);
      }
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testTursoApi();
