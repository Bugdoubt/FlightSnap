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

    const results = data.data.map((item: any) => {
      const fromCode = from.toString().toUpperCase();
      const toCode = to.toString().toUpperCase();
      const departDate = item.depart_date.replace(/-/g, '');
      const rawSearch = `avia/search/${fromCode}${departDate}${toCode}1`;
      const encodedSearch = encodeURIComponent(rawSearch);

      const deepLink = `https://tp.media/r?marker=622901&trs=264554&searchUrl=${encodedSearch}&locale=en&currency=gbp`;

      return {
        cityFrom: fromCode,
        cityTo: toCode,
        price: item.value,
        dTime: new Date(item.depart_date).getTime() / 1000,
        deep_link: deepLink,
      };
    });

    res.status(200).json({ results });
  } catch (err) {
    console.error('API fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
}
