import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { getFunctionCallDetails, getPermittedActions } from './SendName-flow'

const ownerAddress = '0x123'
const account = ownerAddress
const name = 'nick.eth'
const subname = 'sub.nick.eth'

const userStates = {
  unwrappedNameOwner: {
    ownerData: {
      ownershipLevel: 'registry',
      owner: ownerAddress,
      registrant: ownerAddress,
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
    },
    wrapperData: {
      ownershipLevel: 'registry',
    },
    parentWrapperData: {},
  },
  unwrappedNameManager: {
    ownerData: {
      ownershipLevel: 'registry',
      owner: ownerAddress,
      registrant: '0xnotOwner',
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
    },
    wrapperData: {
      fuseObj: {},
    },
    parentWrapperData: {},
  },
  unwrappedSubnameManager: {
    ownerData: {
      ownershipLevel: 'registry',
      owner: ownerAddress,
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
    },
    wrapperData: {
      fuseObj: {},
    },
    parentWrapperData: {},
  },
  unwrappedSubnameUnwrappedParentManager: {
    ownerData: {
      ownershipLevel: 'registry',
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
      owner: ownerAddress,
    },
    wrapperData: {
      fuseObj: {},
    },
    parentWrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
  },
  unwrappedSubnameUnwrappedParentOwner: {
    ownerData: {
      ownershipLevel: 'registry',
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
      owner: ownerAddress,
      registrant: ownerAddress,
    },
    wrapperData: {
      fuseObj: {},
    },
    parentWrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
  },
  wrappedSubnameManagerParentUnwrapped: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    wrapperData: {
      fuseObj: {},
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
    },
    parentWrapperData: {
      fuseObj: {},
    },
  },
  wrappedSubnameUnwrappedParentManager: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
    },
    wrapperData: {
      fuseObj: {},
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
      owner: ownerAddress,
    },
    parentWrapperData: {
      fuseObj: {},
    },
  },
  wrappedSubnameUnwrappedParentOwner: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
    },
    wrapperData: {
      fuseObj: {},
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
      owner: ownerAddress,
      registrant: ownerAddress,
    },
    parentWrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
  },
  wrappedNameOwner: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
    parentWrapperData: {},
  },
  wrappedNameManager: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
    parentWrapperData: {},
  },
  wrappedSubnameManagerWrappedParent: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    parentOwnerData: {
      ownershipLevel: 'nameWrapper',
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
    parentWrapperData: {},
  },
  wrappedSubnameOwnerWrappedParentManager: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    parentOwnerData: {
      ownershipLevel: 'nameWrapper',
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
    parentWrapperData: {},
  },
  wrappedSubnameWrappedParentManager: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
    },
    parentOwnerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
    parentWrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
  },
  wrappedSubnameWrappedParentOwner: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
    },
    parentOwnerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
    parentWrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
  },
  unwrappedSubnameWrappedParentOwner: {
    ownerData: {
      ownershipLevel: 'registry',
      owner: ownerAddress,
    },
    parentOwnerData: {
      ownershipLevel: 'nameWrapper',
    },
    wrapperData: {
      fuseObj: {},
    },
    parentWrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
  },
}

describe('getFunctionCallDetails', () => {
  describe('Correct function call details', () => {
    describe('Unwrapped name', () => {
      it('for name owner who wants to send manager', () => {
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.unwrappedNameOwner

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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.unwrappedNameOwner

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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.unwrappedNameManager

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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.unwrappedSubnameManager

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.unwrappedSubnameUnwrappedParentManager

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.unwrappedSubnameUnwrappedParentOwner

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual(undefined)
      })

      it('for wrapped subname manager who wants to send manager', () => {
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedSubnameManagerParentUnwrapped

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedSubnameUnwrappedParentManager

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedSubnameUnwrappedParentOwner

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
          ownerData,
          parentOwnerData,
          wrapperData,
          parentWrapperData,
        })
        expect(result.sendManager).toEqual(undefined)
      })
    })

    describe('Wrapped name', () => {
      it('for name owner who wants to send owner', () => {
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedNameOwner

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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedNameManager

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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedSubnameManagerWrappedParent

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedSubnameOwnerWrappedParent

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedSubnameWrappedParentManager

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedSubnameWrappedParentOwner

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.wrappedSubnameWrappedParentOwner

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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
        const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
          userStates.unwrappedSubnameWrappedParentOwner

        const result = getFunctionCallDetails({
          address: account,
          name: subname,
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

describe('getPermittedActions', () => {
  describe('correct permissions', () => {
    it('should return for wrapped name owner', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedNameOwner

      const result = getPermittedActions({
        address: account,
        name,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: true,
        canSendManager: false,
      })
    })
    it('should return for unwrapped name owner', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.unwrappedNameOwner

      const result = getPermittedActions({
        address: account,
        name,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: true,
        canSendManager: true,
      })
    })
    it('should return for wrapped name manager', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedNameManager

      const result = getPermittedActions({
        address: account,
        name,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: true,
      })
    })
    it('should return for unwrapped name manager', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.unwrappedNameManager

      const result = getPermittedActions({
        address: account,
        name,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: true,
      })
    })

    it('should return for wrapped subname owner', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedSubnameOwnerWrappedParentManager

      const result = getPermittedActions({
        address: account,
        name,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: true,
        canSendManager: false,
      })
    })

    it.todo('should return for unwrapped subname owner')
    it.todo('should return for wrapped subname manager')
    it.todo('should return for unwrapped subname manager')

    it.todo('should return for wrapped subname parent owner (owner wrapped)')
    it.todo('should return for wrapped subname parent owner (owner unwrapped)')
    it.todo('should return for wrapped subname parent manager (owner wrapped)')
    it.todo('should return for wrapped subname parent manager (owner unwrapped)')

    it.todo('should return for wrapped subname parent owner (owner wrapped)')
    it.todo('should return for wrapped subname parent owner (owner unwrapped)')
    it.todo('should return for wrapped subname parent manager (owner wrapped)')
    it.todo('should return for wrapped subname parent manager (owner unwrapped)')
  })
})
