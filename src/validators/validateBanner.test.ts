import { describe, expect, it } from 'vitest'

import { validateBanner, isValidBanner } from './validateBanner'

describe('validateBanner', () => {
  it('should return true for valid HTTPS image URLs', () => {
    const result = validateBanner('https://example.com/image.jpg')
    expect(result).toBe(true)
  })

  it('should return true for empty or undefined URL', () => {
    expect(validateBanner('')).toBe(true)
    expect(validateBanner(undefined)).toBe(true)
  })

  it('should return error for HTTP URLs', () => {
    const result = validateBanner('http://example.com/image.jpg')
    expect(result).toBe('Banner URL must use HTTPS protocol')
  })

  it('should return error for invalid URLs', () => {
    const result = validateBanner('not-a-url')
    expect(result).toBe('Banner URL must be a valid URL')
  })

  it('should return error for non-image file extensions', () => {
    const result = validateBanner('https://example.com/document.pdf')
    expect(result).toBe('Banner URL must point to a valid image file (.jpg, .jpeg, .png, .gif, .webp, .svg)')
  })

  it('should accept various image file extensions', () => {
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    extensions.forEach(ext => {
      const result = validateBanner(`https://example.com/image${ext}`)
      expect(result).toBe(true)
    })
  })

  it('should be case insensitive for file extensions', () => {
    const result = validateBanner('https://example.com/image.JPG')
    expect(result).toBe(true)
  })

  it('should return error for JavaScript URLs', () => {
    const result = validateBanner('javascript:alert("hello")')
    expect(result).toBe('Banner URL must use HTTPS protocol')
  })

  it('should accept image URLs with query parameters', () => {
    const result = validateBanner('https://example.com/image.jpg?width=500&height=300')
    expect(result).toBe(true)
  })
})

describe('isValidBanner', () => {
  it('should return true for valid HTTPS image URLs', () => {
    expect(isValidBanner('https://example.com/image.jpg')).toBe(true)
    expect(isValidBanner('https://example.com/image.png')).toBe(true)
    expect(isValidBanner('https://example.com/image.gif')).toBe(true)
  })

  it('should return false for empty or undefined URL', () => {
    expect(isValidBanner('')).toBe(false)
    expect(isValidBanner(undefined as any)).toBe(false)
  })

  it('should return false for HTTP URLs', () => {
    expect(isValidBanner('http://example.com/image.jpg')).toBe(false)
  })

  it('should return false for invalid URLs', () => {
    expect(isValidBanner('not-a-url')).toBe(false)
  })

  it('should return false for non-image file extensions', () => {
    expect(isValidBanner('https://example.com/document.pdf')).toBe(false)
    expect(isValidBanner('https://example.com/video.mp4')).toBe(false)
  })

  it('should return false for JavaScript URLs', () => {
    expect(isValidBanner('javascript:alert("hello")')).toBe(false)
  })

  it('should return true for image URLs with query parameters', () => {
    expect(isValidBanner('https://example.com/image.jpg?width=500&height=300')).toBe(true)
  })

  it('should be case insensitive for file extensions', () => {
    expect(isValidBanner('https://example.com/image.JPG')).toBe(true)
    expect(isValidBanner('https://example.com/image.PNG')).toBe(true)
  })
})