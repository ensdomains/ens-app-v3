import { render, screen, userEvent, waitFor, within } from '@app/test-utils'

import { beforeAll, describe, expect, it, vi } from 'vitest'

import EditRoles from './EditRoles-flow'

vi.mock('@app/hooks/account/useAccountSafely', () => ({
  useAccountSafely: () => ({ address: '0xowner' }),
}))

vi.mock('@app/hooks/useBasicName', () => ({
  useBasicName: () => ({
    ownerData: {
      owner: '0xmanager',
      registrant: '0xowner',
    },
    isLoading: false,
  }),
}))

vi.mock('@app/hooks/ownership/useRoles/useRoles', () => ({
  default: () => ({
    data: [
      {
        role: 'owner',
        address: '0xowner',
      },
      {
        role: 'manager',
        address: '0xmanager',
      },
      {
        role: 'eth-record',
        address: '0xeth-record',
      },
      {
        role: 'parent-owner',
        address: '0xparent-address',
      },
      {
        role: 'dns-owner',
        address: '0xdns-owner',
      },
    ],
    isLoading: false,
  }),
}))

vi.mock('@app/hooks/abilities/useAbilities', () => ({
  useAbilities: () => ({
    data: {
      canSendOwner: true,
      canSendManager: true,
      canEditRecords: true,
      sendNameFunctionCallDetails: {
        sendManager: {
          contract: 'registrar',
          method: 'reclaim',
        },
        sendOwner: {
          contract: 'contract',
        },
      },
    },
    isLoading: false,
  }),
}))

let searchData: any[] = []
vi.mock('@app/transaction-flow/input/EditRoles/hooks/useSimpleSearch.ts', () => ({
  useSimpleSearch: () => ({
    mutate: (query: string) => {
      searchData = [{ name: `${query}.eth`, address: `0x${query}` }]
    },
    data: searchData,
    isLoading: false,
    isSuccess: true,
  }),
}))

vi.mock('@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier', () => ({
  AvatarWithIdentifier: ({ name, address }: any) => (
    <div>
      <span>{name}</span>
      <span>{address}</span>
    </div>
  ),
}))

const mockDispatch = vi.fn()

beforeAll(() => {
  const spyiedScroll = vi.spyOn(window, 'scroll')
  spyiedScroll.mockImplementation(() => {})
  window.IntersectionObserver = vi.fn().mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
})

describe('EditRoles', () => {
  it('should dispatch a transaction for each role changed', async () => {
    render(<EditRoles data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />)
    await userEvent.click(
      within(screen.getByTestId('role-card-owner')).getByTestId('role-card-change-button'),
    )
    await userEvent.type(screen.getByTestId('edit-roles-search-input'), 'nick')
    await waitFor(() => {
      expect(screen.getByTestId('search-result-0xnick')).toBeVisible()
    })
    await userEvent.click(screen.getByTestId('search-result-0xnick'))

    await userEvent.click(
      within(screen.getByTestId('role-card-manager')).getByTestId('role-card-change-button'),
    )
    await userEvent.type(screen.getByTestId('edit-roles-search-input'), 'nick')
    await waitFor(() => {
      expect(screen.getByTestId('search-result-0xnick')).toBeVisible()
    })
    await userEvent.click(screen.getByTestId('search-result-0xnick'))

    await userEvent.click(
      within(screen.getByTestId('role-card-eth-record')).getByTestId('role-card-change-button'),
    )
    await userEvent.type(screen.getByTestId('edit-roles-search-input'), 'nick')
    await waitFor(() => {
      expect(screen.getByTestId('search-result-0xnick')).toBeVisible()
    })
    await userEvent.click(screen.getByTestId('search-result-0xnick'))
    await waitFor(() => {
      expect(screen.getByTestId('edit-roles-save-button')).toBeVisible()
    })
    await userEvent.click(screen.getByTestId('edit-roles-save-button'))
    expect(mockDispatch).toHaveBeenCalledWith({
      name: 'setTransactions',
      payload: [
        {
          data: {
            address: '0xnick',
            name: 'test.eth',
          },
          name: 'updateEthAddress',
        },
        {
          data: {
            contract: 'registrar',
            name: 'test.eth',
            newOwnerAddress: '0xnick',
            reclaim: true,
            sendType: 'sendManager',
          },
          name: 'transferName',
        },
        {
          data: {
            contract: 'contract',
            name: 'test.eth',
            newOwnerAddress: '0xnick',
            sendType: 'sendOwner',
          },
          name: 'transferName',
        },
      ],
    })
  })

  it('should not be able to set a role to the existing address', async () => {
    render(<EditRoles data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />)
    await userEvent.click(
      within(screen.getByTestId('role-card-owner')).getByTestId('role-card-change-button'),
    )
    await userEvent.type(screen.getByTestId('edit-roles-search-input'), 'owner')
    await waitFor(() => {
      expect(screen.getByTestId('search-result-0xowner')).toBeDisabled()
    })
    await userEvent.click(screen.getByRole('button', { name: 'action.cancel' }))

    await userEvent.click(
      within(screen.getByTestId('role-card-manager')).getByTestId('role-card-change-button'),
    )
    await userEvent.type(screen.getByTestId('edit-roles-search-input'), 'manager')
    await waitFor(() => {
      expect(screen.getByTestId('search-result-0xmanager')).toBeDisabled()
    })
    await userEvent.click(screen.getByRole('button', { name: 'action.cancel' }))

    await userEvent.click(
      within(screen.getByTestId('role-card-eth-record')).getByTestId('role-card-change-button'),
    )
    await userEvent.type(screen.getByTestId('edit-roles-search-input'), 'eth-record')
    await waitFor(() => {
      expect(screen.getByTestId('search-result-0xeth-record')).toBeDisabled()
    })
    await userEvent.click(screen.getByRole('button', { name: 'action.cancel' }))
  })

  it('should show shortcuts for setting to self or setting to 0x0', async () => {
    render(<EditRoles data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />)
    // Change owner first
    await userEvent.click(
      within(screen.getByTestId('role-card-owner')).getByTestId('role-card-change-button'),
    )
    await userEvent.type(screen.getByTestId('edit-roles-search-input'), 'dave')
    await waitFor(() => {
      expect(screen.getByTestId('search-result-0xdave')).toBeVisible()
    })
    await userEvent.click(screen.getByTestId('search-result-0xdave'))

    // Change owner should not have any shortcuts
    await userEvent.click(
      within(screen.getByTestId('role-card-owner')).getByTestId('role-card-change-button'),
    )
    expect(screen.queryByTestId('edit-roles-set-to-self-button')).toEqual(null)
    expect(screen.queryByRole('button', { name: 'action.remove' })).toEqual(null)
    await userEvent.click(screen.getByRole('button', { name: 'action.cancel' }))

    // Manager set to self
    await userEvent.click(
      within(screen.getByTestId('role-card-manager')).getByTestId('role-card-change-button'),
    )
    await userEvent.click(screen.getByTestId('edit-roles-set-to-self-button'))
    expect(within(screen.getByTestId('role-card-manager')).getByText('0xowner')).toBeVisible()

    // Eth-record set to self
    await userEvent.click(
      within(screen.getByTestId('role-card-eth-record')).getByTestId('role-card-change-button'),
    )
    await userEvent.click(screen.getByTestId('edit-roles-set-to-self-button'))
    expect(within(screen.getByTestId('role-card-eth-record')).getByText('0xowner')).toBeVisible()

    // Eth-record remove
    await userEvent.click(
      within(screen.getByTestId('role-card-eth-record')).getByTestId('role-card-change-button'),
    )
    await userEvent.click(screen.getByRole('button', { name: 'action.remove' }))
    expect(
      within(screen.getByTestId('role-card-eth-record')).getByText(
        'input.editRoles.views.main.noneSet',
      ),
    ).toBeVisible()
  })
})
