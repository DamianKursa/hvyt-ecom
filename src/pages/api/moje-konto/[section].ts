import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';
import { Product } from '@/utils/functions/interfaces'; // Use your defined Product interface

interface OrderItem {
  product_id: string;
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
    // Validate the token with the WordPress API
    const validateResponse = await axios.post(
      `${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token/validate`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (validateResponse.data.code !== 'jwt_auth_valid_token') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Decode the token to extract the user ID
    const decodedToken = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
    ) as { data: { user: { id: number } } };

    const customerId = decodedToken?.data?.user?.id;

    if (!customerId) {
      return res
        .status(401)
        .json({ error: 'Unauthorized: Customer ID not found in token' });
    }

    // Add the customer ID filter for orders or products
    const url = `${process.env.WORDPRESS_API_URL}/wp-json/wc/v3/${apiEndpoint}`;
    const response = await axios.get<Order[]>(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: section === 'moje-zamowienia' || section === 'kupione-produkty'
        ? { customer: customerId } // Filter orders by customer ID
        : undefined,
    });

    let data = response.data;

    if (section === 'kupione-produkty') {
      // Transform line items into Product[]
      const products: Product[] = (data as Order[]).flatMap((order) =>
        order.line_items.map((item) => ({
          id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          description: '', // Empty as orders do not include descriptions
          image: '', // No images provided in orders, leave as empty
          attributes: [], // Empty as orders do not include attributes
        }))
      );
      res.status(200).json(products);
      return;
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching section data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
