export const validateUrl = (url?: string): string | boolean => {
  if (!url) return true
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true
  }
  return "URL must start with 'http://' or 'https://'"
}
