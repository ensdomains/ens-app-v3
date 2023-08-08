import type { useBasicName } from '@app/hooks/useBasicName'

import { getSendAbilities } from './getSendAbilities'

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

const ownerAddress = '0x123'
const account = ownerAddress
const name = 'nick.eth'
const subname = 'sub.nick.eth'

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
        owner: '0x000',
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
        owner: '0x000',
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
        owner: '0x000',
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
        child: {
          CANNOT_TRANSFER: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: '0x000',
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
        child: {
          CANNOT_TRANSFER: false,
        },
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
        child: {
          CANNOT_TRANSFER: false,
        },
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
        child: {
          CANNOT_TRANSFER: false,
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
        child: {
          CANNOT_TRANSFER: false,
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
        child: {
          CANNOT_TRANSFER: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: '0x000',
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
        owner: '0x000',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {
          CANNOT_TRANSFER: false,
        },
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
        owner: '0x000',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {
          CANNOT_TRANSFER: false,
        },
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
        child: {
          CANNOT_TRANSFER: false,
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: '0x000',
      },
      wrapperData: {
        child: {},
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
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
        child: {
          CANNOT_TRANSFER: false,
        },
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
        child: {
          CANNOT_TRANSFER: false,
        },
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
        owner: '0x000',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {
          CANNOT_TRANSFER: false,
        },
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
        owner: '0x000',
      },
      wrapperData: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
        },
        child: {
          CANNOT_TRANSFER: false,
        },
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
        child: {
          CANNOT_TRANSFER: false,
        },
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
        child: {
          CANNOT_TRANSFER: false,
        },
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
  wrappedSubnameOwnerWrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'nameWrapper',
      },
      wrapperData: {
        child: {
          CANNOT_TRANSFER: false,
        },
        parent: {
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
        parent: {
          PARENT_CANNOT_CONTROL: true,
        },
        child: {
          CANNOT_TRANSFER: false,
        },
      },
    },
  },
} as PartialMockData

const userStates = { ...partialUserStates } as MockData

describe('getSendAbilities', () => {
  describe('Correct function call details', () => {
    describe('Unwrapped name', () => {
      it('for name owner who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedNameOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'baseRegistrar',
          method: 'reclaim',
        })
      })

      it('for name owner who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedNameOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result.sendNameFunctionCallDetails?.sendOwner).toEqual({
          contract: 'baseRegistrar',
          method: 'safeTransferFrom',
        })
      })

      it('for name manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedNameManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'registry',
          method: 'setOwner',
        })
      })

      it('for subname manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.unwrappedSubnameManagerHolderUnwrappedParentManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'registry',
          method: 'setOwner',
        })
      })

      it('for subname parent manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.unwrappedSubnameUnwrappedParentManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'registry',
          method: 'setSubnodeOwner',
        })
      })

      it('for subname parent owner who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.unwrappedSubnameManagerUnwrappedParentOwnerHolder

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual(undefined)
      })

      it('for wrapped subname manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.wrappedSubnameManagerHolderUnwrappedParentManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname parent manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.wrappedSubnameManagerUnwrappedParentManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual(undefined)
      })
      it('for wrapped subname parent owner who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedSubnameUnwrappedParentOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual(undefined)
      })
    })

    describe('Wrapped name', () => {
      it('for name owner who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedNameOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result.sendNameFunctionCallDetails?.sendOwner).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for name manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedNameManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })

        expect(result.sendNameFunctionCallDetails?.sendManager).toBeUndefined()
      })
      it('for wrapped subname manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.wrappedSubnameManagerHolderUnwrappedParentManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname owner who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.wrappedSubnameOwnerWrappedParentManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendOwner).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        })
      })
      it('for wrapped subname parent manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedSubnameWrappedParentManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        })
      })
      it('for wrapped subname parent owner who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedSubnameWrappedParentOwner
        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        })
      })
      it('for wrapped subname parent owner who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedSubnameWrappedParentOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendOwner).toBeUndefined()
      })
      it('for subname manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.unwrappedSubnameManagerWrappedParentOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'registry',
          method: 'setOwner',
        })
      })
    })
  })
  describe('correct permissions', () => {
    it('should return for wrapped name owner', () => {
      const { basicNameData, parentBasicNameData } = userStates.wrappedNameOwner

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name,
      })
      expect(result).toMatchObject({
        canSendOwner: true,
        canSendManager: false,
      })
    })
    it('should return for unwrapped name owner', () => {
      const { basicNameData, parentBasicNameData } = userStates.unwrappedNameOwner

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name,
      })
      expect(result).toMatchObject({
        canSendOwner: true,
        canSendManager: true,
      })
    })
    it('should return for wrapped name manager', () => {
      const { basicNameData, parentBasicNameData } = userStates.wrappedNameManager

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped name manager', () => {
      const { basicNameData, parentBasicNameData } = userStates.unwrappedNameManager

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: true,
      })
    })

    it('should return for wrapped subname owner', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameOwnerWrappedParentManager

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: true,
        canSendManager: false,
      })
    })

    it('should return for unwrapped subname owner', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerWrappedParentOwner

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: true,
      })
    })
    it('should return for wrapped subname manager', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerHolderWrappedParentOwner

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: true,
      })
    })
    it('should return for unwrapped subname manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerWrappedParentOwner

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: true,
      })
    })

    it('should return for wrapped subname manager, wrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerWrappedParentOwnerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: true,
      })
    })
    it('should return for wrapped subname, unwrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerUnwrappedParentOwnerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for wrapped subname, wrapped parent manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerWrappedParentManagerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: true,
      })
    })
    it('should return for wrapped subname, unwrapped parent manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameManagerUnwrappedParentManagerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: false,
      })
    })

    it('should return for unwrapped subname, wrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerWrappedParentOwnerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped subname, unwrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerUnwrappedParentOwnerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped subname, wrapped parent manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerWrappedParentManagerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    it('should return for unwrapped subname, unwrapped parent manager holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.unwrappedSubnameManagerUnwrappedParentManagerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: true,
      })
    })

    it('should return for wrapped subname owner holder, wrapped parent owner holder', () => {
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameOwnerHolderWrappedParentOwnerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: true,
        canSendManager: false,
      })
    })

    it('should return for wrapped subname owner holder, unwrapped parent owner holder', () => {
      // This state should not be possible as parent cannot burn PCC
      const { basicNameData, parentBasicNameData } =
        userStates.wrappedSubnameOwnerHolderUnwrappedParentOwnerHolder

      const result = getSendAbilities({
        basicNameData,
        parentBasicNameData,
        address: account,
        name: subname,
      })
      expect(result).toMatchObject({
        canSendOwner: false,
        canSendManager: false,
      })
    })
    // Should not be possible
    it.todo('should return for unwrapped subname owner holder, wrapped parent owner holder')
    // Should not be possible
    it.todo('should return for unwrapped subname owner holder, unwrapped parent owner holder')

    describe('PARENT_CANNOT_CONTROL burned', () => {
      // wrappedSubnameOwnerWrappedParentOwnerHolder
      it('should return for wrapped name with PCC burned and parent owner holder', () => {
        const { basicNameData, parentBasicNameData } =
          userStates.wrappedSubnameOwnerWrappedParentOwnerHolder

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result).toMatchObject({
          canSend: false,
        })
      })
    })
    describe('CANNOT_TRANSFER burned', () => {
      it('should return for wrapped name with CANNOT_TRANSFER burned', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedNameCTBurnedOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name,
        })
        expect(result).toMatchObject({
          canSend: false,
          canSendError: 'permissionRevoked',
        })
      })

      it('should return for wrapped subname name with CANNOT_TRANSFER burned', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedNameCTBurnedOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: subname,
        })
        expect(result).toMatchObject({
          canSend: false,
          canSendError: 'permissionRevoked',
        })
      })
    })
  })
})
