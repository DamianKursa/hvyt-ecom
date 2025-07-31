import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse, serialize } from 'cookie';

const WP_API_URL =
    process.env.WORDPRESS_WP_API_URL ||
    (process.env.NEXT_PUBLIC_WP_REST_API
        ? process.env.NEXT_PUBLIC_WP_REST_API.replace(/\/wp-json\/wp\/v2$/, '')
        : undefined) ||
    process.env.WORDPRESS_API_URL!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse auth token from cookie
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        await axios.post(
            `${WP_API_URL}/wp-json/custom/v1/delete-account`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Clear the auth cookie (same as logout)
        res.setHeader(
            'Set-Cookie',
            serialize('token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                expires: new Date(0),
            })
        );

        return res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({ error: 'Failed to delete account' });
    }
}
