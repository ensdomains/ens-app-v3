import { mockFunction, render, screen } from '@app/test-utils'

import { BigNumber, utils } from 'ethers'

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
      const labelhash = utils.keccak256(utils.toUtf8Bytes(label))
      const tokenId = BigNumber.from(labelhash).toString()

      render(<Token {...{ name, isWrapped: false }} />)
      expect(screen.getByText(labelhash)).toBeVisible()
      expect(screen.getByText(tokenId)).toBeVisible()
    })

    it('should display the correct tokenID (decimal and hex) for an wrapped names', () => {
      mockUseChainId.mockReturnValue(1)
      const name = 'nick.eth'
      const namehash = utils.namehash(name)
      const tokenId = BigNumber.from(namehash).toString()

      render(<Token {...{ name, isWrapped: true }} />)
      expect(screen.getByText(namehash)).toBeVisible()
      expect(screen.getByText(tokenId)).toBeVisible()
    })
  })
})
