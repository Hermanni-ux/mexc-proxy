import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST allowed' });
  }

  const apiKey = process.env.MEXC_KEY;
  const apiSecret = process.env.MEXC_SECRET;

  const { symbol, side, entry, tp, sl } = req.body;
  const qty = (50 / parseFloat(entry)).toFixed(5);

  try {
    const response = await axios.post(
      'https://api.mexc.com/api/v3/order',
      {
        symbol: symbol,
        side: side.toUpperCase(),
        type: 'MARKET',
        quantity: qty
      },
      {
        headers: {
          'X-MEXC-APIKEY': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      error: error.response ? error.response.data : error.message
    });
  }
}
