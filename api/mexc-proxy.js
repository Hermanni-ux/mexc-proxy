import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const apiKey = process.env.MEXC_KEY;
  const apiSecret = process.env.MEXC_SECRET;

  const { symbol, side, entry, testMode } = req.body;

  // 1) Laske quantity — esimerkissä USDT määrä jaetaan hinnalla
  const qty = (50 / parseFloat(entry)).toFixed(5);

  // 2) Valitse endpoint: test vai oikea
  const url = testMode
    ? 'https://api.mexc.com/api/v3/order/test'
    : 'https://api.mexc.com/api/v3/order';

  // 3) Luo parametrit
  const params = {
    symbol: symbol,
    side: side.toUpperCase(),
    type: 'MARKET',
    quantity: qty,
    timestamp: Date.now()
  };

  // 4) Luo signature
  const queryString = new URLSearchParams(params).toString();
  const signature = crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');
  const finalUrl = `${url}?${queryString}&signature=${signature}`;

  try {
    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'X-MEXC-APIKEY': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
