import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { TransactionDisplayItem } from '@app/types'

import { DisplayItems } from './DisplayItems'

vi.mock('@app/hooks/ensjs/public/usePrimaryName')

const mockUsePrimaryName = mockFunction(usePrimaryName)

const genericItem: TransactionDisplayItem = {
  label: 'GenericItem',
  value: 'GenericValue',
}

const addressItem: TransactionDisplayItem = {
  label: 'AddressItem',
  value: '0x1234567890123456789012345678901234567890',
  type: 'address',
}

const nameItem: TransactionDisplayItem = {
  label: 'NameItem',
  value: 'test.eth',
  type: 'name',
}

describe('DisplayItems', () => {
  it('should show a generic item', () => {
    render(<DisplayItems displayItems={[genericItem]} />)
    expect(screen.getByText('transaction.itemLabel.GenericItem')).toBeVisible()
    expect(screen.getByText('GenericValue')).toBeVisible()
  })
  it('should show the raw label', () => {
    render(<DisplayItems displayItems={[{ ...genericItem, useRawLabel: true }]} />)
    expect(screen.getByText('GenericItem')).toBeVisible()
    expect(screen.getByText('GenericValue')).toBeVisible()
  })
  it('should show an address item and primary name', () => {
    mockUsePrimaryName.mockReturnValue({
      data: {
        name: 'test.eth',
        beautifiedName: 'test.eth',
      },
      isLoading: false,
      status: 'success',
    })
    render(<DisplayItems displayItems={[addressItem]} />)
    expect(screen.getByText('transaction.itemLabel.AddressItem')).toBeVisible()
    expect(screen.getByText('0x123...67890')).toBeVisible()
    expect(screen.getByText('test.eth')).toBeVisible()
  })
  it('should show an address item and no primary name', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: undefined, beautifiedName: undefined },
      isLoading: false,
      status: 'success',
    })
    render(<DisplayItems displayItems={[addressItem]} />)
    expect(screen.getByText('transaction.itemLabel.AddressItem')).toBeVisible()
    expect(screen.getByText('0x123...67890')).toBeVisible()
    expect(screen.queryByText('test.eth')).not.toBeInTheDocument()
  })
  it('should show a name item', () => {
    render(<DisplayItems displayItems={[nameItem]} />)
    expect(screen.getByText('transaction.itemLabel.NameItem')).toBeVisible()
    expect(screen.getByText('test.eth')).toBeVisible()
  })
  it('should render multiple items', () => {
    mockUsePrimaryName.mockReturnValue({
      data: { name: undefined, beautifiedName: undefined },
      isLoading: false,
      status: 'success',
    })
    render(<DisplayItems displayItems={[addressItem, nameItem, genericItem]} />)
    expect(screen.getByText('transaction.itemLabel.AddressItem')).toBeVisible()
    expect(screen.getByText('0x123...67890')).toBeVisible()
    expect(screen.getByText('transaction.itemLabel.NameItem')).toBeVisible()
    expect(screen.getByText('test.eth')).toBeVisible()
    expect(screen.getByText('transaction.itemLabel.GenericItem')).toBeVisible()
    expect(screen.getByText('GenericValue')).toBeVisible()
  })
})
