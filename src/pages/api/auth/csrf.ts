import { NextApiRequest, NextApiResponse } from 'next'
import { generateCsrfToken } from '@/utils/security'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = generateCsrfToken()
  res.setHeader(
    'Set-Cookie',
    `csrfToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
  )
  return res.status(200).json({ token })
}
