import { describe, it, expect } from 'vitest'
import { isDeceptiveUrl, getSafeUrl, getUrlDisplayText } from './validateUrl'

describe('isDeceptiveUrl', () => {
  it('should return false for valid URLs', () => {
    expect(isDeceptiveUrl('https://google.com')).toBe(false)
    expect(isDeceptiveUrl('https://app.ens.domains')).toBe(false)
    expect(isDeceptiveUrl('http://example.com')).toBe(false)
  })

  it('should return true for URLs with @ symbol (userinfo)', () => {
    expect(isDeceptiveUrl('https://google.com@evil.com')).toBe(true)
    expect(isDeceptiveUrl('https://user@evil.com')).toBe(true)
    expect(isDeceptiveUrl('https://user:pass@evil.com')).toBe(true)
  })

  it('should return true for URLs with Unicode spaces', () => {
    // EM SPACE
    expect(isDeceptiveUrl('https://google.com\u2003@evil.com')).toBe(true)
    // ZERO WIDTH SPACE
    expect(isDeceptiveUrl('https://google.com\u200b@evil.com')).toBe(true)
    // NO-BREAK SPACE
    expect(isDeceptiveUrl('https://google.com\u00a0@evil.com')).toBe(true)
  })

  it('should return true for javascript: and data: URIs', () => {
    expect(isDeceptiveUrl('javascript:alert(1)')).toBe(true)
    expect(isDeceptiveUrl('Javascript:alert(1)')).toBe(true)
    expect(isDeceptiveUrl('data:text/html,<script>alert(1)</script>')).toBe(true)
    expect(isDeceptiveUrl('DATA:text/html,<h1>test</h1>')).toBe(true)
  })

  it('should return true for file:// protocol', () => {
    expect(isDeceptiveUrl('file:///etc/passwd')).toBe(true)
    expect(isDeceptiveUrl('FILE:///c:/windows/system.ini')).toBe(true)
  })

  it('should return true for URLs with null bytes', () => {
    expect(isDeceptiveUrl('https://example.com\0/evil')).toBe(true)
  })

  it('should return true for URLs with multiple slashes after protocol', () => {
    expect(isDeceptiveUrl('https:///evil.com')).toBe(true)
    expect(isDeceptiveUrl('http:////evil.com')).toBe(true)
  })

  it('should return true for punycode domains', () => {
    expect(isDeceptiveUrl('https://xn--e1afmkfd.xn--p1ai')).toBe(true)
    expect(isDeceptiveUrl('https://xn--80ak6aa92e.com')).toBe(true)
  })

  it('should return true for mixed Cyrillic and Latin characters', () => {
    // аррӏе.com (Cyrillic 'a' and Latin)
    expect(isDeceptiveUrl('https://аррӏе.com')).toBe(true)
  })

  it('should return true for invalid URLs', () => {
    expect(isDeceptiveUrl('not-a-url')).toBe(true)
    expect(isDeceptiveUrl('ftp://example.com')).toBe(true)
  })

  it('should handle undefined and empty strings', () => {
    expect(isDeceptiveUrl(undefined)).toBe(false)
    expect(isDeceptiveUrl('')).toBe(false)
  })
})

describe('getSafeUrl', () => {
  it('should return the URL if it is safe', () => {
    expect(getSafeUrl('https://google.com')).toBe('https://google.com')
    expect(getSafeUrl('http://example.com')).toBe('http://example.com')
  })

  it('should return undefined for deceptive URLs', () => {
    expect(getSafeUrl('https://google.com@evil.com')).toBeUndefined()
    expect(getSafeUrl('javascript:alert(1)')).toBeUndefined()
    expect(getSafeUrl('file:///etc/passwd')).toBeUndefined()
  })

  it('should return undefined for URLs without protocol', () => {
    expect(getSafeUrl('google.com')).toBeUndefined()
    expect(getSafeUrl('www.example.com')).toBeUndefined()
  })

  it('should handle undefined', () => {
    expect(getSafeUrl(undefined)).toBeUndefined()
  })
})

describe('getUrlDisplayText', () => {
  it('should return hostname and path without protocol', () => {
    expect(getUrlDisplayText('https://google.com')).toBe('google.com')
    expect(getUrlDisplayText('https://example.com/path')).toBe('example.com/path')
    expect(getUrlDisplayText('http://test.com/foo/bar')).toBe('test.com/foo/bar')
  })

  it('should remove trailing slashes', () => {
    expect(getUrlDisplayText('https://google.com/')).toBe('google.com')
    expect(getUrlDisplayText('https://example.com/path/')).toBe('example.com/path')
  })

  it('should handle invalid URLs gracefully', () => {
    expect(getUrlDisplayText('not-a-url')).toBe('not-a-url')
    expect(getUrlDisplayText('google.com')).toBe('google.com')
  })

  it('should handle undefined and empty strings', () => {
    expect(getUrlDisplayText(undefined)).toBe('')
    expect(getUrlDisplayText('')).toBe('')
  })
})