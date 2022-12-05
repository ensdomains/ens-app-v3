import { mockFunction, renderHook } from '@app/test-utils'

import { useBasicName } from '@app/hooks/useBasicName'

import { getFunctionCallDetails, getPermittedActions, useSelfAbilities } from './useSelfAbilities'

jest.mock('@app/hooks/useBasicName')
const mockUseBasicName = mockFunction(useBasicName)

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
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: '0xnotOwner',
        registrant: ownerAddress,
      },
      wrapperData: {
        ownershipLevel: 'registry',
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {},
    },
  },
  unwrappedNameManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
        registrant: '0xnotOwner',
      },
      wrapperData: {
        fuseObj: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {},
    },
  },
  unwrappedSubnameManagerHolderUnwrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {},
    },
  },
  unwrappedSubnameUnwrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        fuseObj: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
  },
  unwrappedSubnameManagerUnwrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        fuseObj: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: '0xother',
        registrant: ownerAddress,
      },
      wrapperData: {
        fuseObj: {},
      },
    },
  },
  unwrappedSubnameManagerUnwrappedParentManagerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        fuseObj: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {},
      },
    },
  },
  wrappedSubnameManagerHolderUnwrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        fuseObj: {},
      },
    },
  },
  wrappedSubnameManagerUnwrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {},
      },
    },
  },
  wrappedSubnameUnwrappedParentOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
        registrant: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
  },
  wrappedNameOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {},
    },
  },
  wrappedNameCTBurnedOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
          CANNOT_TRANSFER: true,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {},
    },
  },
  wrappedNameManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {},
    },
  },
  wrappedSubnameManagerHolderWrappedParentOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
  },
  wrappedSubnameManagerWrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
  },
  wrappedSubnameManagerWrappedParentManagerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
  },
  wrappedSubnameOwnerWrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {},
    },
  },
  wrappedSubnameOwnerHolderWrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
  },
  wrappedSubnameOwnerHolderUnwrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'baseRegistrar',
        owner: ownerAddress,
        registrant: ownerAddress,
      },
      wrapperData: {
        fuseObj: {},
      },
    },
  },
  wrappedSubnameWrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
  },
  wrappedSubnameWrappedParentOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
  },
  unwrappedSubnameManagerWrappedParentOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
  },
  unwrappedSubnameManagerWrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        fuseObj: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
  },
  unwrappedSubnameManagerWrappedParentManagerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        fuseObj: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
  },
  wrappedSubnameManagerUnwrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'baseRegsitrar',
        owner: ownerAddress,
        registrant: ownerAddress,
      },
      wrapperData: {
        fuseObj: {},
      },
    },
  },
  wrappedSubnameManagerUnwrappedParentManagerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        fuseObj: {
          PARENT_CANNOT_CONTROL: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'baseRegsitrar',
        owner: ownerAddress,
      },
      wrapperData: {
        fuseObj: {},
      },
    },
  },
}

describe('getFunctionCallDetails', () => {
  describe('Correct function call details', () => {
    describe('Unwrapped name', () => {
      it('for name owner who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedNameOwner

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result.sendManager).toEqual({
          contract: 'baseRegistrar',
          method: 'reclaim',
        })
      })

      it('for name owner who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedNameOwner

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result.sendOwner).toEqual({
          contract: 'baseRegistrar',
          method: 'safeTransferFrom',
        })
      })

      it('for name manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedNameManager

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result.sendManager).toEqual({
          contract: 'registry',
          method: 'setOwner',
        })
      })

      it('for subname manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.unwrappedSubnameManagerHolderUnwrappedParentManager

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendManager).toEqual({
          contract: 'registry',
          method: 'setOwner',
        })
      })

      it('for subname parent manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.unwrappedSubnameUnwrappedParentManager

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendManager).toEqual({
          contract: 'registry',
          method: 'setSubnodeOwner',
        })
      })

      it('for subname parent owner who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.unwrappedSubnameManagerUnwrappedParentOwnerHolder

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendManager).toEqual(undefined)
      })

      it('for wrapped subname manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.wrappedSubnameManagerHolderUnwrappedParentManager

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname parent manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.wrappedSubnameManagerUnwrappedParentManager

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendManager).toEqual(undefined)
      })
      it('for wrapped subname parent owner who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedSubnameUnwrappedParentOwner

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendManager).toEqual(undefined)
      })
    })

    describe('Wrapped name', () => {
      it('for name owner who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedNameOwner

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result.sendOwner).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for name manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedNameManager

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.wrappedSubnameManagerHolderUnwrappedParentManager

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname owner who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.wrappedSubnameOwnerWrappedParentManager

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendOwner).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname parent manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedSubnameWrappedParentManager

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        })
      })
      it('for wrapped subname parent owner who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedSubnameWrappedParentOwner

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        })
      })
      it('for wrapped subname parent owner who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedSubnameWrappedParentOwner

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendOwner).toEqual({
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        })
      })
      it('for subname manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.unwrappedSubnameManagerWrappedParentOwner

        const result = getFunctionCallDetails({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
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
      const { basicNameData, parentBasicNameData } = userStates.wrappedNameOwner

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name,
      })
      expect(result).toEqual({
        canSendOwner: true,
        canSendManager: false,
      })
    })
    it('should return for unwrapped name owner', () => {
      const { basicNameData, parentBasicNameData } = userStates.unwrappedNameOwner

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name,
      })
      expect(result).toEqual({
        canSendOwner: true,
        canSendManager: true,
      })
    })
    it('should return for wrapped name manager', () => {
      const { basicNameData, parentBasicNameData } = userStates.wrappedNameManager

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: true,
      })
    })
    it('should return for unwrapped name manager', () => {
      const { basicNameData, parentBasicNameData } = userStates.unwrappedNameManager

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: true,
      })
    })

    it('should return for wrapped subname owner', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameOwnerWrappedParentManager

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: true,
        canSendManager: false,
      })
    })

    it('should return for unwrapped subname owner', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerWrappedParentOwner

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: true,
      })
    })
    it('should return for wrapped subname manager', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerHolderWrappedParentOwner

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: true,
      })
    })
    it('should return for unwrapped subname manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerWrappedParentOwner

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: true,
      })
    })

    it('should return for wrapped subname manager, wrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerWrappedParentOwnerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: true,
        canSendManager: true,
      })
    })
    it('should return for wrapped subname, unwrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerUnwrappedParentOwnerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for wrapped subname, wrapped parent manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerWrappedParentManagerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: true,
      })
    })
    it('should return for wrapped subname, unwrapped parent manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerUnwrappedParentManagerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })

    it('should return for unwrapped subname, wrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerWrappedParentOwnerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped subname, unwrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerUnwrappedParentOwnerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped subname, wrapped parent manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerWrappedParentManagerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped subname, unwrapped parent manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerUnwrappedParentManagerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: false,
        canSendManager: true,
      })
    })

    it('should return for wrapped subname owner holder, wrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameOwnerHolderWrappedParentOwnerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toEqual({
        canSendOwner: true,
        canSendManager: false,
      })
    })

    it('should return for wrapped subname owner holder, unwrapped parent owner holder', () => {
      // This state should not be possible as parent cannot burn PCC
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameOwnerHolderUnwrappedParentOwnerHolder

      const result = getPermittedActions({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
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

describe('useSelfAbilities', () => {
  it('should return false for all send abilities if CANNOT_TRANSFER has been burned', () => {
    mockUseBasicName.mockReturnValue({
      wrapperData: {
        fuseObj: {
          CANNOT_TRANSFER: true,
        },
      },
    })
    const { result } = renderHook(() => useSelfAbilities(name, account))
    expect(result.current.canSend).toBe(false)
  })
})
