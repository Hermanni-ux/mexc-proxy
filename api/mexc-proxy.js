import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const apiKey = process.env.MEXC_KEY;
  const apiSecret = process.env.MEXC_SECRET;

  const { symbol, side, entry } = req.body;

  const quantity = parseFloat(entry);
  const timestamp = Date.now();

  const params = `symbol=${symbol}&side=${side.toUpperCase()}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
  const signature = crypto.createHmac('sha256', apiSecret).update(params).digest('hex');

  const url = `https://api.mexc.com/api/v3/order?${params}&signature=${signature}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-MEXC-APIKEY': apiKey
      }
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
