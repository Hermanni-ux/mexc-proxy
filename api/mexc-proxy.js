// api/mexc-proxy.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }

  const crypto = await import('crypto');
  const fetch = (await import('node-fetch')).default;

  const { symbol, side, entry } = req.body;

  const API_KEY = process.env.MEXC_API_KEY;
  const API_SECRET = process.env.MEXC_SECRET_KEY;
  const BASE_URL = process.env.MEXC_BASE_URL || 'https://api.mexc.com';

  // MEXC vaatii: symbol, side, type, quantity, timestamp, signature
  const timestamp = Date.now();
  const params = new URLSearchParams({
    symbol,
    side,
    type: 'LIMIT',
    quantity: '0.01',  // esimerkki määrä
    price: entry,
    recvWindow: '5000',
    timestamp: timestamp.toString()
  });

  const signature = crypto.createHmac('sha256', API_SECRET)
    .update(params.toString())
    .digest('hex');

  params.append('signature', signature);

  const response = await fetch(`${BASE_URL}/api/v3/order`, {
    method: 'POST',
    headers: {
      'X-MEXC-APIKEY': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  const data = await response.json();
  res.status(200).json(data);
}
