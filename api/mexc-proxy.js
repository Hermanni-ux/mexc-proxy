export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const apiKey = process.env.MEXC_KEY;
  const { symbol, side, entry } = req.body;
  const qty = (50 / parseFloat(entry)).toFixed(5);

  const response = await fetch('https://api.mexc.com/api/v3/order', {
    method: 'POST',
    headers: {
      'X-MEXC-APIKEY': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      symbol: symbol,
      side: side.toUpperCase(),
      type: 'MARKET',
      quantity: qty
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
