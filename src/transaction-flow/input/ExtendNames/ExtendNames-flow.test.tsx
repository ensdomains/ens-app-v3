import { mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { usePrice } from '@app/hooks/ensjs/public/usePrice'

import ExtendNames from './ExtendNames-flow'

vi.mock('@app/hooks/chain/useEstimateGasWithStateOverride')
vi.mock('@app/hooks/ensjs/public/usePrice')

const mockUseEstimateGasWithStateOverride = mockFunction(useEstimateGasWithStateOverride)
const mockUsePrice = mockFunction(usePrice)

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
vi.mock(
  '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner',
  async () => {
    const originalModule = await vi.importActual(
      '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner',
    )
    return {
      ...originalModule,
      RegistrationTimeComparisonBanner: vi.fn(() => <div>RegistrationTimeComparisonBanner</div>),
    }
  },
)

describe('Extendnames', () => {
  mockUseEstimateGasWithStateOverride.mockReturnValue({
    data: { gasEstimate: 21000n, gasCost: 100n },
    gasPrice: 100n,
    error: null,
    isLoading: true,
  })
  mockUsePrice.mockReturnValue({
    data: {
      base: 100n,
      premium: 0n,
    },
    isLoading: false,
  })
  it('should render', async () => {
    render(
      <ExtendNames
        {...{ data: { names: ['nick.eth'] }, dispatch: () => null, onDismiss: () => null }}
      />,
    )
  })
  it('should go directly to registration if isSelf is true and names.length is 1', () => {
    mockUseEstimateGasWithStateOverride.mockReturnValueOnce({
      data: { gasEstimate: 21000n, gasCost: 100n },
      gasPrice: 100n,
      error: null,
      isLoading: false,
    })
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    expect(screen.getByText('RegistrationTimeComparisonBanner')).toBeVisible()
  })
  it('should show warning message before registration if isSelf is false and names.length is 1', async () => {
    mockUseEstimateGasWithStateOverride.mockReturnValueOnce({
      data: { gasEstimate: 21000n, gasCost: 100n },
      gasPrice: 100n,
      error: null,
      isLoading: false,
    })
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    expect(screen.getByText('input.extendNames.ownershipWarning.description')).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'action.understand' }))
    await waitFor(() => expect(screen.getByText('RegistrationTimeComparisonBanner')).toBeVisible())
  })
  it('should show a list of names before registration if names.length is greater than 1', async () => {
    mockUseEstimateGasWithStateOverride.mockReturnValueOnce({
      data: { gasEstimate: 21000n, gasCost: 100n },
      gasPrice: 100n,
      error: null,
      isLoading: false,
    })
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth', 'atnight.eth'], isSelf: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    expect(screen.getByTestId('extend-names-names-list')).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'action.next' }))
    await waitFor(() => expect(screen.getByText('RegistrationTimeComparisonBanner')).toBeVisible())
  })
  it('should have RegistrationTimeComparisonBanner greyed out if gas limit estimation is still loading', () => {
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const optionBar = screen.getByText('RegistrationTimeComparisonBanner')
    const { parentElement } = optionBar
    expect(parentElement).toHaveStyle('opacity: 0.5')
  })
  it('should have Invoice greyed out if gas limit estimation is still loading', () => {
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const optionBar = screen.getByText('Invoice')
    const { parentElement } = optionBar
    expect(parentElement).toHaveStyle('opacity: 0.5')
  })
  it('should disabled next button if gas limit estimation is still loading', () => {
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const trailingButton = screen.getByTestId('extend-names-confirm')
    expect(trailingButton).toHaveAttribute('disabled')
  })
})
