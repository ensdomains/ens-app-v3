export const validateBanner = (url?: string): string | boolean => {
  if (!url) return true

  try {
    const urlObj = new URL(url)

    if (urlObj.protocol !== 'https:') {
      return 'Banner URL must use HTTPS protocol'
    }

    if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname)) {
      return 'Banner URL must point to a valid image file (.jpg, .jpeg, .png, .gif, .webp, .svg)'
    }

    return true
  } catch {
    return 'Banner URL must be a valid URL'
  }
}

export const isValidBanner = (s: string) => !!s && validateBanner(s) === true
