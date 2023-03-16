import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

import { safelyMultiplyBigNumber } from './bigNumber'

describe('safelyMultiplyBigNumber', () => {
  it('should not be able to multiply a big number by the max safe integer', () => {
    expect(() => safelyMultiplyBigNumber(BigNumber.from(10), Number.MAX_SAFE_INTEGER, 20)).toThrow()
  })

  it('should be able to multiply a big number by the max safe integer - 1', () => {
    const result = safelyMultiplyBigNumber(BigNumber.from(1), Number.MAX_SAFE_INTEGER - 1, 20)
    expect(result.toString()).toEqual('9007199254740990')
  })

  it('should be able to multiply a big number by a really small number', () => {
    const result = safelyMultiplyBigNumber(
      BigNumber.from(Number.MAX_SAFE_INTEGER - 1),
      0.00000000000001,
      20,
    )
    expect(result.toString()).toEqual('90')
  })

  it('should be able to multiply a big number by a number one power of 10 away from the max', () => {
    const result = safelyMultiplyBigNumber(BigNumber.from('1'), 999999999999999, 20)
    expect(result.toString()).toEqual('999999999999999')
  })
})
