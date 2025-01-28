import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateCsrfToken } from '@/utils/security'

export function middleware(request: NextRequest) {
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
