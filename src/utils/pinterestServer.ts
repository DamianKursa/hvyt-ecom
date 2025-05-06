// src/utils/pinterestServer.ts
import { v4 as uuidv4 } from 'uuid'

const accountId = process.env.PINTEREST_AD_ACCOUNT_ID!
const token     = process.env.PINTEREST_ACCESS_TOKEN!

export async function trackPinterestServer(params: {
  event_name:        string
  action_source?:    'web' | 'app_android' | 'app_ios' | 'offline'
  event_time?:       number
  event_id?:         string
  event_source_url?: string
  opt_out?:          boolean
  partner_name?:     string
  user_data?:        Record<string, any>
  custom_data?:      Record<string, any>
  external_id?:      string[]      // hashed IDs, if you have them
}) {
  const {
    event_name,
    action_source    = 'web',
    event_time       = Math.floor(Date.now()/1000),
    event_id         = uuidv4(),
    event_source_url,
    opt_out          = false,
    partner_name     = 'direct',
    user_data,
    custom_data,
    external_id,
  } = params

  const url = `https://api.pinterest.com/v5/ad_accounts/${accountId}/events`

  // note: this endpoint wants { data: [ { … } ] }
  const payload: any = {
    data: [
      {
        event_name,
        action_source,
        event_time,
        event_id,
        ...(event_source_url && { event_source_url }),
        opt_out,
        partner_name,
        ...(user_data   && { user_data }),
        ...(custom_data && { custom_data }),
        ...(external_id && { external_id }),
      },
    ],
  }

  const res = await fetch(url, {
    method:  'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pinterest CAPI error ${res.status}: ${text}`)
  }
  return res.json()
}
