export function validateUrl(url: string): boolean | string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true
  }
  return "Error: URL must start with 'http://' or 'https://'"
}
