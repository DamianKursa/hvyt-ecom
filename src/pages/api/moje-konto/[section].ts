import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';
import { Product } from '@/utils/functions/interfaces';

interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: string;
  lang?: string;
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
      apiEndpoint = 'custom-api/v1/user-data';
      break;
    case 'moje-adresy':
    case 'dane-do-faktury':
      apiEndpoint = 'customers/me';
      break;
    default:
      return res.status(400).json({ error: 'Invalid section' });
  }

  try {
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

    const decodedToken = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
    ) as { data: { user: { id: number } } };

    const customerId = decodedToken?.data?.user?.id;

    if (!customerId && section !== 'moje-dane') {
      return res.status(401).json({ error: 'Unauthorized: Customer ID not found in token' });
    }

    if (section === 'moje-dane') {
      if (req.method === 'GET') {
        try {
          // Fetch base user data and WooCommerce customer profile in parallel.
          // Phone is commonly stored as billing.phone in WooCommerce.
          const [userRes, wcRes] = await Promise.all([
            axios.get(`${process.env.WORDPRESS_API_URL}/wp-json/${apiEndpoint}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios
              .get(`${process.env.WORDPRESS_API_URL}/wp-json/wc/v3/customers/me`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .catch(() => ({ data: null })),
          ]);

          const userData: any = userRes.data || {};
          const wcCustomer: any = wcRes?.data || {};
          
          const firstName =
            userData.firstName ?? userData.first_name ?? wcCustomer.first_name ?? '';
          const lastName =
            userData.lastName ?? userData.last_name ?? wcCustomer.last_name ?? '';
          const email = userData.email ?? wcCustomer.email ?? '';

          const phone =
            (typeof userData?.phone === 'string' && userData.phone.trim() !== ''
              ? userData.phone
              : undefined) ??
            wcCustomer?.billing?.phone ??
            userData?.billing?.phone ??
            userData?.billing_phone ??
            userData?.meta?.billing_phone ??
            userData?.phone_number ??
            '';

          return res.status(200).json({
            id: userData.id || wcCustomer.id || customerId,
            firstName,
            lastName,
            email,
            phone,
          });
        } catch (error: any) {
          console.error('Error fetching user data:', error.response?.data || error.message);
          return res.status(500).json({ error: 'Failed to fetch user data' });
        }
      } else if (req.method === 'POST') {
        const { firstName, lastName, email, phone } = req.body;

        if (!firstName || !lastName || !email) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
          const updateResponse = await axios.put(
            `${process.env.WORDPRESS_API_URL}/wp-json/${apiEndpoint}/${customerId}`, // Use decoded ID
            { firstName, lastName, email, phone },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (updateResponse.status === 200) {
            return res.status(200).json({ message: 'User updated successfully' });
          } else {
            return res.status(500).json({ error: 'Failed to update user' });
          }
        } catch (error: any) {
          console.error('Error updating user:', error.response?.data || error.message);
          return res.status(500).json({ error: 'Error updating user data' });
        }
      } else {
        return res.status(405).json({ error: 'Method not allowed' });
      }
    }

    // Fetch data for other sections
    const response = await axios.get(`${process.env.WORDPRESS_API_URL}/wp-json/wc/v3/${apiEndpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      params:
        section === 'moje-zamowienia' || section === 'kupione-produkty'
          ? { customer: customerId }
          : undefined,
    });

    if (section === 'kupione-produkty') {
      const products: Product[] = await Promise.all(
        (response.data as Order[]).flatMap((order) =>
          order.line_items.map(async (item) => {
            let image = '/placeholder.jpg'; // Default placeholder image
            try {
              const productResponse = await axios.get(
                `${process.env.WORDPRESS_API_URL}/wp-json/wc/v3/products/${item.product_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              image = productResponse.data.images?.[0]?.src || image;
            } catch (error: any) {
              console.error('Error fetching product image:', error.response?.data || error.message);
            }

            return {
              id: item.product_id,
              name: item.name,
              slug: `product-${item.product_id}`,
              quantity: item.quantity,
              price: item.price,
              description: '',
              lang: item.lang || '',
              image,
              attributes: [],
              totalPrice: parseFloat(item.price) * item.quantity,
            };
          })
        )
      );
      return res.status(200).json(products);
    }

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching section data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
