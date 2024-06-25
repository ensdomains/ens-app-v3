import { match } from 'ts-pattern'
import { describe, expect, it } from 'vitest'

import type { useBasicName } from '@app/hooks/useBasicName'

import { createAccounts } from '../../../../playwright/fixtures/accounts'
import { makeMockUseAbilitiesData } from '../../../../test/mock/makeMockUseAbilitiesData'
import { makeMockUseBasicName } from '../../../../test/mock/makeMockUseBasicName'
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
const account = createAccounts().getAddress('user')
const name = 'name.eth'
const subname = 'sub.nick.eth'

const partialUserStates = {
  unwrappedNameOwner: {
    basicNameData: makeMockUseBasicName('eth-unwrapped-2ld:owner'),
    parentBasicNameData: makeMockUseBasicName('eth'),
  },
  unwrappedNameManager: {
    basicNameData: makeMockUseBasicName('eth-unwrapped-2ld:manager'),
    parentBasicNameData: makeMockUseBasicName('eth'),
  },
  // TODO: add dns states
  unwrappedDNSOwner: {
    basicNameData: makeMockUseBasicName('dns-unwrapped-2ld:owner'),
    parentBasicNameData: makeMockUseBasicName('dns'),
  },
  unwrappedDNSManager: {
    basicNameData: makeMockUseBasicName('dns-unwrapped-2ld:manager'),
    parentBasicNameData: makeMockUseBasicName('dns'),
  },
  unwrappedSubnameManagerHolderUnwrappedParentManager: {
    basicNameData: makeMockUseBasicName('eth-unwrapped-2ld:manager'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-2ld:unowned'),
  },
  unwrappedSubnameUnwrappedParentManager: {
    basicNameData: makeMockUseBasicName('eth-unwrapped-2ld:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-2ld:manager'),
  },
  // This test doesn't make sense
  unwrappedSubnameManagerUnwrappedParentOwnerHolder: {
    basicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
      },
      wrapperData: {
        fuses: {
          child: {},
          parent: {},
        },
      },
    },
    parentBasicNameData: {
      ownerData: {
        ownershipLevel: 'registry',
        owner: '0xother',
      },
      wrapperData: {
        fuses: {
          child: {},
          parent: {},
        },
      },
    },
  },
  unwrappedSubnameManagerUnwrappedParentManagerHolder: {
    basicNameData: makeMockUseBasicName('eth-unwrapped-2ld:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-2ld:manager'),
  },
  wrappedSubnameManagerHolderUnwrappedParentManager: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-subname:unowned'),
  },
  wrappedSubnameManagerUnwrappedParentManager: {
    basicNameData: makeMockUseBasicName('eth-emancipated-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-subname'),
  },
  wrappedSubnameUnwrappedParentOwner: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-subname'),
  },
  wrappedNameOwner: {
    basicNameData: makeMockUseBasicName('eth-emancipated-2ld'),
    parentBasicNameData: makeMockUseBasicName('eth'),
  },
  wrappedNameCTBurnedOwner: {
    basicNameData: makeMockUseBasicName('eth-burnt-2ld'),
    parentBasicNameData: makeMockUseBasicName('eth'),
  },
  wrappedNameManager: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-subname:unowned'),
  },
  wrappedSubnameManagerHolderWrappedParentOwner: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname'),
    parentBasicNameData: makeMockUseBasicName('eth-emancipated-2ld:unowned'),
  },
  wrappedSubnameManagerWrappedParentOwnerHolder: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-emancipated-2ld'),
  },
  wrappedSubnameManagerWrappedParentManagerHolder: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-wrapped-subname'),
  },
  wrappedSubnameOwnerWrappedParentManager: {
    basicNameData: makeMockUseBasicName('eth-emancipated-subname'),
    parentBasicNameData: makeMockUseBasicName('eth-wrapped-subname:unowned'),
  },
  wrappedSubnameOwnerHolderWrappedParentOwnerHolder: {
    basicNameData: makeMockUseBasicName('eth-emancipated-subname'),
    parentBasicNameData: makeMockUseBasicName('eth-emancipated-2ld'),
  },
  wrappedSubnameOwnerHolderUnwrappedParentOwnerHolder: {
    basicNameData: makeMockUseBasicName('eth-emancipated-subname'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-2ld'),
  },
  wrappedSubnameWrappedParentManager: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-wrapped-subname'),
  },
  wrappedSubnameWrappedParentOwner: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-emancipated-2ld'),
  },
  unwrappedSubnameManagerWrappedParentOwner: {
    basicNameData: makeMockUseBasicName('eth-unwrapped-subname'),
    parentBasicNameData: makeMockUseBasicName('eth-emancipated-2ld:unowned'),
  },
  unwrappedSubnameManagerWrappedParentOwnerHolder: {
    basicNameData: makeMockUseBasicName('eth-unwrapped-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-emancipated-2ld'),
  },
  unwrappedSubnameManagerWrappedParentManagerHolder: {
    basicNameData: makeMockUseBasicName('eth-unwrapped-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-wrapped-subname'),
  },
  wrappedSubnameManagerUnwrappedParentOwnerHolder: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-subname'),
  },
  wrappedSubnameManagerUnwrappedParentManagerHolder: {
    basicNameData: makeMockUseBasicName('eth-wrapped-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-unwrapped-2ld:manager'),
  },
  wrappedSubnameOwnerWrappedParentOwnerHolder: {
    basicNameData: makeMockUseBasicName('eth-emancipated-subname:unowned'),
    parentBasicNameData: makeMockUseBasicName('eth-emancipated-2ld'),
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
          contract: 'registrar',
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
          contract: 'registrar',
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

    describe('DNS name', () => {
      it('for 2ld owner who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedDNSOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: 'nick.com',
        })
        expect(result.sendNameFunctionCallDetails?.sendOwner).toEqual(undefined)
      })

      it('for 2ld owner who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedDNSOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: 'nick.com',
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual(undefined)
      })

      it('for 2ld manager who wants to send owner', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedDNSManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: 'nick.com',
        })
        expect(result.sendNameFunctionCallDetails?.sendOwner).toEqual(undefined)
      })

      it('for 2ld manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedDNSManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: 'nick.com',
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'registry',
          method: 'setOwner',
        })
      })

      it('for 2ld wrapped name manager who wants to send manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedNameManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: 'nick.com',
        })
        expect(result.sendNameFunctionCallDetails?.sendManager).toEqual({
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
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

    describe('DNS names', () => {
      it('should return for unwrapped DNS name owner', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedDNSOwner

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: 'nick.com',
        })
        expect(result).toMatchObject({
          canSend: false,
        })
      })

      it('should return for unwrapped DNS name manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.unwrappedDNSManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: 'nick.com',
        })
        expect(result).toMatchObject({
          canSend: true,
          canSendManager: true,
          canSendOwner: false,
        })
      })

      it('should return for wrapped DNS name manager', () => {
        const { basicNameData, parentBasicNameData } = userStates.wrappedNameManager

        const result = getSendAbilities({
          basicNameData,
          parentBasicNameData,
          address: account,
          name: 'nick.com',
        })
        expect(result).toMatchObject({
          canSend: true,
          canSendManager: true,
          canSendOwner: false,
        })
      })
    })
  })
})

const mockGetSendAbilitiesConfig = {
  'eth-unwrapped-2ld:owner': {
    name: 'name.eth',
    basicNameType: 'eth-unwrapped-2ld:owner',
    parentBasicNameType: 'eth',
  },
} as const
type MockGetSendAbilitiesType = keyof typeof mockGetSendAbilitiesConfig
const mockGetSendAbilitiesTypes = Object.keys(
  mockGetSendAbilitiesConfig,
) as MockGetSendAbilitiesType[]
const makeMockGetSendAbilities = (type: MockGetSendAbilitiesType) => {
  return match(type)
    .with('eth-unwrapped-2ld:owner', () => ({
      canSend: true,
      canSendOwner: true,
      canSendManager: true,
      sendNameFunctionCallDetails: {
        sendManager: {
          contract: 'registrar',
          method: 'reclaim',
        },
        sendOwner: {
          contract: 'registrar',
          method: 'safeTransferFrom',
        },
      },
    }))
    .exhaustive()
}

describe('mocks', () => {
  it.each([mockGetSendAbilitiesTypes])('should return for %s', (type) => {
    const config = mockGetSendAbilitiesConfig[type]
    const { basicNameType, parentBasicNameType, name: name_ } = config
    const result = getSendAbilities({
      basicNameData: makeMockUseBasicName(basicNameType),
      parentBasicNameData: makeMockUseBasicName(parentBasicNameType),
      address: account,
      name: name_,
    })
    const expected = makeMockUseAbilitiesData(type)
    expect(expected).toMatchObject(result)
  })
})
