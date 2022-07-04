import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { useRegistrationStatus } from '@app/hooks/useRegistrationStatus'
import { fireEvent, mockFunction, render, screen } from '@app/test-utils'
import { ComponentProps } from 'react'
import { SearchResult } from './SearchResult'

jest.mock('@app/hooks/useRegistrationStatus')
jest.mock('@app/hooks/useChainId')
jest.mock('@app/hooks/usePrimary')

const mockUseRegistrationStatus = mockFunction(useRegistrationStatus)
const mockUseChainId = mockFunction(useChainId)
const mockUsePrimary = mockFunction(usePrimary)

describe('SearchResult', () => {
  mockUseChainId.mockReturnValue(1)
  mockUseRegistrationStatus.mockReturnValue({ data: 'available' })

  const baseMockData: ComponentProps<typeof SearchResult> = {
    type: 'name',
    value: 'nick.eth',
    hoverCallback: jest.fn(),
    clickCallback: jest.fn(),
    index: 0,
    selected: 0,
    usingPlaceholder: false,
  }

  it('should render with basic data', () => {
    render(<SearchResult {...baseMockData} />)
    expect(screen.getByText('nick.eth')).toBeVisible()
    expect(screen.getByText('search.status.available')).toBeVisible()
  })
  it('should not use registration status if placeholder', () => {
    render(<SearchResult {...baseMockData} usingPlaceholder />)
    expect(screen.getByText('nick.eth')).toBeVisible()
    expect(
      screen.queryByText('search.status.available'),
    ).not.toBeInTheDocument()
  })
  it('should correctly display an address without a primary name', () => {
    mockUsePrimary.mockReturnValue({
      loading: false,
      name: null,
      status: 'success',
    })
    const mockData: ComponentProps<typeof SearchResult> = {
      ...baseMockData,
      type: 'address',
      value: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
    }
    render(<SearchResult {...mockData} />)
    expect(screen.getByText('0xb6E040...d28cd9')).toBeVisible()
  })
  it('should correctly display an address with a primary name', () => {
    mockUsePrimary.mockReturnValue({
      loading: false,
      name: 'test.eth',
      status: 'success',
    })
    const mockData: ComponentProps<typeof SearchResult> = {
      ...baseMockData,
      type: 'address',
      value: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
    }
    render(<SearchResult {...mockData} />)
    expect(screen.getByText('0xb6E040...d28cd9')).toBeVisible()
    expect(screen.getByText('test.eth')).toBeVisible()
  })
  it('should call hoverCallback on hover', () => {
    render(<SearchResult {...baseMockData} />)
    const element = screen.getByText('nick.eth')
    fireEvent.mouseOver(element)
    expect(baseMockData.hoverCallback).toHaveBeenCalledWith(0)
  })
  it('should call clickCallback on click', () => {
    render(<SearchResult {...baseMockData} />)
    const element = screen.getByText('nick.eth')
    fireEvent.click(element)
    expect(baseMockData.clickCallback).toHaveBeenCalledWith(0)
  })
})
