import getRandomValues from 'polyfill-crypto.getrandomvalues'

import { randomSecret } from './useRegistrationReducer'

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: getRandomValues,
  },
})

describe('useRegistrationReducer', () => {
  it('randomSecret should add platform and version referral prefix', async () => {
    const platformSource = '9923eb94'
    const version = '00000003'
    const secret = randomSecret()
    expect(secret.length).toEqual(66)
    expect(secret.slice(2, 16 + 2)).toEqual(platformSource + version)
  })
})
