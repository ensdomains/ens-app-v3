import { IS_DEV_ENVIRONMENT } from '@app/utils/constants'

export const validateBanner = (url?: string): string | boolean => {
  if (!url) return 'Header URL is required'

  try {
    const urlObj = new URL(url)

    if (!IS_DEV_ENVIRONMENT && urlObj.protocol !== 'https:') {
      return 'Header URL must use HTTPS protocol'
    }

    // Check for numeric IP addresses (IPv4 and IPv6)
    const { hostname } = urlObj

    // IPv4 pattern: dotted decimal, octal, hexadecimal formats
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$|^0x[0-9a-fA-F]+$|^0[0-7]+$/
    // IPv6 pattern: standard and compressed formats
    const ipv6Pattern =
      /^\[?([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\]?$|^\[?::([0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}\]?$|^\[?([0-9a-fA-F]{0,4}:){1,7}:\]?$/

    if (ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname)) {
      return 'Header URL must use a domain name, not a numeric IP address'
    }

    // if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname)) {
    //   return 'Header URL must point to a valid image file (.jpg, .jpeg, .png, .gif, .webp, .svg)'
    // }

    return true
  } catch {
    return 'Header URL must be a valid URL'
  }
}

export const isValidBanner = (s: string) => !!s && validateBanner(s) === true
