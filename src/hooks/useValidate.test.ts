import { mockFunction, renderHook } from '@app/test-utils'

import { isAddress } from '@ethersproject/address'

import { parseInputType, validateName } from '@ensdomains/ensjs/utils/validation'

import { useValidate, useValidateOrAddress } from './useValidate'

jest.mock('@ensdomains/ensjs/utils/validation')
jest.mock('@ethersproject/address')

const mockParseInputType = mockFunction(parseInputType)
const mockValidateName = mockFunction(validateName)
const mockIsAddress = mockFunction(isAddress)

describe('useValidate', () => {
  it('should return invalid inputType is unknown and unsupported', () => {
    mockValidateName.mockReturnValue('test')
    mockParseInputType.mockReturnValue({
      type: 'unknown',
      info: 'unsupported',
    })
    const { result } = renderHook(() => useValidate('test'))
    expect(result.current.valid).toEqual(false)
  })
})

describe('useValidateOrAddress', () => {
  it('should return type address if isAddress returns true', () => {
    mockValidateName.mockReturnValue('test')
    mockIsAddress.mockReturnValue(true)
    const { result } = renderHook(() => useValidateOrAddress('test'))
    expect(result.current.type).toEqual('address')
  })
})
