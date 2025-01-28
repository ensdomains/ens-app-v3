import { NextRequest, NextResponse } from 'next/server'
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const cache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return async function handler(request: NextRequest) {
    const ip = request.ip ?? '127.0.0.1'
    const tokenCount = (cache.get(ip) as number[]) || [0]
    if (tokenCount[0] === 0) {
      cache.set(ip, [1])
    } else {
      tokenCount[0] += 1
      cache.set(ip, tokenCount)
    }

    const currentUsage = tokenCount[0]
    const maxRequests = 100 // Maximum requests per minute

    if (currentUsage >= maxRequests) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60',
        },
      })
    }

    return NextResponse.next()
  }
}
