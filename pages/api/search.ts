import type { NextApiRequest, NextApiResponse } from 'next';

const API_TOKEN = process.env.TRAVELPAYOUTS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from or to parameter' });
  }

  try {
    const url = `https://api.travelpayouts.com/v2/prices/latest?origin=${from}&destination=${to}&currency=gbp&token=${API_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data?.data || !Array.isArray(data.data)) {
      return res.status(500).json({ error: 'Invalid response from API' });
    }

    const results = data.data.map((item: any) => ({
      cityFrom: from,
      cityTo: to,
      price: item.value,
      dTime: new Date(item.depart_date).getTime() / 1000,
      deep_link: `https://www.aviasales.com/search/${from}${item.depart_date.replace(/-/g, '')}${to}1`,
    }));

    res.status(200).json({ results });
  } catch (err) {
    console.error('API fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
}
