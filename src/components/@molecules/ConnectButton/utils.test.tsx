import { Address } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import { getDropdownItems } from './utils'

describe('getDropdownItems', () => {
  const mockT = (key: string) => key
  const mockAddress = '0x123456789' as Address
  const baseProps = {
    primary: {},
    disconnect: vi.fn(),
    copy: vi.fn(),
    copied: false,
    hasPendingTransactions: false,
    isParaConnected: false,
    t: mockT,
    address: mockAddress,
  }

  it('should return basic menu items when no primary name', () => {
    const items = getDropdownItems(baseProps)

    expect(items).toHaveLength(4)
    expect(items[0]).toMatchObject({
      label: 'navigation.settings',
      color: 'text',
      as: 'a',
      showIndicator: false,
    })
    expect(items[2]).toMatchObject({
      label: expect.any(String),
      color: 'text',
    })
    expect(items[3]).toMatchObject({
      label: 'wallet.disconnect',
      color: 'red',
    })
  })

  it('should include profile item when primary name exists', () => {
    const items = getDropdownItems({
      ...baseProps,
      primary: { name: 'test.eth' },
    })

    expect(items).toHaveLength(5)
    expect(items[0]).toMatchObject({
      label: 'wallet.myProfile',
      color: 'text',
    })
  })

  it('should show pending transaction indicator when hasPendingTransactions is true', () => {
    const items = getDropdownItems({
      ...baseProps,
      hasPendingTransactions: true,
    })

    expect(items[0].showIndicator).toBe(true)
  })

  it('should show check icon when copied is true', () => {
    const items = getDropdownItems({
      ...baseProps,
      copied: true,
    })

    const addressItem = items[2]
    expect(addressItem.icon).toBeDefined()
  })

  it('should include Para wallet item when isParaConnected is true', () => {
    const items = getDropdownItems({
      ...baseProps,
      isParaConnected: true,
    })

    expect(items).toHaveLength(5)
    expect(items[3]).toMatchObject({
      label: 'wallet.myWallet',
      color: 'text',
    })
  })

  it('should call copy function when address item is clicked', () => {
    const mockCopy = vi.fn()
    const items = getDropdownItems({
      ...baseProps,
      copy: mockCopy,
    })

    const addressItem = items[2]
    addressItem.onClick?.()
    expect(mockCopy).toHaveBeenCalledWith(mockAddress)
  })

  it('should call disconnect function when disconnect item is clicked', () => {
    const mockDisconnect = vi.fn()
    const items = getDropdownItems({
      ...baseProps,
      disconnect: mockDisconnect,
    })

    const disconnectItem = items[items.length - 1]
    disconnectItem.onClick?.()
    expect(mockDisconnect).toHaveBeenCalled()
  })
})
