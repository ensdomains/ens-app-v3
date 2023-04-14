import '@app/test-utils'

import { getUserDefinedUrl } from './ProfileSnippet'

describe('getUserDefinedUrl', () => {
  it('should return undefined if no URL is provided', () => {
    expect(getUserDefinedUrl()).toBeUndefined()
  })

  it('should return the input URL if it starts with http://', () => {
    expect(getUserDefinedUrl('http://example.com')).toBe('http://example.com')
  })

  it('should return the input URL if it starts with https://', () => {
    expect(getUserDefinedUrl('https://example.com')).toBe('https://example.com')
  })

  it('should return an empty string if the input URL does not start with http:// or https://', () => {
    expect(getUserDefinedUrl('example.com')).toBe('')
  })

  it('should replace javascript: with empty string', () => {
    // eslint-disable-next-line no-script-url
    expect(getUserDefinedUrl('javascript:alert("hello")')).toBe('')
  })
})
