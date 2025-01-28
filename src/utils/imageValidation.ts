import { validateUrl, sanitizeInput } from './validation'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' }
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { isValid: false, error: 'File size exceeds 5MB limit' }
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and SVG files are allowed' }
  }

  return { isValid: true }
}

export function validateDataUrl(dataUrl: string): { isValid: boolean; error?: string } {
  if (!dataUrl) {
    return { isValid: false, error: 'No data URL provided' }
  }

  const sanitizedUrl = sanitizeInput(dataUrl)
  if (!sanitizedUrl.startsWith('data:image/')) {
    return { isValid: false, error: 'Invalid data URL format' }
  }

  const [header] = sanitizedUrl.split(',')
  const imageType = header.split(';')[0].split(':')[1]
  if (!ALLOWED_IMAGE_TYPES.includes(imageType)) {
    return { isValid: false, error: 'Invalid image type in data URL' }
  }

  return { isValid: true }
}

export function validateAvatarUrl(url: string): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: 'No URL provided' }
  }

  const sanitizedUrl = sanitizeInput(url)
  if (!validateUrl(sanitizedUrl)) {
    return { isValid: false, error: 'Invalid URL format' }
  }

  return { isValid: true }
}
