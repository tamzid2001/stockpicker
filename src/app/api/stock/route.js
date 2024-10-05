import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { symbol } = req.query;
  const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-news?category=${symbol}&region=US`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data.items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching news data' });
  }
}