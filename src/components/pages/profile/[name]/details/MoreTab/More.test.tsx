import { mockFunction, render, screen } from '@app/test-utils'
import { BigNumber, utils } from 'ethers'
import { useRouter } from 'next/router'
import { TokenId } from './MoreTab'

jest.mock('next/router')

const mockUseRouter = mockFunction(useRouter)

describe('More', () => {
  describe('TokenId', () => {
    const routerObject = {
      query: {
        name: 'nick.eth',
      },
    }

    it('should display the correct tokenID (decimal and hex)', () => {
      mockUseRouter.mockReturnValue(routerObject)
      const label = 'nick'
      const labelHash = utils.keccak256(utils.toUtf8Bytes(label))
      const tokenId = BigNumber.from(labelHash).toString()
      render(<TokenId />)
      expect(screen.getByText(labelHash)).toBeVisible()
      expect(screen.getByText(tokenId)).toBeVisible()
    })
  })
})
