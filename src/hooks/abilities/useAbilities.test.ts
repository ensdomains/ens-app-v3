import { mockFunction, renderHook } from '@app/test-utils'
// import { writeFileSync} from 'fs'
import { afterAll } from 'vitest'
import * as _ from 'lodash'

import { match, P } from 'ts-pattern'
import { Address } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  makeMockUseAbilitiesData,
  mockUseAbilitiesConfig,
  mockUseAbilitiesTypes,
} from '../../../test/mock/makeMockUseAbilitiesData'
import { useAccountSafely } from '../account/useAccountSafely'
import { useResolverIsAuthorised } from '../resolver/useResolverIsAuthorised'
import { useBasicName } from '../useBasicName'
import { useHasSubnames } from '../useHasSubnames'
import { useAbilities } from './useAbilities'
import { useParentBasicName } from '../useParentBasicName'
import { makeMockUseBasicName } from '../../../test/mock/makeMockUseBasicName'
import { useContractAddress } from '../chain/useContractAddress'
import { makeMockUseContractAddress } from '../../../test/mock/makeMockUseContractAddress'

vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/useBasicName')
vi.mock('@app/hooks/useParentBasicName')
vi.mock('@app/hooks/resolver/useResolverIsAuthorised')
vi.mock('@app/hooks/useHasSubnames')
vi.mock('@app/hooks/chain/useContractAddress')

const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseBasicName = mockFunction(useBasicName)
const mockUseResolverIsAuthorised = mockFunction(useResolverIsAuthorised)
const mockUseHasSubnames = mockFunction(useHasSubnames)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseParentBasicName = mockFunction(useParentBasicName)
mockUseParentBasicName.mockReturnValue(makeMockUseBasicName('eth'))

// @ts-ignore
mockUseContractAddress.mockImplementation(makeMockUseContractAddress)

describe('useAbilities', () => {
  describe('basic abilities', () => {
    const name = 'nick.eth'
    const ownerAddress = '0x123'
    const account = ownerAddress

    it('should return false for all send abilities if CANNOT_TRANSFER has been burned', () => {
      mockUseAccountSafely.mockReturnValue({ address: account })
      mockUseBasicName.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
          owner: account,
        },
        wrapperData: {
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_TRANSFER: true,
            },
          },
        },
      })
      mockUseResolverIsAuthorised.mockReturnValue({ data: { isAuthorised: true, isValid: true } })
      mockUseHasSubnames.mockReturnValue({ hasSubnames: false, isLoading: false })
      const { result } = renderHook(() => useAbilities({ name }))
      expect(result.current.data?.canSend).toBe(false)
    })
    it('should return canEditRecords as true if resolver is authorised', () => {
      mockUseAccountSafely.mockReturnValue({ address: account })
      mockUseBasicName.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
          owner: account,
        },
        wrapperData: {
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_SET_RESOLVER: true,
            },
          },
        },
      })
      mockUseResolverIsAuthorised.mockReturnValue({ data: { isAuthorised: true, isValid: true } })
      mockUseHasSubnames.mockReturnValue({ hasSubnames: false, isLoading: false })

      const { result } = renderHook(() => useAbilities({ name }))

      expect(result.current.data?.canEditRecords).toBe(true)
    })
  })

  // ownerdata , registrationStatus, pccExpired
  describe('mocks', () => {
    let group: [string[], any][] = []
    afterAll(() => {
      // Group the tests by the data returned
      const code = group.map(([types, data]) => `.with(P.union(${types.map((t) => `'${t}'`).join(',')}), () => (${JSON.stringify(data)}))`).join('\n')
      // writeFileSync('./testcode.ts', code)
    })
    it.each(mockUseAbilitiesTypes)('should return expected data for %s', (type) => {
      
      const config = mockUseAbilitiesConfig[type]
      const { basicNameType, parentNameType, name } = config
      mockUseAccountSafely.mockReturnValue({
        address: createAccounts().getAddress('user') as Address,
      })
      mockUseBasicName.mockReturnValue(makeMockUseBasicName(basicNameType))
      mockUseParentBasicName.mockReturnValue(makeMockUseBasicName(parentNameType))
      mockUseResolverIsAuthorised.mockReturnValue({
        data: { isAuthorised: true, isValid: true },
        isLoading: false,
        isFetching: false,
      })
      mockUseHasSubnames.mockReturnValue({ hasSubnames: false, isLoading: false})

      const { result } = renderHook(() => useAbilities({ name }))

      
      let index = group.findIndex(([,item]) => _.isEqual(item, result.current.data))
      if (index == -1) group.push([[type],result.current.data])
      else group[index][0].push(type)

      const expected = makeMockUseAbilitiesData(type)
      expect(result.current.data).toEqual(expected)
    })
  })
})
