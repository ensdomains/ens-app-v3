import { mockFunction, render, screen } from '@app/test-utils'

import { act, waitFor } from '@testing-library/react'
import { ComponentProps } from 'react'

import { usePrimary } from '@app/hooks/usePrimary'

import { OwnerButton } from './OwnerButton'

jest.mock('@app/hooks/usePrimary')

window.scroll = jest.fn()

const mockUsePrimary = mockFunction(usePrimary)

const mockForNoPrimary = () =>
  mockUsePrimary.mockReturnValue({
    name: null,
    loading: false,
    status: 'success',
  })

const mockForPrimary = () =>
  mockUsePrimary.mockReturnValue({
    name: 'nick.eth',
    loading: false,
    status: 'success',
  })

describe('OwnerButton', () => {
  const baseMockData: ComponentProps<typeof OwnerButton> = {
    address: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
    network: 1,
    label: 'Controller',
    canTransfer: false,
    description: 'The controller of the name',
  }

  describe('dialog', () => {
    const dialogMockData: ComponentProps<typeof OwnerButton> = {
      ...baseMockData,
      type: 'dialog',
    }
    it('should show the label', () => {
      mockForNoPrimary()
      render(<OwnerButton {...dialogMockData} />)
      expect(screen.getByText(dialogMockData.label)).toBeVisible()
    })
    it('should show transfer button if specified', async () => {
      mockForNoPrimary()
      const mockData: ComponentProps<typeof OwnerButton> = {
        ...dialogMockData,
        transfer: { canTransfer: true },
      }
      render(<OwnerButton {...mockData} />)

      act(() => {
        screen.getByTestId('owner-button').click()
      })

      await waitFor(() => screen.getByTestId('transfer-button'), {
        timeout: 500,
      }).then((el) => expect(el).toBeInTheDocument())
    })
    it('should show primary name if available', () => {
      mockForPrimary()
      render(<OwnerButton {...dialogMockData} />)
      expect(screen.getByText('nick.eth')).toBeVisible()
    })
    it('should show address if no primary name is available', () => {
      mockForNoPrimary()
      render(<OwnerButton {...dialogMockData} />)
      expect(screen.getByText('0xb6E...28cd9')).toBeVisible()
    })
  })
  describe('dropdown', () => {
    const dropdownMockData: ComponentProps<typeof OwnerButton> = {
      ...baseMockData,
      type: 'dropdown',
    }
    it('should show the label', () => {
      mockForNoPrimary()
      render(<OwnerButton {...dropdownMockData} />)
      expect(screen.getByText(dropdownMockData.label)).toBeVisible()
    })
    it('should show transfer button if specified', async () => {
      mockForNoPrimary()
      const mockData: ComponentProps<typeof OwnerButton> = {
        ...dropdownMockData,
        transfer: { canTransfer: true },
      }
      render(<OwnerButton {...mockData} />)

      act(() => {
        screen.getByTestId('owner-button').click()
      })

      await waitFor(() => screen.getByText('name.transfer'), {
        timeout: 500,
      }).then((el) => expect(el).toBeVisible())
    })
    it('should show primary name if available', () => {
      mockForPrimary()
      render(<OwnerButton {...dropdownMockData} />)
      expect(screen.getByText('nick.eth')).toBeVisible()
    })
    it('should show address if no primary name is available', () => {
      mockForNoPrimary()
      render(<OwnerButton {...dropdownMockData} />)
      expect(screen.getByText('0xb6E...28cd9')).toBeVisible()
    })
  })
})
