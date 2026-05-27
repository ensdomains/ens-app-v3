import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { useAccount, useBalance } from 'wagmi'

import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { usePrice } from '@app/hooks/ensjs/public/usePrice'
import { useIsEthRegistrarControllerActive } from '@app/hooks/registration/useIsEthRegistrarControllerActive'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { useReferrer } from '@app/hooks/useReferrer'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'
import ExtendNames from './ExtendNames-flow'

vi.mock('@app/hooks/chain/useEstimateGasWithStateOverride')
vi.mock('@app/hooks/ensjs/public/usePrice')
vi.mock('wagmi')
vi.mock('@app/hooks/ensjs/public/useExpiry')
vi.mock('@app/hooks/useEthPrice')
vi.mock('@app/hooks/useReferrer')
vi.mock('@app/hooks/registration/useIsEthRegistrarControllerActive')

const mockUseEstimateGasWithStateOverride = mockFunction(useEstimateGasWithStateOverride)
const mockUsePrice = mockFunction(usePrice)
const mockUseAccount = mockFunction(useAccount)
const mockUseBalance = mockFunction(useBalance)
const mockUseEthPrice = mockFunction(useEthPrice)
const mockUseExpiry = mockFunction(useExpiry)
const mockUseReferrer = mockFunction(useReferrer)
const mockUseIsEthRegistrarControllerActive = mockFunction(useIsEthRegistrarControllerActive)

vi.mock('@ensdomains/thorin', async () => {
  const originalModule = await vi.importActual('@ensdomains/thorin')
  return {
    ...originalModule,
    ScrollBox: vi.fn(({ children }) => children),
  }
})
vi.mock('@app/components/@atoms/Invoice/Invoice', async () => {
  const originalModule = await vi.importActual('@app/components/@atoms/Invoice/Invoice')
  return {
    ...originalModule,
    Invoice: vi.fn(() => <div>Invoice</div>),
  }
})

makeMockIntersectionObserver()

describe('Extendnames', () => {
  mockUseEstimateGasWithStateOverride.mockReturnValue({
    data: { gasEstimate: 21000n, gasCost: 100n },
    gasPrice: 100n,
    error: null,
    isLoading: false,
  })
  mockUsePrice.mockReturnValue({
    data: {
      base: 100n,
      premium: 0n,
    },
    isLoading: false,
  })
  mockUseAccount.mockReturnValue({ address: '0x1234', isConnected: true })
  mockUseBalance.mockReturnValue({ data: { balance: 100n }, isLoading: false })
  mockUseEthPrice.mockReturnValue({ data: 100n, isLoading: false })
  mockUseExpiry.mockReturnValue({ data: { expiry: { date: new Date() } }, isLoading: false })
  mockUseReferrer.mockReturnValue(undefined)
  mockUseIsEthRegistrarControllerActive.mockReturnValue({ data: true, isLoading: false } as any)
  it('should render', async () => {
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
  })
  it('should have Invoice greyed out if gas limit estimation is still loading', () => {
    mockUseEstimateGasWithStateOverride.mockReturnValueOnce({
      data: { gasEstimate: 21000n, gasCost: 100n },
      gasPrice: 100n,
      error: null,
      isLoading: true,
    })
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const optionBar = screen.getByText('Invoice')
    const { parentElement } = optionBar
    expect(parentElement).toHaveStyle('opacity: 0.5')
  })
  it('should disabled next button if the price data is loading ', () => {
    mockUsePrice.mockReturnValueOnce({
      isLoading: true,
    })
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const trailingButton = screen.getByTestId('extend-names-confirm')
    expect(trailingButton).toHaveAttribute('disabled')
  })
  it('should show the disabled banner and a manager link when the ETHRegistrarController has been removed', () => {
    mockUseIsEthRegistrarControllerActive.mockReturnValueOnce({
      data: false,
      isLoading: false,
    } as any)
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    // The pricing/registration UI must not be shown
    expect(screen.queryByTestId('extend-names-confirm')).not.toHaveTextContent(/next/i)
    // Banner link to the new Manager app
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://app.ens.dev/renew/nick.eth')
  })
  it('should link to the Manager homepage in the disabled banner for bulk renewals', () => {
    mockUseIsEthRegistrarControllerActive.mockReturnValueOnce({
      data: false,
      isLoading: false,
    } as any)
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth', 'alice.eth'], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://app.ens.dev')
  })
})
