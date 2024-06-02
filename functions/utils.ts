export const isFarcasterRequest = (request: Request) => {
  const userAgent = request.headers.get('user-agent')?.toLowerCase()
  return userAgent?.startsWith('fcbot/')
}

export const BASE_OG_IMAGE_URL = 'https://ens-og-image-dev.ens-cf.workers.dev'
