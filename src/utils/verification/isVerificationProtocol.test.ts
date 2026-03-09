import { describe, expect, it } from 'vitest'

import { isVerificationProtocol } from './isVerificationProtocol'

describe('isVerificationProtocol', () => {
  // No verification protocols are currently configured
  it.each(['dentity', 'other', 'test'])('should return false for any protocol: %s', (protocol) => {
    expect(isVerificationProtocol(protocol)).toBeFalsy()
  })
})
