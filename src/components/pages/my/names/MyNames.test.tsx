import { act, mockFunction, render } from '@app/test-utils'

import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import { NameTableFooter } from '@app/components/@molecules/NameTableFooter/NameTableFooter'
import { useChainId } from '@app/hooks/useChainId'
import { useNamesFromAddress } from '@app/hooks/useNamesFromAddress'
import { Content } from '@app/layouts/Content'

import MyNames from './MyNames'

jest.mock('@app/hooks/useChainId')
jest.mock('next/router')
jest.mock('@app/hooks/useNamesFromAddress')
jest.mock('@app/components/@molecules/NameTableFooter/NameTableFooter')
jest.mock('@app/layouts/Content')

const mockUseChainId = mockFunction(useChainId)
const mockUseRouter = mockFunction(useRouter)
const mockUseAccount = mockFunction(useAccount)
const mockUseNamesFromAddress = mockFunction(useNamesFromAddress)
const mockNameTableFooter = mockFunction(NameTableFooter)
const mockContent = mockFunction(Content)

let onChange: (value: number) => void

const expectQuery = (address: string, page: number) => {
  expect(mockUseNamesFromAddress).toBeCalledWith({
    address,
    sort: {
      type: 'expiryDate',
      orderDirection: 'desc',
    },
    page,
    resultsPerPage: 10,
    search: '',
  })
}

describe('MyNames', () => {
  mockContent.mockImplementation(({ children }) => <div>{children.trailing}</div>)
  mockUseChainId.mockReturnValue(1)
  mockUseRouter.mockReturnValue({
    query: {},
    isReady: true,
    replace: () => {},
  })
  mockUseAccount.mockReturnValue({ address: '0x123' })
  mockUseNamesFromAddress.mockReturnValue({
    currentPage: [],
    isLoading: false,
    pageLength: 0,
  })
  mockNameTableFooter.mockImplementation((({ onChange: _onChange }: { onChange: any }) => {
    onChange = _onChange
    return null
  }) as any)
  it('should reset page on address change', () => {
    const { rerender } = render(<MyNames />)

    act(() => {
      onChange(2)
    })
    expectQuery('0x123', 2)

    mockUseAccount.mockReturnValue({ address: '0x000' })
    rerender(<MyNames />)
    expectQuery('0x000', 1)
  })
})
