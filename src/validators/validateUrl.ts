import { validateUrl as validateUrlUtil, sanitizeInput } from '../utils/validation'

export const validateUrl = (url?: string): string | boolean => {
  if (!url) return true
  
  const sanitizedUrl = sanitizeInput(url)
  if (!validateUrlUtil(sanitizedUrl)) {
    return 'Invalid URL format. Must be a valid HTTP/HTTPS URL'
  }

  // Block javascript: URLs and other potentially dangerous protocols
  if (/^(javascript|data|vbscript|file):/i.test(sanitizedUrl)) {
    return 'URL contains potentially unsafe protocol'
  }

  return true
}
