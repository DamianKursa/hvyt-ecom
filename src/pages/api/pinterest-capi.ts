// pages/api/pinterest-capi.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

const AD_ACCOUNT_ID = process.env.PINTEREST_AD_ACCOUNT_ID!
const TOKEN         = process.env.PINTEREST_ACCESS_TOKEN!

function sha256(str: string): string {
  return crypto
    .createHash('sha256')
    .update(str.trim().toLowerCase(), 'utf8')
    .digest('hex')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const {
    eventName,
    items,
    value,
    currency,
    order_id,
    click_id,
    email,
    firstName,
    lastName,
    phone,
    postalCode,
    city,
    country,
  } = req.body

  if (!eventName || !items || !value || !currency) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // 1) build user_data with only the keys Pinterest will accept
  const client_ip_address = (
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    ''
  ).split(',')[0].trim()
  const client_user_agent = String(req.headers['user-agent'] || '')

  const user_data: Record<string, any> = {
    client_ip_address,
    client_user_agent,
    ...(click_id   && { click_id }),
    ...(email      && { em: [sha256(email)] }),
    ...(firstName  && { fn: [sha256(firstName)] }),
    ...(lastName   && { ln: [sha256(lastName)] }),
    ...(phone      && { ph: [sha256(phone.replace(/\D/g, ''))] }),
    ...(postalCode && { zp: [sha256(postalCode)] }),
    ...(city       && { ct: [sha256(city)] }),
    ...(country    && { country: [sha256(country)] }),
  }

  // 2) build the contents array
  const contents = (items as any[]).map(i => ({
    id:         String(i.item_id),
    item_price: String(Number(i.price).toFixed(2)),
    quantity:   Number(i.quantity),
  }))

  // 3) custom_data
  const custom_data = {
    currency,
    value:       String(Number(value).toFixed(2)),
    contents,
    order_id,
    num_items:   contents.reduce((sum, c) => sum + c.quantity, 0),
    content_ids: contents.map(c => c.id),
  }

  // 4) payload for the /events endpoint
  const payload = {
    data: [
      {
        event_name:       eventName,
        action_source:    'web',
        event_time:       Math.floor(Date.now() / 1000),
        event_id:         order_id?.toString() || uuidv4(),
        event_source_url: req.headers.referer || undefined,
        user_data,
        custom_data,
      },
    ],
  }

  try {
    const apiRes = await fetch(
      `https://api.pinterest.com/v5/ad_accounts/${AD_ACCOUNT_ID}/events`,
      {
        method:  'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    const text = await apiRes.text()
    let result: any
    try {
      result = JSON.parse(text)
    } catch {
      result = text
    }

    if (!apiRes.ok) {
      console.error('Pinterest CAPI failed:', apiRes.status, result)
      return res.status(apiRes.status).json({ error: result })
    }

    return res.status(200).json({ success: true, result })
  } catch (err: any) {
    console.error('Pinterest CAPI error:', err)
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}
