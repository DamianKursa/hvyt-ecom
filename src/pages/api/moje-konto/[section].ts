import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { section } = req.query;

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  let apiEndpoint: string;

  switch (section) {
    case 'moje-zamowienia':
      apiEndpoint = 'orders';
      break;
    case 'kupione-produkty':
      apiEndpoint = 'orders';
      break;
    case 'moje-dane':
    case 'moje-adresy':
    case 'dane-do-faktury':
      apiEndpoint = 'customers/me';
      break;
    default:
      return res.status(400).json({ error: 'Invalid section' });
  }

  try {
    const url = `${process.env.WORDPRESS_API_URL}/wp-json/wc/v3/${apiEndpoint}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let data = response.data;

    if (section === 'kupione-produkty') {
      const products = [];
      for (const order of data) {
        for (const item of order.line_items) {
          products.push({
            id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          });
        }
      }
      data = products;
    } else if (section === 'moje-adresy') {
      data = {
        billing: response.data.billing,
        shipping: response.data.shipping,
      };
    } else if (section === 'dane-do-faktury') {
      data = response.data.billing;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching section data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
