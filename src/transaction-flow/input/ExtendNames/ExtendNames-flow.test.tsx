import { fireEvent, mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAccount, useBalance } from 'wagmi'

import { secondsToDateInput } from '@app/utils/date'

import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { usePrice } from '@app/hooks/ensjs/public/usePrice'
import { useNameType } from '@app/hooks/nameType/useNameType'
import { useIsEthRegistrarControllerActive } from '@app/hooks/registration/useIsEthRegistrarControllerActive'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { useParentBasicName } from '@app/hooks/useParentBasicName'
import { useReferrer } from '@app/hooks/useReferrer'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'
import ExtendNames from './ExtendNames-flow'

vi.mock('@app/hooks/chain/useEstimateGasWithStateOverride')
vi.mock('@app/hooks/ensjs/public/usePrice')
vi.mock('wagmi')
vi.mock('@app/hooks/ensjs/public/useExpiry')
vi.mock('@app/hooks/nameType/useNameType')
vi.mock('@app/hooks/useEthPrice')
vi.mock('@app/hooks/useReferrer')
vi.mock('@app/hooks/registration/useIsEthRegistrarControllerActive')
vi.mock('@app/hooks/useParentBasicName')
vi.mock('@app/utils/BreakpointProvider')

const mockUseEstimateGasWithStateOverride = mockFunction(useEstimateGasWithStateOverride)
const mockUsePrice = mockFunction(usePrice)
const mockUseAccount = mockFunction(useAccount)
const mockUseBalance = mockFunction(useBalance)
const mockUseEthPrice = mockFunction(useEthPrice)
const mockUseExpiry = mockFunction(useExpiry)
const mockUseNameType = mockFunction(useNameType)
const mockUseReferrer = mockFunction(useReferrer)
const mockUseIsEthRegistrarControllerActive = mockFunction(useIsEthRegistrarControllerActive)
const mockUseParentBasicName = mockFunction(useParentBasicName)
const mockUseBreakpoint = mockFunction(useBreakpoint)

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
  mockUseNameType.mockReturnValue({
    data: 'eth-emancipated-subname',
    isLoading: false,
    isCachedData: false,
  })
  mockUseReferrer.mockReturnValue(undefined)
  mockUseIsEthRegistrarControllerActive.mockReturnValue({ data: true, isLoading: false } as any)
  // By default the parent has no wrapper data, so no cap is applied (existing
  // subname/2LD behaviour is unchanged).
  mockUseParentBasicName.mockReturnValue({ wrapperData: undefined, isLoading: false } as any)
  mockUseBreakpoint.mockReturnValue({ xs: true, sm: true, md: true, lg: false, xl: false })

  // Restore the shared expiry/parent mocks after any per-test override so
  // persistent overrides don't leak into subsequent tests.
  afterEach(() => {
    mockUseExpiry.mockReturnValue({ data: { expiry: { date: new Date() } }, isLoading: false })
    mockUseParentBasicName.mockReturnValue({ wrapperData: undefined, isLoading: false } as any)
  })

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
  it('should show the disabled banner when the ETHRegistrarController has been removed', () => {
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
    // Dialog title should be the disabled-state title (i18n key, since
    // react-i18next is mocked to return keys verbatim in tests).
    expect(screen.getAllByText('input.extendNames.disabled.title').length).toBeGreaterThan(0)
    // The pricing/registration confirm button should be replaced by a Close
    // button (action.close), so "action.next" must not appear.
    expect(screen.queryByText('action.next')).not.toBeInTheDocument()
  })
  it('should still show the disabled banner for bulk renewals', () => {
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
    expect(screen.getAllByText('input.extendNames.disabled.title').length).toBeGreaterThan(0)
    expect(screen.queryByText('action.next')).not.toBeInTheDocument()
  })
  it('should create an extendNames transaction for 2LD names', async () => {
    const dispatch = vi.fn()
    mockUseExpiry.mockReturnValueOnce({
      data: { expiry: { date: new Date('2022-01-01T00:00:00.000Z') } },
      isLoading: false,
    })

    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch,
          onDismiss: () => null,
        }}
      />,
    )

    expect(mockUsePrice).toHaveBeenLastCalledWith(
      expect.objectContaining({
        enabled: true,
      }),
    )

    await userEvent.click(screen.getByTestId('extend-names-confirm'))

    expect(dispatch).toHaveBeenCalledWith({
      name: 'setTransactions',
      payload: [
        {
          name: 'extendNames',
          data: expect.objectContaining({
            names: ['nick.eth'],
            duration: 31536000,
            startDateTimestamp: 1640995200000,
            hasWrapped: false,
          }),
        },
      ],
    })
    expect(dispatch).toHaveBeenCalledWith({ name: 'setFlowStage', payload: 'transaction' })
  })
  it('should create an extendSubnameExpiry transaction for single subnames', async () => {
    const dispatch = vi.fn()
    mockUseExpiry.mockReturnValueOnce({
      data: { expiry: { date: new Date('2022-01-01T00:00:00.000Z') } },
      isLoading: false,
    })

    render(
      <ExtendNames
        {...{
          data: { names: ['sub.nick.eth'], isSelf: true, hasWrapped: true },
          dispatch,
          onDismiss: () => null,
        }}
      />,
    )

    expect(mockUsePrice).toHaveBeenLastCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    )

    await userEvent.click(screen.getByTestId('extend-names-confirm'))

    expect(dispatch).toHaveBeenCalledWith({
      name: 'setTransactions',
      payload: [
        {
          name: 'extendSubnameExpiry',
          data: {
            name: 'sub.nick.eth',
            duration: 31536000,
            startDateTimestamp: 1640995200000,
            expiryTimestamp: 1672531200,
          },
        },
      ],
    })
    expect(dispatch).toHaveBeenCalledWith({ name: 'setFlowStage', payload: 'transaction' })
  })
  it('should create an extendSubnameExpiry transaction for locked subnames', async () => {
    const dispatch = vi.fn()
    mockUseNameType.mockReturnValueOnce({
      data: 'eth-locked-subname',
      isLoading: false,
      isCachedData: false,
    })
    mockUseExpiry.mockReturnValueOnce({
      data: { expiry: { date: new Date('2022-01-01T00:00:00.000Z') } },
      isLoading: false,
    })

    render(
      <ExtendNames
        {...{
          data: { names: ['sub.nick.eth'], isSelf: true, hasWrapped: true },
          dispatch,
          onDismiss: () => null,
        }}
      />,
    )

    await userEvent.click(screen.getByTestId('extend-names-confirm'))

    expect(dispatch).toHaveBeenCalledWith({
      name: 'setTransactions',
      payload: [
        expect.objectContaining({
          name: 'extendSubnameExpiry',
        }),
      ],
    })
  })
  it('should not create an extendSubnameExpiry transaction for non-PCC subnames', async () => {
    const dispatch = vi.fn()
    mockUseNameType.mockReturnValueOnce({
      data: 'eth-wrapped-subname',
      isLoading: false,
      isCachedData: false,
    })
    mockUseExpiry.mockReturnValueOnce({
      data: { expiry: { date: new Date('2022-01-01T00:00:00.000Z') } },
      isLoading: false,
    })

    render(
      <ExtendNames
        {...{
          data: { names: ['sub.nick.eth'], isSelf: true, hasWrapped: true },
          dispatch,
          onDismiss: () => null,
        }}
      />,
    )

    const trailingButton = screen.getByTestId('extend-names-confirm')
    expect(trailingButton).toHaveAttribute('disabled')

    await userEvent.click(trailingButton)

    expect(dispatch).not.toHaveBeenCalled()
  })
  it('should not show a Max affordance for 2LD names', () => {
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch: vi.fn(),
          onDismiss: () => null,
        }}
      />,
    )
    expect(screen.queryByTestId('date-selection-max')).not.toBeInTheDocument()
  })
  it('should cap the dispatched subname expiry at the parent expiry when Max is used', async () => {
    const dispatch = vi.fn()
    // subname currently expires 2022-01-01; parent expires 400 days later (a
    // non-year-aligned ceiling, so Max must set the exact parent expiry).
    const subnameExpirySeconds = 1640995200 // 2022-01-01T00:00:00Z
    const parentExpirySeconds = subnameExpirySeconds + 86400 * 400
    mockUseExpiry.mockReturnValue({
      data: {
        expiry: { date: new Date(subnameExpirySeconds * 1000), value: BigInt(subnameExpirySeconds) },
      },
      isLoading: false,
    })
    mockUseParentBasicName.mockReturnValue({
      wrapperData: { expiry: { value: BigInt(parentExpirySeconds) } },
      isLoading: false,
    } as any)

    render(
      <ExtendNames
        {...{
          data: { names: ['sub.nick.eth'], isSelf: true, hasWrapped: true },
          dispatch,
          onDismiss: () => null,
        }}
      />,
    )

    await userEvent.click(screen.getByTestId('date-selection-max'))
    await userEvent.click(screen.getByTestId('extend-names-confirm'))

    expect(dispatch).toHaveBeenCalledWith({
      name: 'setTransactions',
      payload: [
        expect.objectContaining({
          name: 'extendSubnameExpiry',
          data: expect.objectContaining({
            name: 'sub.nick.eth',
            expiryTimestamp: parentExpirySeconds,
          }),
        }),
      ],
    })
  })
  it('should disable extension and show a message when already at max expiry', async () => {
    const dispatch = vi.fn()
    const subnameExpirySeconds = 1672531200 // 2023-01-01T00:00:00Z
    mockUseExpiry.mockReturnValue({
      data: {
        expiry: { date: new Date(subnameExpirySeconds * 1000), value: BigInt(subnameExpirySeconds) },
      },
      isLoading: false,
    })
    // Only 100s of headroom — below minSeconds (ONE_DAY), so extension is
    // disabled with an "already at maximum expiry" message.
    mockUseParentBasicName.mockReturnValue({
      wrapperData: { expiry: { value: BigInt(subnameExpirySeconds + 100) } },
      isLoading: false,
    } as any)

    render(
      <ExtendNames
        {...{
          data: { names: ['sub.nick.eth'], isSelf: true, hasWrapped: true },
          dispatch,
          onDismiss: () => null,
        }}
      />,
    )

    expect(screen.getByTestId('extend-names-at-max-expiry')).toBeInTheDocument()
    const trailingButton = screen.getByTestId('extend-names-confirm')
    expect(trailingButton).toHaveAttribute('disabled')

    await userEvent.click(trailingButton)
    expect(dispatch).not.toHaveBeenCalled()
  })
  it('backstop clamps the dispatched expiry to the parent even if the timestamp overshoots', async () => {
    const dispatch = vi.fn()
    // Force the dispatched expiryTimestamp (derived from expiry.date) to land
    // PAST the parent expiry even after the picker cap (derived from
    // expiry.value): the wrapper `date` is 10 days ahead of `value`. Only the
    // Math.min backstop keeps the on-chain arg at the parent expiry — remove or
    // invert it and this test fails.
    const subnameExpirySeconds = 1640995200 // value → drives the picker cap
    const subnameExpiryDateSeconds = subnameExpirySeconds + 86400 * 10 // date → drives expiryTimestamp
    const parentExpirySeconds = subnameExpirySeconds + 86400 * 400
    mockUseExpiry.mockReturnValue({
      data: {
        expiry: {
          date: new Date(subnameExpiryDateSeconds * 1000),
          value: BigInt(subnameExpirySeconds),
        },
      },
      isLoading: false,
    })
    mockUseParentBasicName.mockReturnValue({
      wrapperData: { expiry: { value: BigInt(parentExpirySeconds) } },
      isLoading: false,
    } as any)

    render(
      <ExtendNames
        {...{
          data: { names: ['sub.nick.eth'], isSelf: true, hasWrapped: true },
          dispatch,
          onDismiss: () => null,
        }}
      />,
    )

    await userEvent.click(screen.getByTestId('date-selection-max'))
    await userEvent.click(screen.getByTestId('extend-names-confirm'))

    expect(dispatch).toHaveBeenCalledWith({
      name: 'setTransactions',
      payload: [
        expect.objectContaining({
          name: 'extendSubnameExpiry',
          data: expect.objectContaining({ expiryTimestamp: parentExpirySeconds }),
        }),
      ],
    })
  })
  it('never dispatches past the parent expiry when a date beyond it is picked in the calendar', async () => {
    const dispatch = vi.fn()
    const subnameExpirySeconds = 1640995200 // 2022-01-01T00:00:00Z
    const parentExpirySeconds = subnameExpirySeconds + 86400 * 400
    mockUseExpiry.mockReturnValue({
      data: {
        expiry: { date: new Date(subnameExpirySeconds * 1000), value: BigInt(subnameExpirySeconds) },
      },
      isLoading: false,
    })
    mockUseParentBasicName.mockReturnValue({
      wrapperData: { expiry: { value: BigInt(parentExpirySeconds) } },
      isLoading: false,
    } as any)

    render(
      <ExtendNames
        {...{
          data: { names: ['sub.nick.eth'], isSelf: true, hasWrapped: true },
          dispatch,
          onDismiss: () => null,
        }}
      />,
    )

    // Switch to the calendar view and pick a date well beyond the parent expiry.
    await userEvent.click(screen.getByTestId('date-selection'))
    fireEvent.change(screen.getByTestId('calendar'), {
      target: { value: secondsToDateInput(parentExpirySeconds + 86400 * 100) },
    })
    await userEvent.click(screen.getByTestId('extend-names-confirm'))

    const dispatched = dispatch.mock.calls.find(([action]) => action.name === 'setTransactions')?.[0]
    expect(dispatched).toBeDefined()
    const { expiryTimestamp } = dispatched.payload[0].data
    // AC3: the dispatched value must never exceed the parent expiry.
    expect(expiryTimestamp).toBeLessThanOrEqual(parentExpirySeconds)
  })
})
