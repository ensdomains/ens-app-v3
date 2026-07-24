/**
 * Rendered without `@app/test-utils` on purpose: that module registers a mock for
 * `@app/hooks/useRegistrationReducer`, and these tests drive the real reducer so the flag a step
 * hands to its callback can be observed in the registration data the next step receives.
 */
import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { beforeEach, describe, expect, it, MockedFunction, vi } from 'vitest'
import { useAccount, useChainId } from 'wagmi'

import { lightTheme } from '@ensdomains/thorin'

import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useIsEthRegistrarControllerActive } from '@app/hooks/registration/useIsEthRegistrarControllerActive'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { DeepPartial } from '@app/types'

import Registration from './Registration'
import { BackObj, PaymentMethod, RegistrationReducerDataItem, RegistrationStepData } from './types'

vi.mock('wagmi')
vi.mock('next/router', () => ({ useRouter: () => ({ query: {} }) }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { isInitialized: true }, ready: true }),
}))
vi.mock('@app/utils/analytics/events', () => ({ sendEvent: vi.fn() }))
vi.mock('@app/hooks/useRouterWithHistory', () => ({
  useRouterWithHistory: () => ({
    push: vi.fn(),
    asPath: '/register/test.eth',
    events: { on: vi.fn(), off: vi.fn() },
  }),
}))
vi.mock('@app/transaction-flow/TransactionFlowProvider', () => ({
  useTransactionFlow: () => ({ cleanupFlow: vi.fn() }),
}))
vi.mock('./useMoonpayRegistration', () => ({
  useMoonpayRegistration: () => ({
    moonpayUrl: '',
    initiateMoonpayRegistrationMutation: { mutate: vi.fn() },
    hasMoonpayModal: false,
    setHasMoonpayModal: vi.fn(),
    moonpayTransactionStatus: undefined,
  }),
}))
vi.mock('@app/layouts/Content', () => ({
  Content: ({ children }: { children: { trailing: ReactNode } }) => <div>{children.trailing}</div>,
}))
vi.mock('./steps/Pricing/Pricing', () => ({
  default: ({ callback }: { callback: (data: RegistrationStepData['pricing']) => void }) => {
    const submit = (reverseRecord: boolean) => () =>
      callback({
        seconds: 31536000,
        reverseRecord,
        paymentMethodChoice: PaymentMethod.ethereum,
        durationType: 'years',
      })
    return (
      <>
        <button type="button" onClick={submit(false)}>
          Continue without the profile step
        </button>
        <button type="button" onClick={submit(true)}>
          Continue to the profile step
        </button>
      </>
    )
  },
}))
vi.mock('./steps/Profile/Profile', () => ({
  default: ({
    callback,
    registrationData,
  }: {
    callback: (data: RegistrationStepData['profile'] & BackObj) => void
    registrationData: RegistrationReducerDataItem
  }) => {
    const submit = (clearRecords: boolean) => () =>
      callback({
        records: registrationData.records,
        clearRecords,
        resolverAddress: registrationData.resolverAddress,
        back: false,
      })
    return (
      <>
        <button type="button" onClick={submit(true)}>
          Submit the profile with clearRecords
        </button>
        <button type="button" onClick={submit(false)}>
          Submit the profile with clearRecords false
        </button>
      </>
    )
  },
}))
vi.mock('./steps/Info', () => ({
  default: ({ registrationData }: { registrationData: RegistrationReducerDataItem }) => (
    <div>{`clearRecords: ${registrationData.clearRecords}`}</div>
  ),
}))

vi.mock('@app/hooks/chain/useContractAddress')
vi.mock('@app/hooks/ensjs/public/usePrimaryName')
vi.mock('@app/hooks/registration/useIsEthRegistrarControllerActive')

const userEvent = user.setup()

// Local stand-in for the `mockFunction` helper in `@app/test-utils`, which this file cannot import.
const mockFunction = <TFn extends (...args: never[]) => unknown>(func: TFn) =>
  func as unknown as MockedFunction<(...args: Parameters<TFn>) => DeepPartial<ReturnType<TFn>>>

const nameDetails = {
  normalisedName: 'test.eth',
  beautifiedName: 'test.eth',
} as ReturnType<typeof useNameDetails>

const defaultResolverAddress = '0x0000000000000000000000000000000000000123'

const renderRegistration = () => {
  mockFunction(useAccount).mockReturnValue({
    address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
  })
  mockFunction(useChainId).mockReturnValue(1)
  mockFunction(useContractAddress).mockReturnValue(defaultResolverAddress)
  mockFunction(usePrimaryName).mockReturnValue({ isLoading: false })
  mockFunction(useIsEthRegistrarControllerActive).mockReturnValue({ data: true, isLoading: false })

  return render(
    <ThemeProvider theme={lightTheme}>
      <Registration nameDetails={nameDetails} isLoading={false} />
    </ThemeProvider>,
  )
}

describe('Registration', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('when the profile step is skipped', () => {
    it('should carry clearRecords into the registration data for the default resolver', async () => {
      renderRegistration()

      await userEvent.click(
        screen.getByRole('button', { name: 'Continue without the profile step' }),
      )

      expect(await screen.findByText('clearRecords: true')).toBeInTheDocument()
    })
  })

  describe('when the profile step is used', () => {
    it('should replace a previously stored clearRecords when the profile step submits clearRecords false', async () => {
      renderRegistration()

      await userEvent.click(screen.getByRole('button', { name: 'Continue to the profile step' }))
      await userEvent.click(
        screen.getByRole('button', { name: 'Submit the profile with clearRecords false' }),
      )

      expect(await screen.findByText('clearRecords: false')).toBeInTheDocument()
    })
  })
})
