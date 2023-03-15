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
  it('should return valid when input is valid', async () => {
    mockValidateName.mockReturnValue('test')
    mockParseInputType.mockReturnValue({
      type: 'name',
      info: 'supported',
    })
    const { result } = renderHook(() => useValidate('test'))
    expect(result.current.valid).toEqual(true)
  })
  it('should return invalid inputType is unknown and unsupported', async () => {
    mockValidateName.mockReturnValue('fail')
    mockParseInputType.mockReturnValue({
      type: 'unknown',
      info: 'unsupported',
    })
    const { result } = renderHook(() => useValidate('fail'))
    expect(result.current.valid).toEqual(false)
  })
  it('should return isNonASCII as false if all ascii', async () => {
    mockValidateName.mockReturnValue('test')
    mockParseInputType.mockReturnValue({
      type: 'name',
      info: 'supported',
    })
    const { result } = renderHook(() => useValidate('test'))
    expect(result.current.isNonASCII).toEqual(false)
  })
  it('should return isNonASCII as true if contains non ascii', async () => {
    mockValidateName.mockReturnValue('test❤️')
    mockParseInputType.mockReturnValue({
      type: 'name',
      info: 'supported',
    })
    const { result } = renderHook(() => useValidate('test❤️'))
    expect(result.current.isNonASCII).toEqual(true)
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
