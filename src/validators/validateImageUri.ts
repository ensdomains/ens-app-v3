const ACCEPTED_URI_PROTOCOLS = [
  'https:',
  'ipfs:',
  'data:',
  'eip155:',
  ...(process.env.NODE_ENV === 'development' ? ['http:'] : []),
]

export const validateImageUri = (url?: string): string | boolean => {
  if (!url) return 'Image URL is required'

  try {
    const urlObj = new URL(url)

    if (!ACCEPTED_URI_PROTOCOLS.includes(urlObj.protocol)) {
      return 'Image URL must use HTTPS protocol'
    }

    // Check for numeric IP addresses (IPv4 and IPv6)
    const { hostname } = urlObj

    // IPv4 dotted-decimal pattern
    const ipv4DottedPattern = /^(\d{1,3}\.){3}\d{1,3}$/
    // IPv4 hex pattern (e.g., 0x7f000001)
    const ipv4HexPattern = /^0x[0-9a-fA-F]+$/
    // IPv4 octal pattern (e.g., 0177)
    const ipv4OctalPattern = /^0[0-7]+$/
    // IPv6 pattern: standard and compressed formats
    const ipv6Pattern =
      /^\[?([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\]?$|^\[?::([0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}\]?$|^\[?([0-9a-fA-F]{0,4}:){1,7}:\]?$/

    // Check dotted-decimal IPv4 with proper octet validation
    if (ipv4DottedPattern.test(hostname)) {
      const octets = hostname.split('.').map(Number)
      // Validate each octet is 0-255
      if (octets.every((octet) => octet >= 0 && octet <= 255)) {
        return 'Image URL must use a domain name, not a numeric IP address'
      }
      // Invalid IP format (e.g., 999.999.999.999), might be a domain - let URL constructor handle it
    } else if (ipv4HexPattern.test(hostname) || ipv4OctalPattern.test(hostname)) {
      return 'Image URL must use a domain name, not a numeric IP address'
    } else if (ipv6Pattern.test(hostname)) {
      return 'Image URL must use a domain name, not a numeric IP address'
    }

    return true
  } catch (error) {
    // Log error for debugging but don't expose internal details to user
    if (process.env.NODE_ENV === 'development') {
      console.error('URL validation error:', error)
    }
    return 'Image URL must be a valid URL'
  }
}

export const isValidImageUri = (s: string) => !!s && validateImageUri(s) === true
