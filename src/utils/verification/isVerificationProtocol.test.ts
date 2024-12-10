import { describe, expect, it } from 'vitest'

import { isVerificationProtocol } from './isVerificationProtocol'

describe('isVerificationProtocol', () => {
  it.each(['dentity'])('should return true for protocol: %s', (protocol) => {
    expect(isVerificationProtocol(protocol)).toBeTruthy()
  })

  it.each(['dentitwo'])('should return false for invalid protocol: %s', (protocol) => {
    expect(isVerificationProtocol(protocol)).not.toBeTruthy()
  })
})
