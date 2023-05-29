import { mockFunction } from '@app/test-utils'

import { NAMEWRAPPER_AWARE_RESOLVERS, emptyAddress } from '@app/utils/constants'
import validateResolver from '@app/validators/validateResolver'

import { canResolverSetPrimaryName } from './canResolverSetPrimaryName'

jest.mock('@app/validators/validateResolver')
const mockValidateResolver = mockFunction(validateResolver)

describe('canResolverSetPrimaryName', () => {
  mockValidateResolver.mockResolvedValue([] as never)

  it('should return false if resolver does not support interface', async () => {
    mockValidateResolver.mockResolvedValueOnce(['does not support interface'] as never)
    const result = await canResolverSetPrimaryName(
      '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
      false,
      {},
      1,
    )
    expect(result).toEqual(false)
  })

  it('should return false if resolver is empty or does not exist', async () => {
    const result = await canResolverSetPrimaryName('', false, {}, 1)
    expect(result).toEqual(false)
    const result2 = await canResolverSetPrimaryName(emptyAddress, false, {}, 1)
    expect(result2).toEqual(false)
  })

  it('should return false if resolver is not wrapper aware and name is wrapped', async () => {
    const result = await canResolverSetPrimaryName('0xnotaware', true, {}, 1)
    expect(result).toEqual(false)
  })

  it('should return true if resolver is wrapper aware and name is wrapped', async () => {
    const result = await canResolverSetPrimaryName(NAMEWRAPPER_AWARE_RESOLVERS[5][0], true, {}, 5)
    expect(result).toEqual(true)
  })

  it('should return true if resolver is not wrapper aware and name is not wrapped', async () => {
    const result = await canResolverSetPrimaryName('0xnotaware', false, {}, 1)
    expect(result).toEqual(true)
  })
})
