import { render, screen, userEvent, waitFor } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { mainnetWithEns } from '@app/constants/chains'

import { RoleRow } from './RoleRow'

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))

const mockUsePrimary = vi.fn().mockReturnValue({})
vi.mock('@app/hooks/ensjs/public/usePrimaryName', () => ({
  usePrimaryName: () => ({
    ...mockUsePrimary(),
    isLoading: false,
  }),
}))

vi.mock('@app/hooks/usePublicClient', () => ({
  usePublicClient: () => ({
    chain: mainnetWithEns,
  }),
}))

describe('RoleRow', () => {
  it('should render', () => {
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={[]}
        actions={[]}
        isWrapped
        isEmancipated
      />,
    )
  })

  it('should display role tags', () => {
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={['manager', 'owner']}
        actions={[]}
        isWrapped
        isEmancipated
      />,
    )
    expect(screen.getByText('roles.owner.title')).toBeVisible()
    expect(screen.getByText('roles.manager.title')).toBeVisible()
  })

  it('should display tooltip when hovering role tags', async () => {
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={['manager', 'owner']}
        actions={[]}
        isWrapped
        isEmancipated
      />,
    )
    expect(screen.queryByText('roles.owner.description')).toEqual(null)
    await userEvent.hover(screen.getByText('roles.owner.title'))
    await waitFor(() => {
      expect(screen.getByText('tabs.ownership.tooltips.owner-emancipated')).toBeVisible()
    })
  })

  it('should display dropdown with option to view and copy address', async () => {
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={[]}
        actions={[]}
        isWrapped
        isEmancipated
      />,
    )
    await userEvent.click(
      screen.getByTestId('role-row-button-0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    await waitFor(() => {
      expect(screen.getByText('address.viewAddress')).toBeVisible()
    })
    expect(screen.getByText('address.copyAddress')).toBeVisible()
  })

  it('should display view name and copy name if usePrimary returns a name', async () => {
    mockUsePrimary.mockReturnValueOnce({ data: { name: 'test.eth' } })
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={[]}
        actions={[]}
        isWrapped
        isEmancipated
      />,
    )
    await userEvent.click(
      screen.getByTestId('role-row-button-0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    await waitFor(() => {
      expect(screen.getByText('wallet.viewProfile')).toBeVisible()
    })
    expect(screen.getByText('name.copy')).toBeVisible()
  })

  it('should not display view name and copy name if usePrimary returns no name', async () => {
    mockUsePrimary.mockReturnValueOnce({ data: undefined })
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={[]}
        actions={[]}
        isWrapped
        isEmancipated
      />,
    )
    await userEvent.click(
      screen.getByTestId('role-row-button-0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    await waitFor(() => {
      expect(screen.getByText('address.viewAddress')).toBeVisible()
    })
    expect(screen.queryByText('wallet.viewProfile')).toEqual(null)
    expect(screen.queryByText('name.copy')).toEqual(null)
  })

  it('should display etherscn  name and copy name if usePrimary returns a name', async () => {
    mockUsePrimary.mockReturnValueOnce({ data: { name: 'test.eth' } })
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={[]}
        actions={[]}
        isWrapped
        isEmancipated
      />,
    )
    await userEvent.click(
      screen.getByTestId('role-row-button-0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    await waitFor(() => {
      expect(screen.getByText('wallet.viewProfile')).toBeVisible()
    })
    expect(screen.getByText('name.copy')).toBeVisible()
  })

  it('should not display view name and copy name if usePrimary returns no name', async () => {
    mockUsePrimary.mockReturnValueOnce({ data: undefined })
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={[]}
        actions={[]}
        isWrapped
        isEmancipated
      />,
    )
    await userEvent.click(
      screen.getByTestId('role-row-button-0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    await waitFor(() => {
      expect(screen.getByText('address.viewAddress')).toBeVisible()
    })
    expect(screen.queryByText('wallet.viewProfile')).toEqual(null)
    expect(screen.queryByText('name.copy')).toEqual(null)
  })

  it('should display view on etherscan if usePrimary returns name and name is 2LDEth', async () => {
    mockUsePrimary.mockReturnValueOnce({ data: { name: 'test.eth' } })
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={[]}
        actions={[]}
        isWrapped={false}
        isEmancipated
      />,
    )
    await userEvent.click(
      screen.getByTestId('role-row-button-0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    await waitFor(() => {
      expect(screen.getByText('address.viewAddress')).toBeVisible()
    })
    expect(screen.queryByText('transaction.viewEtherscan')).toBeVisible()
  })

  it('should display view on etherscan if usePrimary returns subaname and name is wrapped', async () => {
    mockUsePrimary.mockReturnValueOnce({ data: { name: 'sub.test.eth' } })
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={[]}
        actions={[]}
        isWrapped
        isEmancipated
      />,
    )
    await userEvent.click(
      screen.getByTestId('role-row-button-0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    await waitFor(() => {
      expect(screen.getByText('address.viewAddress')).toBeVisible()
    })
    expect(screen.queryByText('transaction.viewEtherscan')).toBeVisible()
  })

  it('should display edit roles option if action type `edit-roles`', async () => {
    mockUsePrimary.mockReturnValueOnce({ data: { name: 'sub.test.eth' } })
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={[]}
        actions={[{ label: 'action.editRoles', type: 'edit-roles' } as any]}
        isWrapped
        isEmancipated
      />,
    )
    await userEvent.click(
      screen.getByTestId('role-row-button-0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    await waitFor(() => {
      expect(screen.getByText('address.viewAddress')).toBeVisible()
    })
    expect(screen.getByText('action.editRoles')).toBeVisible()
  })

  it('should display sync manager option if roles includes `manager` and action includes type `sync-manager`', async () => {
    render(
      <RoleRow
        name="test.eth"
        address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        roles={['manager']}
        actions={[{ label: 'action.syncManager', type: 'sync-manager' } as any]}
        isWrapped
        isEmancipated
      />,
    )
    await userEvent.click(
      screen.getByTestId('role-row-button-0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    await waitFor(() => {
      expect(screen.getByText('address.viewAddress')).toBeVisible()
    })
    expect(screen.getByText('action.syncManager')).toBeVisible()
  })
})
