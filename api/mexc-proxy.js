import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const apiKey = process.env.MEXC_KEY;
  const apiSecret = process.env.MEXC_SECRET;

  const { symbol, side, entry } = req.body;

  const qty = (50 / parseFloat(entry)).toFixed(5); // Esimerkki laskenta

  const timestamp = Date.now();

  // Luo query string
  const params = `symbol=${symbol}&side=${side.toUpperCase()}&type=MARKET&quantity=${qty}&timestamp=${timestamp}`;

  // Allekirjoita secretilla
  const signature = crypto.createHmac('sha256', apiSecret).update(params).digest('hex');

  const finalParams = `${params}&signature=${signature}`;

  try {
    const response = await fetch(`https://api.mexc.com/api/v3/order?${finalParams}`, {
      method: 'POST',
      headers: {
        'X-MEXC-APIKEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
