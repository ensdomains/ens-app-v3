import { mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useLocalStorage } from '@app/hooks/useLocalStorage'

import { RegistrationReducerDataItem } from '../../types'
import Profile from './Profile'

vi.mock('wagmi')

vi.mock('@app/hooks/chain/useContractAddress')
vi.mock('@app/hooks/useLocalStorage')

const mockUseAccount = mockFunction(useAccount)

const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseLocalStorage = mockFunction(useLocalStorage)

const name = 'test.eth'

const defaultRegistrationData = {
  records: [
    {
      key: 'eth',
      value: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
      group: 'address',
      type: 'addr',
    },
  ],
  resolverAddress: '0x123',
  clearRecords: true,
} as unknown as RegistrationReducerDataItem

const makeRegistrationData = (overwrites: any = {}): any => {
  return { ...defaultRegistrationData, ...overwrites }
}

const makeExpectedCallbackData = (overwrites: any = {}): any => {
  return {
    ...defaultRegistrationData,
    back: false,
    ...overwrites,
  }
}

mockUseAccount.mockReturnValue({ address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7' })

mockUseContractAddress.mockReturnValue('0x123' as any)
mockUseLocalStorage.mockReturnValue([false, () => {}])

const mockIntersectionObserver = vi.fn().mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

const mockCallback = vi.fn()

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render', () => {
    render(
      <Profile
        name={name}
        registrationData={makeRegistrationData()}
        callback={mockCallback}
        resolverExists
      />,
    )
  })

  it('should call callback when submitted', async () => {
    render(
      <Profile
        name={name}
        registrationData={makeRegistrationData()}
        callback={mockCallback}
        resolverExists
      />,
    )
    await userEvent.click(screen.getByTestId('profile-submit-button'))
    await waitFor(() => expect(mockCallback).toHaveBeenCalledWith(makeExpectedCallbackData()))
  })

  it('should call callback when back is clicked', async () => {
    render(
      <Profile
        name={name}
        registrationData={makeRegistrationData()}
        callback={mockCallback}
        resolverExists
      />,
    )
    await userEvent.click(screen.getByTestId('profile-back-button'))
    await waitFor(() =>
      expect(mockCallback).toHaveBeenCalledWith(makeExpectedCallbackData({ back: true })),
    )
  })

  it('should return callback with clearRecords as false if resolver value is different from public resolver', async () => {
    render(
      <Profile
        name={name}
        registrationData={makeRegistrationData({ resolverAddress: '0x456' })}
        callback={mockCallback}
        resolverExists
      />,
    )
    await userEvent.click(screen.getByTestId('profile-submit-button'))
    await waitFor(() =>
      expect(mockCallback).toHaveBeenCalledWith(
        makeExpectedCallbackData({ resolverAddress: '0x456', clearRecords: false }),
      ),
    )
  })

  it('should return callback with clearRecords set as false if resolverExists is false', async () => {
    render(
      <Profile
        name={name}
        registrationData={makeRegistrationData()}
        callback={mockCallback}
        resolverExists={false}
      />,
    )
    await userEvent.click(screen.getByTestId('profile-submit-button'))
    await waitFor(() =>
      expect(mockCallback).toHaveBeenCalledWith(makeExpectedCallbackData({ clearRecords: false })),
    )
  })

  it('should disable eth record if registrationData.reverseRecord is true', async () => {
    render(
      <Profile
        name={name}
        registrationData={makeRegistrationData({ reverseRecord: true })}
        callback={mockCallback}
        resolverExists
      />,
    )

    const ethRecord = screen.getByTestId('profile-record-input-eth')
    expect(ethRecord.querySelector('input')).toBeDisabled()
    expect(screen.getByTestId('profile-record-input-eth-delete-button')).toBeDisabled()
  })

  it('should prompt user before deleting eth record', async () => {
    render(
      <Profile
        name={name}
        registrationData={makeRegistrationData()}
        callback={mockCallback}
        resolverExists
      />,
    )

    await userEvent.click(screen.getByTestId('profile-record-input-eth-delete-button'))
    await waitFor(() =>
      expect(screen.getByText('steps.profile.confirmations.clearEth.title')).toBeInTheDocument(),
    )

    await userEvent.click(screen.getByTestId('confirmation-dialog-confirm-button'))
    await waitFor(() =>
      expect(screen.queryByText('steps.profile.confirmations.clearEth.title')).toBe(null),
    )

    await userEvent.click(screen.getByTestId('profile-submit-button'))
    await waitFor(() =>
      expect(mockCallback).toHaveBeenCalledWith(makeExpectedCallbackData({ records: [] })),
    )
  })

  it('should prompt user before showing add profile modal', async () => {
    render(
      <Profile
        name={name}
        registrationData={makeRegistrationData()}
        callback={mockCallback}
        resolverExists
      />,
    )
    await userEvent.click(screen.getByTestId('show-add-profile-records-modal-button'))
    await waitFor(() =>
      expect(
        screen.getByText('steps.profile.confirmations.publicNotice.title'),
      ).toBeInTheDocument(),
    )

    screen.getByTestId('show-add-profile-records-modal-button')
    await userEvent.click(screen.getByTestId('confirmation-dialog-confirm-button'))

    await waitFor(() =>
      expect(screen.queryByText('steps.profile.confirmations.publicNotice.title')).toBe(null),
    )

    await waitFor(() => expect(screen.getByText('steps.profile.addProfile')).toBeInTheDocument())
    await userEvent.click(screen.getByTestId('profile-record-option-name'))
    await userEvent.click(screen.getByTestId('add-profile-records-button'))

    await userEvent.click(screen.getByTestId('profile-submit-button'))
    await waitFor(() =>
      expect(mockCallback).toHaveBeenCalledWith(
        makeExpectedCallbackData({
          records: [
            ...defaultRegistrationData.records,
            { key: 'name', value: '', type: 'text', group: 'general' },
          ],
        }),
      ),
    )
  })

  it('should show an error for duplicate label on custom avatar field if media avatar record exists', async () => {
    const overrides = {
      records: [
        {
          key: 'avatar',
          value: 'https://example.com',
          type: 'text',
          group: 'media',
        },
        {
          key: 'avatar',
          value: 'https://example.com',
          type: 'text',
          group: 'custom',
        },
      ],
    }

    render(
      <Profile
        name={name}
        registrationData={makeRegistrationData(overrides)}
        callback={mockCallback}
        resolverExists
      />,
    )
    await userEvent.click(screen.getByTestId('profile-submit-button'))
    await waitFor(() => expect(mockCallback).not.toHaveBeenCalled())
    expect(screen.getByText('steps.profile.errors.avatarReserved')).toBeInTheDocument()
  })
})
