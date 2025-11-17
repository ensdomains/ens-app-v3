import { describe, expect, it } from 'vitest'

import { validateImageUri, isValidImageUri } from './validateImageUri'

describe('validateImageUri', () => {
  it('should return true for valid HTTPS image URLs', () => {
    const result = validateImageUri('https://example.com/image.jpg')
    expect(result).toBe(true)
  })

  it('should return error for empty or undefined URL', () => {
    expect(validateImageUri('')).toBe('Image URL is required')
    expect(validateImageUri(undefined)).toBe('Image URL is required')
  })

  it('should return error for HTTP URLs', () => {
    const result = validateImageUri('http://example.com/image.jpg')
    expect(result).toBe('Image URL must use HTTPS protocol')
  })

  it('should accept URLs with credentials', () => {
    const result = validateImageUri('https://user:pass@example.com/image.jpg')
    expect(result).toBe(true)
  })  

  it('should return error for invalid URLs', () => {
    const result = validateImageUri('not-a-url')
    expect(result).toBe('Image URL must be a valid URL')
  })


  it('should return true for URLs without specific image file extensions', () => {
    const result = validateImageUri('https://example.com/document.pdf')
    expect(result).toBe(true) // File extension check is commented out in the code
  })

  it('should return error for numeric IPv4 addresses', () => {
    const result = validateImageUri('https://127.0.0.1/image.jpg')
    expect(result).toBe('Image URL must use a domain name, not a numeric IP address')
  })

  it('should return error for single numeric addresses', () => {
    const result = validateImageUri('https://2130706433/image.jpg')
    expect(result).toBe('Image URL must use a domain name, not a numeric IP address')
  })

  it('should return error for hex addresses', () => {
    const result = validateImageUri('https://0x7f000001/image.jpg')
    expect(result).toBe('Image URL must use a domain name, not a numeric IP address')
  })

  it('should return error for octal addresses', () => {
    const result = validateImageUri('https://0177/image.jpg')
    expect(result).toBe('Image URL must use a domain name, not a numeric IP address')
  })

  it('should return error for IPv6 loopback addresses', () => {
    const result = validateImageUri('https://[::1]/image.jpg')
    expect(result).toBe('Image URL must use a domain name, not a numeric IP address')
  })

  it('should accept various image file extensions', () => {
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    extensions.forEach(ext => {
      const result = validateImageUri(`https://example.com/image${ext}`)
      expect(result).toBe(true)
    })
  })

  it('should be case insensitive for file extensions', () => {
    const result = validateImageUri('https://example.com/image.JPG')
    expect(result).toBe(true)
  })

  it('should return error for JavaScript URLs', () => {
    const result = validateImageUri('javascript:alert("hello")')
    expect(result).toBe('Image URL must use HTTPS protocol')
  })

  it('should accept image URLs with query parameters', () => {
    const result = validateImageUri('https://example.com/image.jpg?width=500&height=300')
    expect(result).toBe(true)
  })
})

describe('isValidImageUri', () => {
  it('should return true for valid HTTPS image URLs', () => {
    expect(isValidImageUri('https://example.com/image.jpg')).toBe(true)
    expect(isValidImageUri('https://example.com/image.png')).toBe(true)
    expect(isValidImageUri('https://example.com/image.gif')).toBe(true)
  })

  it('should return false for empty or undefined URL', () => {
    expect(isValidImageUri('')).toBe(false)
    expect(isValidImageUri(undefined as any)).toBe(false)
  })

  it('should return false for HTTP URLs', () => {
    expect(isValidImageUri('http://example.com/image.jpg')).toBe(false)
  })

  it('should return false for invalid URLs', () => {
    expect(isValidImageUri('not-a-url')).toBe(false)
  })

  it('should return false for JavaScript URLs', () => {
    expect(isValidImageUri('javascript:alert("hello")')).toBe(false)
  })

  it('should return true for image URLs with query parameters', () => {
    expect(isValidImageUri('https://example.com/image.jpg?width=500&height=300')).toBe(true)
  })

  it('should be case insensitive for file extensions', () => {
    expect(isValidImageUri('https://example.com/image.JPG')).toBe(true)
    expect(isValidImageUri('https://example.com/image.PNG')).toBe(true)
  })
})

