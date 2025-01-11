import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    const wordpressApiUrl = process.env.WORDPRESS_API_URL;
    if (!wordpressApiUrl) {
        return res.status(500).json({ error: 'Internal server error: Missing WordPress API URL.' });
    }

    try {
        if (req.method === 'GET') {
            const response = await axios.get(`${wordpressApiUrl}/wp-json/custom-api/v1/user-addresses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.status(200).json(response.data);
        }

        if (req.method === 'POST') {
            const { action, address, addresses } = req.body;

            if (action === 'add') {
                const formattedAddress = {
                    ...address,
                    address_line_2: `${address.buildingNumber || ''}${
                        address.apartmentNumber ? `/${address.apartmentNumber}` : ''
                    }`,
                };

                const response = await axios.post(
                    `${wordpressApiUrl}/wp-json/custom-api/v1/user-addresses/add`,
                    { address: formattedAddress },
                    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                );
                return res.status(200).json(response.data);
            }

            if (action === 'update') {
                const formattedAddresses = addresses.map((addr: any) => ({
                    ...addr,
                    address_line_2: `${addr.buildingNumber || ''}${
                        addr.apartmentNumber ? `/${addr.apartmentNumber}` : ''
                    }`,
                }));

                const response = await axios.post(
                    `${wordpressApiUrl}/wp-json/custom-api/v1/user-addresses/update`,
                    { addresses: formattedAddresses },
                    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                );
                return res.status(200).json(response.data);
            }

            return res.status(400).json({ error: 'Invalid action specified.' });
        }

        return res.status(405).json({ error: 'Method not allowed.' });
    } catch (error: any) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
