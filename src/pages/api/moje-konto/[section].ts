import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';

interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  line_items: OrderItem[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { section } = req.query;

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) {
    console.error('Unauthorized: No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  let apiEndpoint: string;

  switch (section) {
    case 'moje-zamowienia':
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
      data = (response.data as Order[]).flatMap((order) =>
        order.line_items.map((item) => ({
          id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))
      );
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching section data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
