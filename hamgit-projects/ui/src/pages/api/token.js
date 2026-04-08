import jwt from 'jsonwebtoken'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const SUPABASE_JWT_SECRET = process.env.NEXT_PUBLIC_SUPABASE_SECRET_JWT

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { accessToken } = req.body

  if (!accessToken) {
    return res.status(400).json({ error: 'Missing accessToken' })
  }

  try {
    const response = await fetch(`${publicRuntimeConfig.API_URL}/users/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) return res.status(401).json({ error: 'Invalid access token' })

    const user = await response.json()

    const payload = {
      sub: String(user.id),
      role: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }

    const token = jwt.sign(payload, SUPABASE_JWT_SECRET, {
      issuer: 'real-time-chat',
      audience: 'authenticated',
    })

    return res.status(200).json({ token })
  } catch (error) {
    console.error('JWT generation error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
