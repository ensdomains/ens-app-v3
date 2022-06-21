import { utils, BigNumber } from 'ethers'
import { render, screen } from '@app/test-utils'
import { useRouter } from 'next/router'

import { TokenId } from './MoreTab'

jest.mock('next/router')

describe('More', () => {
  describe('TokenId', () => {
    const routerObject = {
      query: {
        name: 'nick.eth',
      },
    }

    it('should display the correct tokenID (decimal and hex)', () => {
      useRouter.mockImplementation(() => {
        return routerObject
      })
      const label = 'nick'
      const labelHash = utils.keccak256(utils.toUtf8Bytes(label))
      const tokenId = BigNumber.from(labelHash).toString()
      render(<TokenId />)
      expect(screen.getByText(labelHash))
      expect(screen.getByText(tokenId))
    })
  })
})
