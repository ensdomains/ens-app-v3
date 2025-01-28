import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateCsrfToken } from '@/utils/security'
import rateLimit from './middleware/rateLimit'

const rateLimiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
})

export async function middleware(request: NextRequest) {
  const rateLimitResponse = await rateLimiter(request)
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse
  }

  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    const csrfToken = request.headers.get('x-csrf-token')
    const cookieToken = request.cookies.get('csrfToken')?.value

    if (!validateCsrfToken(cookieToken, csrfToken)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
