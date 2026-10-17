import {
  EstimateGasExecutionError,
  InvalidInputRpcError,
  RawContractError,
  RpcRequestError,
} from 'viem'
import { describe, expect, it } from 'vitest'

import { getReadableError, isCommitmentTooNewError } from './errors'

// Real payload captured from a mainnet register pre-flight (FET-3203).
// CommitmentTooNew(bytes32 commitment, uint256 minimumCommitmentTimestamp, uint256 currentTimestamp)
const COMMITMENT_TOO_NEW_DATA =
  '0x74480cc9ae290bbaa3282c9bf6ccbc240c630120d38c5edda4089fe86e3afc462b7a6a060000000000000000000000000000000000000000000000000000000069d61c9f0000000000000000000000000000000000000000000000000000000069d61c93' as const

// The shape viem's http transport produces for a JSON-RPC error: the raw error
// member becomes the `cause` of an `RpcRequestError`, which a raw
// `client.request` (e.g. `eth_createAccessList`) then maps by code - -32000 is
// `InvalidInputRpcError`. Nothing normalises `data` along the way.
const makeRpcError = (data: unknown) =>
  new InvalidInputRpcError(
    new RpcRequestError({
      body: {},
      error: { code: -32000, message: 'execution reverted', data } as never,
      url: 'https://example.com',
    }),
  )

// The shape the `estimateGas` action produces for the same JSON-RPC error.
const makeEstimateGasError = (data: unknown) =>
  new EstimateGasExecutionError(makeRpcError(data), {})

describe('errors', () => {
  it('detects CommitmentTooNew from a raw eth_createAccessList revert', () => {
    expect(isCommitmentTooNewError(makeRpcError(COMMITMENT_TOO_NEW_DATA))).toBe(true)
  })

  it('detects CommitmentTooNew from an estimateGas revert', () => {
    const err = makeEstimateGasError(COMMITMENT_TOO_NEW_DATA)

    expect(isCommitmentTooNewError(err)).toBe(true)
    expect(getReadableError(err)).toEqual({ message: 'CommitmentTooNew', type: 'contract' })
  })

  it.each([
    ['eth_createAccessList', makeRpcError],
    ['estimateGas', makeEstimateGasError],
  ])('does not throw when a %s revert has `data: null`', (_, makeError) => {
    const err = makeError(null)

    expect(() => isCommitmentTooNewError(err)).not.toThrow()
    expect(isCommitmentTooNewError(err)).toBe(false)
    expect(() => getReadableError(err)).not.toThrow()
  })

  it('decodes a contract error wrapped in an EstimateGasExecutionError', () => {
    // Regression: this previously short-circuited on the EstimateGasExecutionError
    // branch and returned null, surfacing a generic "execution reverted".
    const err = new EstimateGasExecutionError(
      new RawContractError({
        data: COMMITMENT_TOO_NEW_DATA,
        message: 'execution reverted',
      }) as never,
      {},
    )

    expect(getReadableError(err)).toEqual({ message: 'CommitmentTooNew', type: 'contract' })
  })

  it('still reports insufficient funds after the reorder', () => {
    const err = new EstimateGasExecutionError(
      new RawContractError({
        data: undefined,
        message:
          'insufficient funds for gas * price + value: address 0xCe5eCf6d9E2181Ad77b53305E2b1b6eCa54728F0 have 19481180979346279 want 158177686389512923',
      }) as never,
      {},
    )

    expect(getReadableError(err)).toEqual({
      message: 'Wallet balance too low. Minimum required balance: 0.158177686389512923 ETH',
      type: 'insufficientFunds',
    })
  })

  it('does not throw on an unknown error selector', () => {
    // decodeErrorResult throws on an unrecognised selector, so it must be guarded.
    const err = new RpcRequestError({
      body: {},
      error: { code: 3, message: 'execution reverted', data: '0xdeadbeef' } as never,
      url: 'https://example.com',
    })

    expect(() => getReadableError(err)).not.toThrow()
    expect(isCommitmentTooNewError(err)).toBe(false)
  })
})
