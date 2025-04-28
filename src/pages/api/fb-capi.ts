// pages/api/fb-capi.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

function sha256(val: string) {
  return crypto
    .createHash('sha256')
    .update(val.trim().toLowerCase())
    .digest('hex')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const pixelId     = process.env.FB_PIXEL_ID
  const accessToken = process.env.FB_ACCESS_TOKEN
  if (!pixelId || !accessToken) {
    return res.status(500).json({ error: 'Missing FB credentials' })
  }

  const { eventName, eventId, customData, userData } = req.body

  const user_data: Record<string,string> = {}
  if (userData?.email) user_data.em = sha256(userData.email)
  if (userData?.phone) user_data.ph = sha256(userData.phone)
  if (req.headers['x-forwarded-for']) {
    user_data.client_ip_address = (req.headers['x-forwarded-for'] as string).split(',')[0]
  } else if (req.socket.remoteAddress) {
    user_data.client_ip_address = req.socket.remoteAddress!
  }
  if (req.headers['user-agent']) {
    user_data.client_user_agent = req.headers['user-agent'] as string
  }

  const fbUrl = `https://graph.facebook.com/v16.0/${pixelId}/events?access_token=${accessToken}`

  const payload = {
    data: [{
      event_name:       eventName,
      event_time:       Math.floor(Date.now() / 1000),
      event_id:         eventId,
      action_source:    'website',
      event_source_url: req.headers.referer,
      user_data,
      custom_data:      customData || {}
    }]
  }

  try {
    const fbRes = await fetch(fbUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await fbRes.json()
    if (!fbRes.ok) {
      console.error('❌ FB CAPI rejected:', json)
      return res.status(fbRes.status).json(json)
    }
    return res.status(200).json(json)
  } catch (err) {
    console.error('CAPI error', err)
    return res.status(500).json({ error: 'Facebook CAPI request failed' })
  }
}
