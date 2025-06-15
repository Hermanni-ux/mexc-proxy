import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const apiKey = process.env.MEXC_KEY;
  const apiSecret = process.env.MEXC_SECRET;

  const { symbol, side, entry } = req.body;

  // Varmista että qty on numero
  const qty = parseFloat(entry).toFixed(5);

  // 1️⃣ Luo aikaleima (timestamp)
  const timestamp = Date.now();

  // 2️⃣ Luo querystring — huom! järjestys tärkeä!
  const params = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${qty}&timestamp=${timestamp}`;

  // 3️⃣ Tee signature HMAC SHA256
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(params)
    .digest('hex');

  // 4️⃣ Lisää signature queryyn
  const finalParams = `${params}&signature=${signature}`;

  try {
    const response = await fetch(`https://api.mexc.com/api/v3/order?${finalParams}`, {
      method: 'POST',
      headers: {
        'X-MEXC-APIKEY': apiKey,
      }
    });

    const data = await response.json();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
