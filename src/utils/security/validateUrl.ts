/**
 * Validates URLs for security issues and deceptive patterns
 * Returns true if URL should be considered invalid/unsafe
 */
export const isDeceptiveUrl = (url: string | undefined): boolean => {
  if (!url) return false

  try {
    // 1. Block userinfo pattern (@ symbol abuse like https://user@evil.com)
    if (url.includes('@')) {
      return true
    }

    // 2. Block Unicode spaces and invisible characters that could hide @ or other deceptive patterns
    const suspiciousChars = [
      '\u2003', // EM SPACE
      '\u200B', // ZERO WIDTH SPACE
      '\u00A0', // NO-BREAK SPACE
      '\u2000', '\u2001', '\u2002', '\u2004', '\u2005', // Various Unicode spaces
      '\u2006', '\u2007', '\u2008', '\u2009', '\u200A',
      '\uFEFF', // ZERO WIDTH NO-BREAK SPACE
      '\u202E', // RIGHT-TO-LEFT OVERRIDE
      '\u202D', // LEFT-TO-RIGHT OVERRIDE
    ]

    if (suspiciousChars.some((char) => url.includes(char))) {
      return true
    }

    // 3. Block data: and javascript: URIs (XSS attempts)
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.startsWith('data:') || lowerUrl.startsWith('javascript:')) {
      return true
    }

    // 4. Block file:// protocol (local file access)
    if (lowerUrl.startsWith('file://')) {
      return true
    }

    // 5. Block URLs with null bytes and control characters
    if (url.includes('\0') || /[\x00-\x1F\x7F]/.test(url)) {
      return true
    }

    // 6. Block multiple slashes after protocol (parser confusion)
    if (url.match(/^https?:\/\/\/+/)) {
      return true
    }

    // Parse URL for additional checks
    const parsed = new URL(url)

    // 7. Check for punycode domains (potential homograph attacks)
    // xn-- prefix indicates punycode encoding
    if (parsed.hostname.startsWith('xn--')) {
      return true
    }

    // 8. Optional: Block common URL shorteners (uncomment if desired)
    // const urlShorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'short.link']
    // if (urlShorteners.includes(parsed.hostname.toLowerCase())) {
    //   return true
    // }

    // 9. Check for mixed scripts in domain (e.g., Latin + Cyrillic)
    // This helps detect homograph attacks
    const hasCyrillic = /[\u0400-\u04FF]/.test(parsed.hostname)
    const hasLatin = /[a-zA-Z]/.test(parsed.hostname)
    if (hasCyrillic && hasLatin) {
      return true
    }

    return false
  } catch {
    // If URL parsing fails, consider it invalid
    return true
  }
}

/**
 * Sanitizes URL for safe display
 * Returns a safe version of the URL or undefined if invalid
 */
export const getSafeUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined

  // If URL is deceptive, return undefined (don't make it clickable)
  if (isDeceptiveUrl(url)) {
    return undefined
  }

  // Ensure URL has a protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Don't add protocol to already invalid URLs
    return undefined
  }

  return url
}

/**
 * Get display text for a URL (removes protocol for cleaner display)
 */
export const getUrlDisplayText = (url: string | undefined): string => {
  if (!url) return ''

  try {
    const parsed = new URL(url)
    // Return hostname + path without protocol
    return `${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`
      .replace(/\/$/, '') // Remove trailing slash
  } catch {
    // If parsing fails, return the original URL
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}