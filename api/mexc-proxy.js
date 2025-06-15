export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const crypto = await import('crypto');
  const { symbol, side, entry } = req.body;

  const apiKey = process.env.MEXC_KEY;
  const apiSecret = process.env.MEXC_SECRET;

  const endpoint = "/api/v3/order";
  const baseURL = "https://api.mexc.com";

  const timestamp = Date.now();
  const queryString = `symbol=${symbol}&side=${side.toUpperCase()}&type=MARKET&quantity=${entry}&timestamp=${timestamp}`;
  const signature = crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');

  const url = `${baseURL}${endpoint}?${queryString}&signature=${signature}`;

  try {
    const response = await fetch(url, {
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
