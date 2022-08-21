import { mockFunction, render, screen } from '@app/test-utils'
import { BigNumber, utils } from 'ethers'
import { useRouter } from 'next/router'
import { TokenId, generateAccordionData } from './AdvancedTab'

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

describe('generateAccordionData', () => {
  it('should not allow fuse editing if user account does not match connected account', () => {
    const fuseData = {
      owner: '0x123',
      fuses: [],
      fuseObj: {},
      expiryDate: new Date(),
      rawFuses: BigNumber.from(0),
    }
    const t = jest.fn()
    const addressData = {
      address: '0x456',
    }
    const ownerData = {
      owner: '0x789',
      ownershipLevel: 'nameWrapper' as const,
    }
    const accordionData = generateAccordionData(fuseData, t, addressData, ownerData)
    expect(accordionData[1].canEdit).toBe(false)
  })
  it('should not allow resolver editing if user account does not match connected account', () => {
    const fuseData = {
      owner: '0x123',
      fuses: [],
      fuseObj: {},
      expiryDate: new Date(),
      rawFuses: BigNumber.from(0),
    }
    const t = jest.fn()
    const addressData = {
      address: '0x456',
    }
    const ownerData = {
      owner: '0x789',
      ownershipLevel: 'nameWrapper' as const,
    }
    const accordionData = generateAccordionData(fuseData, t, addressData, ownerData)
    expect(accordionData[0].canEdit).toBe(false)
  })
})
