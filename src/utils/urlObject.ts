import { UrlObject } from 'url'

const stringToUrlObject = (url: string): UrlObject => {
  const _url = new URL(url, 'https://app.ens.domains')
  const query = _url.searchParams ? Object.fromEntries(_url.searchParams.entries()) : undefined
  return {
    pathname: _url.pathname,
    query,
  }
}

/**
 * Normalizes href to UrlObject format and optionally adds query parameters.
 * Undefined values in additionalQuery are automatically filtered out.
 *
 * @param href - Either a string pathname or existing UrlObject
 * @param additionalQuery - Additional query parameters to merge (undefined values are filtered)
 * @returns UrlObject with merged query parameters
 *
 * @example
 * // Convert string to UrlObject
 * createUrlObject('/profile/vitalik.eth')
 * // => { pathname: '/profile/vitalik.eth' }
 *
 * @example
 * // Add query parameters
 * createUrlObject('/profile/vitalik.eth', { referrer: 'partner123' })
 * // => { pathname: '/profile/vitalik.eth', query: { referrer: 'partner123' } }
 *
 * @example
 * // Merge with existing query
 * createUrlObject({ pathname: '/profile', query: { tab: 'records' } }, { referrer: 'partner' })
 * // => { pathname: '/profile', query: { tab: 'records', referrer: 'partner' } }
 *
 * @example
 * // Undefined values are filtered out
 * createUrlObject('/profile', { referrer: undefined, from: '/' })
 * // => { pathname: '/profile', query: { from: '/' } }
 */
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
