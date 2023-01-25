import { mockFunction, render, screen } from '@app/test-utils'

import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { useChainId } from '@app/hooks/useChainId'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import Token from './Token'

jest.mock('next/router')
jest.mock('@app/hooks/useChainId')
jest.mock('@app/utils/BreakpointProvider')

const mockUseChainId = mockFunction(useChainId)
const mockUseBreakpoint = mockFunction(useBreakpoint)

mockUseBreakpoint.mockReturnValue({ sm: true, md: true, lg: true })

describe('Token', () => {
  describe('TokenId', () => {
    it('should display the correct tokenID (decimal and hex) for an unwrapped names', () => {
      mockUseChainId.mockReturnValue(1)
      const name = 'nick.eth'
      const label = 'nick'
      const labelHash = labelhash(label)
      const tokenId = BigNumber.from(labelHash).toString()

      render(<Token {...{ name, isWrapped: false }} />)
      expect(screen.getByText(labelHash)).toBeVisible()
      expect(screen.getByText(tokenId)).toBeVisible()
    })

    it('should display the correct tokenID (decimal and hex) for an wrapped names', () => {
      mockUseChainId.mockReturnValue(1)
      const name = 'nick.eth'
      const nameHash = namehash(name)
      const tokenId = BigNumber.from(nameHash).toString()

      render(<Token {...{ name, isWrapped: true }} />)
      expect(screen.getByText(nameHash)).toBeVisible()
      expect(screen.getByText(tokenId)).toBeVisible()
    })
  })
})
