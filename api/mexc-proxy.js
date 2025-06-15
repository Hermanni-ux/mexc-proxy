import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const apiKey = process.env.MEXC_KEY;
  const apiSecret = process.env.MEXC_SECRET;
  const { symbol, side, entry } = req.body;

  const qty = (50 / parseFloat(entry)).toFixed(5);

  const params = `symbol=${symbol}&side=${side.toUpperCase()}&type=MARKET&quantity=${qty}&timestamp=${Date.now()}`;
  const signature = crypto.createHmac('sha256', apiSecret).update(params).digest('hex');

  try {
    const response = await fetch(`https://api.mexc.com/api/v3/order?${params}&signature=${signature}`, {
      method: 'POST',
      headers: {
        'X-MEXC-APIKEY': apiKey,
      },
    });

    const data = await response.json();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
