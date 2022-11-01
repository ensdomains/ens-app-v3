import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { getFunctionCallDetails, getPermittedActions } from './SendName-flow'

const ownerAddress = '0x123'
const account = ownerAddress
const name = 'nick.eth'
const subname = 'sub.nick.eth'

/*
  userStates

  For subnames, the name is split into two parts which describe 
  the states of the subname and the parent name. "Holder" refers 
  to which name the user is currently holding. If the user holds 
  both then "Hoder" will be appended to both sections of the name.
*/

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
  unwrappedSubnameManagerUnwrappedParentOwnerHolder: {
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
      fuseObj: {},
    },
  },
  unwrappedSubnameManagerUnwrappedParentManagerHolder: {
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
      fuseObj: {},
    },
  },
  wrappedSubnameManagerHolderUnwrappedParentManager: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
    parentOwnerData: {
      ownershipLevel: 'registry',
    },
    parentWrapperData: {
      fuseObj: {},
    },
  },
  wrappedSubnameManagerUnwrappedParentManager: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
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
  wrappedSubnameManagerHolderWrappedParentOwner: {
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
    parentWrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
  },
  wrappedSubnameManagerWrappedParentOwnerHolder: {
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
  wrappedSubnameManagerWrappedParentManagerHolder: {
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
  wrappedSubnameOwnerHolderWrappedParentOwnerHolder: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    parentOwnerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
    parentWrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
  },
  wrappedSubnameOwnerHolderUnwrappedParentOwnerHolder: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
    },
    parentOwnerData: {
      ownershipLevel: 'baseRegistrar',
      owner: ownerAddress,
      registrant: ownerAddress,
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
    parentWrapperData: {
      fuseObj: {},
    },
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
  unwrappedSubnameManagerWrappedParentOwner: {
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
  unwrappedSubnameManagerWrappedParentOwnerHolder: {
    ownerData: {
      ownershipLevel: 'registry',
    },
    parentOwnerData: {
      ownershipLevel: 'nameWrapper',
      owner: ownerAddress,
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
  unwrappedSubnameManagerWrappedParentManagerHolder: {
    ownerData: {
      ownershipLevel: 'registry',
    },
    parentOwnerData: {
      ownershipLevel: 'nameWrapper',
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
  wrappedSubnameManagerUnwrappedParentOwnerHolder: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
    },
    parentOwnerData: {
      ownershipLevel: 'baseRegsitrar',
      owner: ownerAddress,
      registrant: ownerAddress,
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
    parentWrapperData: {
      fuseObj: {},
    },
  },
  wrappedSubnameManagerUnwrappedParentManagerHolder: {
    ownerData: {
      ownershipLevel: 'nameWrapper',
    },
    parentOwnerData: {
      ownershipLevel: 'baseRegsitrar',
      owner: ownerAddress,
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: false,
      },
    },
    parentWrapperData: {
      fuseObj: {},
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
          userStates.unwrappedSubnameManagerUnwrappedParentOwnerHolder

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
          userStates.wrappedSubnameManagerHolderUnwrappedParentManager

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
          userStates.wrappedSubnameManagerUnwrappedParentManager

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
          userStates.wrappedSubnameManagerHolderUnwrappedParentManager

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
          userStates.wrappedSubnameOwnerWrappedParentManager

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
          userStates.unwrappedSubnameManagerWrappedParentOwner

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
        name: subname,
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

    it('should return for unwrapped subname owner', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.unwrappedSubnameManagerWrappedParentOwner

      const result = getPermittedActions({
        address: account,
        name: subname,
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
    it('should return for wrapped subname manager', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedSubnameManagerHolderWrappedParentOwner

      const result = getPermittedActions({
        address: account,
        name: subname,
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
    it('should return for unwrapped subname manager holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.unwrappedSubnameManagerWrappedParentOwner

      const result = getPermittedActions({
        address: account,
        name: subname,
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

    it('should return for wrapped subname manager, wrapped parent owner holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedSubnameManagerWrappedParentOwnerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
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
    it('should return for wrapped subname, unwrapped parent owner holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedSubnameManagerUnwrappedParentOwnerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for wrapped subname, wrapped parent manager holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedSubnameManagerWrappedParentManagerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
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
    it('should return for wrapped subname, unwrapped parent manager holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedSubnameManagerUnwrappedParentManagerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })

    it('should return for unwrapped subname, wrapped parent owner holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.unwrappedSubnameManagerWrappedParentOwnerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped subname, unwrapped parent owner holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.unwrappedSubnameManagerUnwrappedParentOwnerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped subname, wrapped parent manager holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.unwrappedSubnameManagerWrappedParentManagerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped subname, unwrapped parent manager holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.unwrappedSubnameManagerUnwrappedParentManagerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
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

    it('should return for wrapped subname owner holder, wrapped parent owner holder', () => {
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedSubnameOwnerHolderWrappedParentOwnerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
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

    it('should return for wrapped subname owner holder, unwrapped parent owner holder', () => {
      // This state should not be possible as parent cannot burn PCC
      const { ownerData, parentOwnerData, wrapperData, parentWrapperData } =
        userStates.wrappedSubnameOwnerHolderUnwrappedParentOwnerHolder

      const result = getPermittedActions({
        address: account,
        name: subname,
        ownerData,
        parentOwnerData,
        wrapperData,
        parentWrapperData,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    // Should not be possible
    it.todo('should return for unwrapped subname owner holder, wrapped parent owner holder')
    // Should not be possible
    it.todo('should return for unwrapped subname owner holder, unwrapped parent owner holder')
  })
})
