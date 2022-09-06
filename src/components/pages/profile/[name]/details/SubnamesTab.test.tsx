import { useAvatar } from '@app/hooks/useAvatar'
import { useSubnamePagination } from '@app/hooks/useSubnamePagination'
import { useZorb } from '@app/hooks/useZorb'
import { mockFunction, render, screen } from '@app/test-utils'
import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { useRouter } from 'next/router'
import { SubnamesTab } from './SubnamesTab'

jest.mock('@app/hooks/useSubnamePagination')
jest.mock('@app/hooks/useZorb')
jest.mock('@app/hooks/useAvatar')
jest.mock('next/router')

const mockUseRouter = mockFunction(useRouter)
const mockUseSubnamePagination = mockFunction(useSubnamePagination)
const mockUseZorb = mockFunction(useZorb)
const mockUseAvatar = mockFunction(useAvatar)

const makeSubname = (_: any, i: number) => {
  const label = `test-${i}`
  const name = `${label}.eth`
  const nameHash = namehash(name)
  const labelHash = labelhash(label)
  const owner = {
    id: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
  }

  return {
    id: nameHash,
    labelName: label,
    truncatedName: name,
    labelhash: labelHash,
    isMigrated: true,
    name,
    owner,
  }
}

describe('SubnamesTab', () => {
  beforeAll(() => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseZorb.mockReturnValue('')
    mockUseAvatar.mockReturnValue({
      avatar: '',
      isLoading: false,
    })
  })

  const baseMockData = {
    name: 'nick.eth',
    network: 1,
    canEdit: false,
    isWrapped: false,
  }

  it('should show message if no subnames are found', () => {
    const subnamesMockData = {
      subnames: [],
      subnameCount: 0,
      isLoading: false,
      max: 2,
      page: 0,
      totalPages: 0,
    }
    mockUseSubnamePagination.mockReturnValue(subnamesMockData)
    render(<SubnamesTab {...baseMockData} />)
    expect(screen.getByText('details.tabs.subnames.empty')).toBeVisible()
    expect(screen.queryByTestId('pagebutton')).not.toBeInTheDocument()
  })
  it('should show single page of subnames and 1 page button if subnamesCount is 10', () => {
    const subnamesMockData = {
      subnames: Array.from({ length: 10 }, makeSubname),
      subnameCount: 10,
      isLoading: false,
      max: 2,
      page: 0,
      totalPages: 1,
    }
    mockUseSubnamePagination.mockReturnValue(subnamesMockData)
    render(<SubnamesTab {...baseMockData} />)
    expect(screen.getAllByTestId('pagebutton')).toHaveLength(1)
    expect(screen.getByTestId('pagebutton')).toHaveTextContent('1')
    subnamesMockData.subnames.forEach((subname) =>
      expect(screen.getByText(subname.truncatedName)).toBeVisible(),
    )
  })
  it('should show create subname button if canEdit is true', () => {
    render(<SubnamesTab {...baseMockData} canEdit />)
    expect(screen.getByTestId('add-subname-action')).toBeVisible()
  })
})
