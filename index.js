const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/', async (req, res) => {
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
    res.status(500).json({ success: false, error: error.response ? error.response.data : error.message });
  }
});

app.get('/', (req, res) => {
  res.send('MEXC Proxy is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
