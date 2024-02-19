import { describe, expect, it } from 'vitest'

import { validateUrl } from './validateUrl'

describe('validateUrl', () => {
  it('should return true if url starts with "http://"', () => {
    const result = validateUrl('http://www.example.com')
    expect(result).toBe(true)
  })

  it('should return true if url starts with "https://"', () => {
    const result = validateUrl('https://www.example.com')
    expect(result).toBe(true)
  })

  it('should return an error message if url does not start with "http://" or "https://"', () => {
    const result = validateUrl('ftp://www.example.com')
    expect(result).toBe("URL must start with 'http://' or 'https://'")
  })

  it('should return true if url is empty', () => {
    const result = validateUrl('')
    expect(result).toBe(true)
  })

  it('should return an error message if url contains JavaScript code', () => {
    const result = validateUrl('javascript:alert("hello")')
    expect(result).toBe("URL must start with 'http://' or 'https://'")
  })
})
