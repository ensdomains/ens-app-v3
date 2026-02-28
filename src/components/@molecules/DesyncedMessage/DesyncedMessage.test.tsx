import { mockFunction, render, screen, userEvent } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Hex } from 'viem'
import { useAccount } from 'wagmi'

import { useReferrer } from '@app/hooks/useReferrer'
import { useResolvedReferrer } from '@app/hooks/useResolvedReferrer'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { ONE_DAY } from '@app/utils/time'

import { DesyncedMessage } from './DesyncedMessage'

vi.mock('wagmi')
vi.mock('@app/hooks/useReferrer')
vi.mock('@app/hooks/useResolvedReferrer')
vi.mock('@app/transaction-flow/TransactionFlowProvider')

const mockUseAccount = mockFunction(useAccount)
const mockUseReferrer = mockFunction(useReferrer)
const mockUseResolvedReferrer = mockFunction(useResolvedReferrer)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)

const mockCreateTransactionFlow = vi.fn()
const mockShowExtendNamesInput = vi.fn()
const mockUsePreparedDataInput = () => mockShowExtendNamesInput

describe('DesyncedMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAccount.mockReturnValue({ isConnected: true })
    mockUseReferrer.mockReturnValue(undefined)
    mockUseResolvedReferrer.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    })
    mockUseTransactionFlow.mockReturnValue({
      createTransactionFlow: mockCreateTransactionFlow,
      usePreparedDataInput: mockUsePreparedDataInput,
    })
  })

  it('should disable action button when referrer is resolving', () => {
    mockUseReferrer.mockReturnValue('vitalik.eth')
    mockUseResolvedReferrer.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    })

    render(
      <DesyncedMessage
        name="test.eth"
        expiryDate={new Date(Date.now() - 1000)}
        isGracePeriod={false}
      />,
    )

    const actionButton = screen.getByRole('button')
    expect(actionButton).toBeDisabled()
  })

  it('should enable action button when referrer resolution completes', () => {
    const mockReferrerHex =
      '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045' as Hex
    mockUseReferrer.mockReturnValue('vitalik.eth')
    mockUseResolvedReferrer.mockReturnValue({
      data: mockReferrerHex,
      isLoading: false,
      isError: false,
      error: null,
    })

    render(
      <DesyncedMessage
        name="test.eth"
        expiryDate={new Date(Date.now() - 1000)}
        isGracePeriod={false}
      />,
    )

    const actionButton = screen.getByRole('button')
    expect(actionButton).not.toBeDisabled()
  })

  it('should pass resolved referrer hex to transaction when clicking action button', async () => {
    const mockReferrerHex =
      '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045' as Hex
    mockUseReferrer.mockReturnValue('vitalik.eth')
    mockUseResolvedReferrer.mockReturnValue({
      data: mockReferrerHex,
      isLoading: false,
      isError: false,
      error: null,
    })

    const futureDate = new Date(Date.now() + ONE_DAY * 1000 + 10000)

    render(
      <DesyncedMessage name="test.eth" expiryDate={futureDate} isGracePeriod={false} />,
    )

    const actionButton = screen.getByRole('button')
    await userEvent.click(actionButton)

    expect(mockCreateTransactionFlow).toHaveBeenCalledWith(
      'repair-desynced-name-test.eth',
      expect.objectContaining({
        transactions: [
          expect.objectContaining({
            name: 'repairDesyncedName',
            data: expect.objectContaining({
              name: 'test.eth',
              referrer: mockReferrerHex,
              hasWrapped: true,
            }),
          }),
        ],
      }),
    )
  })

  it('should pass undefined referrer when no referrer is resolved', async () => {
    mockUseReferrer.mockReturnValue(undefined)
    mockUseResolvedReferrer.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    })

    const futureDate = new Date(Date.now() + ONE_DAY * 1000 + 10000)

    render(
      <DesyncedMessage name="test.eth" expiryDate={futureDate} isGracePeriod={false} />,
    )

    const actionButton = screen.getByRole('button')
    await userEvent.click(actionButton)

    expect(mockCreateTransactionFlow).toHaveBeenCalledWith(
      'repair-desynced-name-test.eth',
      expect.objectContaining({
        transactions: [
          expect.objectContaining({
            name: 'repairDesyncedName',
            data: expect.objectContaining({
              name: 'test.eth',
              referrer: undefined,
              hasWrapped: true,
            }),
          }),
        ],
      }),
    )
  })

  it('should call useResolvedReferrer with the referrer param', () => {
    mockUseReferrer.mockReturnValue('nick.eth')

    render(
      <DesyncedMessage name="test.eth" expiryDate={new Date()} isGracePeriod={false} />,
    )

    expect(mockUseResolvedReferrer).toHaveBeenCalledWith({ referrer: 'nick.eth' })
  })
})
