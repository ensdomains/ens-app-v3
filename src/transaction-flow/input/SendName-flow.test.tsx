import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { getFunctionCallDetails } from './SendName-flow'

describe('getFunctionCallDetails', () => {
  describe('Correct function call details', () => {
    describe('Unwrapped name', () => {
      it('for name owner who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'nick.eth'

        const ownerData = {
          ownershipLevel: 'registry',
          owner: ownerAddress,
          registrant: ownerAddress,
        }
        const parentOwnerData = {
          ownershipLevel: 'registry',
        }
        const wrapperData = {
          ownershipLevel: 'registry',
        }
        const parentWrapperData = {}
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'baseRegistrar',
          method: 'reclaim',
        })
      })

      it('for name owner who wants to send owner', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'nick.eth'

        const ownerData = {
          ownershipLevel: 'registry',
          owner: ownerAddress,
          registrant: ownerAddress,
        }
        const parentOwnerData = {
          ownershipLevel: 'registry',
        }
        const wrapperData = {
          ownershipLevel: 'registry',
        }
        const parentWrapperData = {}
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendOwner).toEqual({
          contract: 'baseRegistrar',
          method: 'safeTransferFrom',
        })
      })

      it('for name manager who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'nick.eth'

        const ownerData = {
          ownershipLevel: 'registry',
          owner: ownerAddress,
          registrant: '0xnotOwner',
        }
        const parentOwnerData = {
          ownershipLevel: 'registry',
        }
        const wrapperData = {
          ownershipLevel: 'registry',
        }
        const parentWrapperData = {}
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'registry',
          method: 'setOwner',
        })
      })

      it('for subname manager who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'registry',
          owner: ownerAddress,
        }
        const parentOwnerData = {
          ownershipLevel: 'registry',
        }
        const wrapperData = {
          ownershipLevel: 'registry',
        }
        const parentWrapperData = {}
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'registry',
          method: 'setOwner',
        })
      })

      it('for subname parent manager who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'registry',
        }
        const parentOwnerData = {
          ownershipLevel: 'registry',
          owner: ownerAddress,
        }
        const wrapperData = {
          ownershipLevel: 'registry',
        }
        const parentWrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'registry',
          method: 'setSubnodeOwner',
        })
      })

      it('for subname parent owner who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'registry',
        }
        const wrapperData = {
          fuseObj: {},
        }

        const parentOwnerData = {
          ownershipLevel: 'registry',
          owner: ownerAddress,
          registrant: ownerAddress,
        }
        const parentWrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual([])
      })

      it('for wrapped subname manager who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
          owner: ownerAddress,
        }
        const wrapperData = {
          fuseObj: {},
        }

        const parentOwnerData = {
          ownershipLevel: 'registry',
        }
        const parentWrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname parent manager who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
        }
        const wrapperData = {
          fuseObj: {},
        }

        const parentOwnerData = {
          ownershipLevel: 'registry',
          owner: ownerAddress,
        }
        const parentWrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'registry',
          method: 'setSubnodeOwner',
        })
      })
      it('for wrapped subname parent owner who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
        }
        const wrapperData = {
          fuseObj: {},
        }

        const parentOwnerData = {
          ownershipLevel: 'registry',
          owner: ownerAddress,
          registrant: ownerAddress,
        }
        const parentWrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual([])
      })
    })

    describe('Wrapped name', () => {
      it('for name owner who wants to send owner', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
          owner: ownerAddress,
        }
        const parentOwnerData = {
          ownershipLevel: 'registry',
        }
        const wrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: true,
          },
        }
        const parentWrapperData = {}
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendOwner).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for name manager who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
          owner: ownerAddress,
        }
        const parentOwnerData = {
          ownershipLevel: 'registry',
        }
        const wrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const parentWrapperData = {}
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname manager who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
          owner: ownerAddress,
        }
        const parentOwnerData = {
          ownershipLevel: 'registry',
        }
        const wrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const parentWrapperData = {}
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname owner who wants to send owner', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
          owner: ownerAddress,
        }
        const parentOwnerData = {
          ownershipLevel: 'nameWrapper',
        }
        const wrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: true,
          },
        }
        const parentWrapperData = {}
        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendOwner).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname parent manager who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
        }
        const parentOwnerData = {
          ownershipLevel: 'nameWrapper',
          owner: ownerAddress,
        }
        const wrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const parentWrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }

        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        })
      })
      it('for wrapped subname parent owner who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
        }
        const parentOwnerData = {
          ownershipLevel: 'nameWrapper',
          owner: ownerAddress,
        }
        const wrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const parentWrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }

        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        })
      })
      it('for wrapped subname parent owner who wants to send owner', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'nameWrapper',
        }
        const parentOwnerData = {
          ownershipLevel: 'nameWrapper',
          owner: ownerAddress,
        }
        const wrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: false,
          },
        }
        const parentWrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: true,
          },
        }

        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendOwner).toEqual({
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        })
      })
      it('for subname manager who wants to send manager', () => {
        const ownerAddress = '0x123'
        const account = ownerAddress
        const name = 'sub.nick.eth'

        const ownerData = {
          ownershipLevel: 'registry',
          owner: ownerAddress,
        }
        const parentOwnerData = {
          ownershipLevel: 'nameWrapper',
        }
        const wrapperData = {
          fuseObj: {},
        }
        const parentWrapperData = {
          fuseObj: {
            PARENT_CANNOT_CONTROL: true,
          },
        }

        const result = getFunctionCallDetails({
          address: account,
          name,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual({
          contract: 'registry',
          method: 'setOwner',
        })
      })
    })
  })
})
