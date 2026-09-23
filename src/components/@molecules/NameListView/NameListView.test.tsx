import { mockFunction, render } from '@app/test-utils'

import { labelhash } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { useNamesForAddress } from '@app/hooks/ensjs/subgraph/useNamesForAddress'
import { createDateAndValue } from '@app/utils/utils'

import { isNameExtendable, NameListView } from './NameListView'

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
vi.mock('@app/components/@atoms/NameDetailItem/TaggedNameItem')
vi.mock('@app/hooks/ensjs/subgraph/useNamesForAddress')

const mockTaggedNameItem = mockFunction(TaggedNameItem)
const mockUseNamesForAddress = mockFunction(useNamesForAddress)

const mockComponent = ({ name }: { name: string }) => <div key={name}>{name}</div>

const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver
window.scroll = vi.fn() as () => void

describe('NameListView', () => {
  it('should not offer registered short .eth names for bulk extension', () => {
    expect(isNameExtendable({ name: 'on.eth', parentName: 'eth' })).toBe(false)
    expect(isNameExtendable({ name: 'nick.eth', parentName: 'eth' })).toBe(true)
  })

  // The subgraph hands this list unhealed labels routinely, and `parseInput` calls them short
  // because it has nothing to measure. They are ordinary names and keep their extend checkbox.
  it('should still offer a name whose label is an encoded labelhash for bulk extension', () => {
    const encodedName = `[${labelhash('nick').slice(2)}].eth`

    expect(isNameExtendable({ name: encodedName, parentName: 'eth' })).toBe(true)
  })

  it('should render if there are results', () => {
    mockTaggedNameItem.mockImplementation(mockComponent as any)
    mockUseNamesForAddress.mockReturnValue({
      infiniteData: [
        {
          name: 'name.eth',
          id: '0x123',
          expiryDate: createDateAndValue(new Date('2020-01-01').getTime()),
          relation: {
            owner: true,
            registrant: true,
          },
        },
      ],
      nameCount: 1,
    })

    const { getByText } = render(<NameListView address="0x123" selfAddress={undefined} />)
    expect(getByText('name.eth')).toBeInTheDocument()
  })
  it('should render no results if there are no results', () => {
    mockUseNamesForAddress.mockReturnValue({
      infiniteData: [],
      nameCount: 0,
    })
    const { queryByText } = render(<NameListView address="0x123" selfAddress={undefined} />)
    expect(queryByText('empty')).toBeInTheDocument()
  })
})
