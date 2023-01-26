import { mockFunction, renderHook } from '@app/test-utils'

import { useBasicName } from '@app/hooks/useBasicName'

import { getFunctionCallDetails, getPermittedActions, useSelfAbilities } from './useSelfAbilities'

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

type BasicNameData = ReturnType<typeof useBasicName>

type PartialBasicNameData = DeepPartial<BasicNameData>

type PartialMockData = {
  [key: string]: {
    basicNameData: PartialBasicNameData
    parentBasicNameData: PartialBasicNameData
  }
}

type MockData = {
  [key: string]: {
    basicNameData: BasicNameData
    parentBasicNameData: BasicNameData
  }
}

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

const partialUserStates = {
  unwrappedNameOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: '0xnotOwner',
        registrant: ownerAddress,
      },
      wrapperData: {
        ownershipLevel: 'registry',
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
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
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  unwrappedSubnameManagerHolderUnwrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  unwrappedSubnameUnwrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
  },
  unwrappedSubnameManagerUnwrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: '0xother',
        registrant: ownerAddress,
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  unwrappedSubnameManagerUnwrappedParentManagerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
      },
      wrapperData: {
        child: {},
        parent: {},
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
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  wrappedSubnameManagerUnwrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  wrappedSubnameUnwrappedParentOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: ownerAddress,
        registrant: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
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
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  wrappedNameCTBurnedOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        child: {
          CANNOT_TRANSFER: true,
        },
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  wrappedNameManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  wrappedSubnameManagerHolderWrappedParentOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
      },
    },
  },
  wrappedSubnameManagerWrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
      },
    },
  },
  wrappedSubnameManagerWrappedParentManagerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
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
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  wrappedSubnameOwnerHolderWrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
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
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registrar',
        owner: ownerAddress,
        registrant: ownerAddress,
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  wrappedSubnameWrappedParentManager: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
  },
  wrappedSubnameWrappedParentOwner: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
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
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
      },
    },
  },
  unwrappedSubnameManagerWrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {},
      },
    },
  },
  unwrappedSubnameManagerWrappedParentManagerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: ownerAddress,
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
  },
  wrappedSubnameManagerUnwrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registrar',
        owner: ownerAddress,
        registrant: ownerAddress,
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
  wrappedSubnameManagerUnwrappedParentManagerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {},
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registrar',
        owner: ownerAddress,
      },
      wrapperData: {
        child: {},
        parent: {},
      },
    },
  },
} as PartialMockData

const userStates = { ...partialUserStates } as MockData

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
        child: {
          CANNOT_TRANSFER: true,
        },
      },
    })
    const { result } = renderHook(() => useSelfAbilities(name, account))
    expect(result.current.canSend).toBe(false)
  })
})
