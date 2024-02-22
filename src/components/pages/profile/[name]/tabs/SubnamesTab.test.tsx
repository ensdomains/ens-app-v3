import { mockFunction, render, screen } from '@app/test-utils'

import { labelhash, namehash } from 'viem'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { useAccount, useEnsAvatar } from 'wagmi'

import { Name } from '@ensdomains/ensjs/subgraph'

import { useSubnames } from '@app/hooks/ensjs/subgraph/useSubnames'
import { useZorb } from '@app/hooks/useZorb'
import { createDateAndValue } from '@app/utils/utils'

import { SubnamesTab } from './SubnamesTab'

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
vi.mock('wagmi')

vi.mock('@app/hooks/ensjs/subgraph/useSubnames')
vi.mock('@app/hooks/useZorb')

const mockUseAccount = mockFunction(useAccount)
const mockUseEnsAvatar = mockFunction(useEnsAvatar)

const mockUseSubnames = mockFunction(useSubnames)
const mockUseZorb = mockFunction(useZorb)
const mockIntersectionObserver = vi.fn()

const makeSubname = (_: any, i: number): Name => {
  const label = `test-${i}`
  const name = `${label}.eth`
  const nameHash = namehash(name)
  const labelHash = labelhash(label)
  const owner = '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9'

  return {
    parentName: 'eth',
    createdAt: createDateAndValue(Date.now()),
    expiryDate: null,
    fuses: null,
    registrant: null,
    registrationDate: null,
    resolvedAddress: null,
    wrappedOwner: null,
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
    mockUseZorb.mockReturnValue('')
    mockUseEnsAvatar.mockReturnValue({ data: null })
    mockUseAccount.mockReturnValue({
      address: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
    })

    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.IntersectionObserver = mockIntersectionObserver
    window.scroll = vi.fn() as () => void
  })

  const baseMockData = {
    name: 'nick.eth',
    network: 1,
    canEdit: false,
    isWrapped: false,
    canCreateSubdomains: true,
  }

  it('should show message if no subnames are found', () => {
    const subnamesMockData = {
      infiniteData: [],
      nameCount: 0,
      isLoading: false,
      isFetching: false,
    }
    mockUseSubnames.mockReturnValue(subnamesMockData)
    render(<SubnamesTab {...baseMockData} />)
    expect(screen.getByText('details.tabs.subnames.empty')).toBeVisible()
    expect(screen.queryByTestId('pagebutton')).not.toBeInTheDocument()
  })
  it('should show single page of subnames if subnamesCount is 10', () => {
    const subnamesMockData = {
      infiniteData: Array.from({ length: 10 }, makeSubname),
      nameCount: 10,
      isLoading: false,
      isFetching: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    }
    mockUseSubnames.mockReturnValue(subnamesMockData)
    render(<SubnamesTab {...baseMockData} />)
    subnamesMockData.infiniteData.forEach((subname) =>
      expect(screen.getByText(subname.truncatedName!.replace('.eth', ''))).toBeVisible(),
    )
  })
  it('should show create subname button if canEdit is true', () => {
    const subnamesMockData = {
      infiniteData: Array.from({ length: 10 }, makeSubname),
      subnameCount: 10,
      isLoading: false,
      isFetching: false,
    }
    mockUseSubnames.mockReturnValue(subnamesMockData)
    render(<SubnamesTab {...baseMockData} canEdit />)
    expect(screen.getByTestId('add-subname-action')).toBeVisible()
  })

  it('should show disabled create subname button if canCreateSubdomains is false', () => {
    const subnamesMockData = {
      infiniteData: Array.from({ length: 10 }, makeSubname),
      subnameCount: 10,
      isLoading: false,
      isFetching: false,
    }
    mockUseSubnames.mockReturnValue(subnamesMockData)
    render(<SubnamesTab {...{ ...baseMockData, canCreateSubdomains: false }} canEdit />)
    expect(screen.getByTestId('add-subname-disabled-button')).toBeVisible()
  })
})
