import { createVerificationTransactionFlow } from './createVerificationTransactionFlow';

import { describe, it, expect, vi, afterEach } from 'vitest';

const mockCreateTransaction = vi.fn()
const mockRouter = { push: vi.fn() }

const defaultProps = {
  verifier: 'dentity' as const,
  address: '0xaddress',
  token: 'token',
  name: 'name.eth',
  resolverAddress: '0xresolver',
  userAddress: '0xaddress',
  createTransactionFlow: mockCreateTransaction,
  router: mockRouter
} as const

const makePropsWithoutProp = (key: keyof typeof defaultProps): any => {
  return Object.fromEntries(Object.entries(defaultProps).filter(([k]) => k !== key))
}

describe('createVerificationTransactionFlow', () => {
  afterEach(() => {
    mockCreateTransaction.mockReset()
    mockRouter.push.mockReset()
  })

  it('should return a transaction item', () => {
    createVerificationTransactionFlow(defaultProps)
    expect(mockRouter.push).toBeCalledWith("/name.eth")
    expect(mockCreateTransaction).toBeCalledWith("update-verification-record-name.eth", {
     "transactions":  [
       {
         "data":{
           "name": "name.eth",
           "resolverAddress": "0xresolver",
           "token": "token",
           "verifier": "dentity",
         },
         "name": "updateVerificationRecord",
       },
     ]})
  })

  it.each(['verifier', 'address', 'name', 'createTransactionFlow', 'resolverAddress', 'userAddress', 'token'] as (keyof typeof defaultProps)[])('should return undefined if a parameter %s is missing', (key) => {
    expect(createVerificationTransactionFlow(makePropsWithoutProp(key))).toBeUndefined()
    expect(mockCreateTransaction).not.toBeCalled()
    expect(mockRouter.push).not.toBeCalled()
  })
})