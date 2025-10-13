const ACCEPTED_URI_PROTOCOLS = ['https:', 'ipfs:', 'data:', 'eip155:']

export const validateImageUri = (url?: string): string | boolean => {
  if (!url) return 'Image URL is required'

  try {
    const urlObj = new URL(url)

    if (!ACCEPTED_URI_PROTOCOLS.includes(urlObj.protocol)) {
      return 'Image URL must use HTTPS protocol'
    }

    // Check for numeric IP addresses (IPv4 and IPv6)
    const { hostname } = urlObj

    // IPv4 pattern: dotted decimal, octal, hexadecimal formats
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$|^0x[0-9a-fA-F]+$|^0[0-7]+$/
    // IPv6 pattern: standard and compressed formats
    const ipv6Pattern =
      /^\[?([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\]?$|^\[?::([0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}\]?$|^\[?([0-9a-fA-F]{0,4}:){1,7}:\]?$/

    if (ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname)) {
      return 'Image URL must use a domain name, not a numeric IP address'
    }

    return true
  } catch {
    return 'Image URL must be a valid URL'
  }
}

export const isValidImageUri = (s: string) => !!s && validateImageUri(s) === true
