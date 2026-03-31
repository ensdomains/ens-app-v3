import { UrlObject } from 'url'

const stringToUrlObject = (url: string): UrlObject => {
  const _url = new URL(url, 'https://app.ens.domains')
  const query = _url.searchParams ? Object.fromEntries(_url.searchParams.entries()) : undefined
  return {
    pathname: _url.pathname,
    query,
  }
}

export const createUrlObject = (
  href: string | UrlObject,
  additionalQuery?: Record<string, string | undefined>,
): UrlObject => {
  const urlObject = typeof href === 'string' ? stringToUrlObject(href) : href
  if (!additionalQuery) return urlObject

  // Filter out undefined values from additionalQuery
  const filteredQuery = Object.fromEntries(
    Object.entries(additionalQuery).filter(([, value]) => value !== undefined),
  )

  if (Object.keys(filteredQuery).length === 0) return urlObject

  return {
    ...urlObject,
    query: { ...((urlObject.query as Record<string, any>) || {}), ...filteredQuery },
  }
}
