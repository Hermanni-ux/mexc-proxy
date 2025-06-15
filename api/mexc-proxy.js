export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const apiKey = process.env.MEXC_KEY;
  const apiSecret = process.env.MEXC_SECRET;

  const { symbol, side, entry } = req.body;

  const qty = (50 / parseFloat(entry)).toFixed(5);

  const url = 'https://api.mexc.com/api/v3/order/test';

  const data = {
    symbol: symbol.toUpperCase(),
    side: side.toUpperCase(),
    type: "MARKET",
    quantity: qty,
    timestamp: Date.now()
  };

  // Signature vaatii crypto kirjaston
  const crypto = await import('crypto');

  const queryString = new URLSearchParams(data).toString();
  const signature = crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');

  const finalUrl = `${url}?${queryString}&signature=${signature}`;

  try {
    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'X-MEXC-APIKEY': apiKey,
      },
    });

    const result = await response.json();

    res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
