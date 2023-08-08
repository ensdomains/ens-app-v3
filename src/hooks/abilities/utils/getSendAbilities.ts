import { P, match } from 'ts-pattern'

import { checkETH2LDFromName, checkSubname } from '@app/utils/utils'

import type { useBasicName } from '../../useBasicName'
import type { SendAbilities } from '../useAbilities'

type BasicName = ReturnType<typeof useBasicName>

type ContractDetails = SendAbilities['sendNameFunctionCallDetails']

const BASE_RESPONSE: SendAbilities = {
  canSend: false,
  canSendOwner: false,
  canSendManager: false,
  sendNameFunctionCallDetails: undefined,
  canSendError: undefined,
}

const CONTRACT_INFO = {
  unwrappedName: {
    pattern: {
      ownerData: {
        ownershipLevel: P.not('nameWrapper'),
        registrant: P.select('registrant'),
      },
    },
    guard: (address?: string) => (name: BasicName) => {
      const registrant = name.ownerData?.registrant
      const owner = name.ownerData?.owner
      return registrant === address || owner === address
    },
    owner: {
      sendManager: {
        contract: 'baseRegistrar',
        method: 'reclaim',
      },
      sendOwner: {
        contract: 'baseRegistrar',
        method: 'safeTransferFrom',
      },
    },
    manager: {
      sendManager: {
        contract: 'registry',
        method: 'setOwner',
      },
    },
  },
  wrappedName: {
    pattern: {
      ownerData: { ownershipLevel: 'nameWrapper' },
      wrapperData: {
        parent: { PARENT_CANNOT_CONTROL: true },
        child: { CANNOT_TRANSFER: false },
      },
    },
    guard: (address?: string) => (name: BasicName) => {
      const owner = name.ownerData?.owner
      return owner === address
    },
    owner: {
      sendOwner: {
        contract: 'nameWrapper',
        method: 'safeTransferFrom',
      },
    },
    // A wrapped name cannot be a manager since PCC is automatically burned
    manager: undefined,
  },
  wrappedSubname: {
    wrappedParent: {
      pattern: [
        {
          ownerData: {
            ownershipLevel: 'nameWrapper',
            owner: P.select('subnameOwner'),
          },
          wrapperData: {
            parent: { PARENT_CANNOT_CONTROL: P.select('pccBurned') },
            child: { CANNOT_TRANSFER: false },
          },
        },
        {
          ownerData: {
            ownershipLevel: 'nameWrapper',
          },
          wrapperData: {
            parent: { PARENT_CANNOT_CONTROL: P.select('parentPCCBurned') },
          },
        },
      ],
      guard:
        (address?: string) =>
        ([subname, parent]: [BasicName, BasicName]) => {
          const subnameOwner = subname.ownerData?.owner
          const parentOwner = parent.ownerData?.owner
          return subnameOwner === address || parentOwner === address
        },
      subnameOwner: {
        sendOwner: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      subnameManager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      parentManager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        },
      },
      parentOwner: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        },
      },
    },
    unwrappedParent: {
      pattern: [
        {
          ownerData: {
            ownershipLevel: 'nameWrapper',
            owner: P.select('subnameOwner'),
          },
          wrapperData: {
            parent: { PARENT_CANNOT_CONTROL: P.select('pccBurned') },
            child: { CANNOT_TRANSFER: false },
          },
        },
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
            owner: P.select('parentOwner'),
            registrant: P.optional(P.select('parentRegistrant')),
          },
        },
      ],
      guard:
        (address?: string) =>
        ([subname, parent]: [BasicName, BasicName]) => {
          const subnameOwner = subname.ownerData?.owner
          const parentOwner = parent.ownerData?.owner
          const parentRegistrant = parent.ownerData?.registrant
          return subnameOwner === address || parentOwner === address || parentRegistrant === address
        },
      subnameManager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      // This state should never happen as the parent is unwrapped and cannot burn PCC
      subnameOwner: undefined,
      // We shouldn't actually do this! Will forcibly unwrap the name
      // sendManager: {
      //   contract: 'registry',
      //   method: 'setSubnodeOwner',
      // },
      parentManager: undefined,
      // Will require setting yourself as manager first
      // sendManager: [],
      parentOwner: undefined,
    },
  },
  unwrappedSubname: {
    unwrappedParent: {
      pattern: [
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
            owner: P.select('subnameOwner'),
          },
        },
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
            owner: P.select('parentOwner'),
          },
        },
      ],
      guard:
        (address?: string) =>
        ([subname, parent]: [BasicName, BasicName]) => {
          const subnameOwner = subname.ownerData?.owner
          const parentOwner = parent.ownerData?.owner
          const parentRegistrant = parent.ownerData?.registrant
          return subnameOwner === address || parentOwner === address || parentRegistrant === address
        },
      subnameManager: {
        sendManager: {
          contract: 'registry',
          method: 'setOwner',
        },
      },
      subnameOwner: undefined,
      parentManager: {
        sendManager: {
          contract: 'registry',
          method: 'setSubnodeOwner',
        },
      },
      // We shouldn't actually do this!
      // In parent change controller, then do what you would do as controller
      // sendManager: [],
      parentOwner: undefined,
    },
    wrappedParent: {
      pattern: [
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
            owner: P.select('subnameOwner'),
          },
        },
        {
          ownerData: { ownershipLevel: 'nameWrapper' },
          wrapperData: {
            parent: { PARENT_CANNOT_CONTROL: P.select('parentPCCBurned') },
          },
        },
      ],
      guard:
        (address?: string) =>
        ([subname, parent]: [BasicName, BasicName]) => {
          const subnameOwner = subname.ownerData?.owner
          const parentOwner = parent.ownerData?.owner
          return subnameOwner === address || parentOwner === address
        },
      subnameManager: {
        sendManager: {
          contract: 'registry',
          method: 'setOwner',
        },
      },
      // Unwrapped subname cannot have an owner
      subnameOwner: undefined,
      // Must forcibly wrap subname or unwrap parent
      // sendManager: [],
      parentManager: undefined,
      // Must forcibly wrap subname or unwrap parent
      // sendManager: [],
      parentOwner: undefined,
    },
  },
} as const

const get2LDEthAbilities = ({
  address,
  basicNameData,
}: {
  address?: string
  basicNameData: BasicName
}): SendAbilities => {
  return match(basicNameData)
    .with(CONTRACT_INFO.wrappedName.pattern, CONTRACT_INFO.wrappedName.guard(address), () => {
      const sendNameFunctionCallDetails = CONTRACT_INFO.wrappedName.owner as ContractDetails
      const canSendOwner = !!sendNameFunctionCallDetails?.sendOwner
      const canSendManager = !!sendNameFunctionCallDetails?.sendManager
      const canSend = canSendOwner || canSendManager
      return {
        canSend,
        canSendOwner,
        canSendManager,
        sendNameFunctionCallDetails,
      } as SendAbilities
    })
    .with(
      CONTRACT_INFO.unwrappedName.pattern,
      CONTRACT_INFO.unwrappedName.guard(address),
      ({ registrant }) => {
        const isOwner = registrant === address
        const sendNameFunctionCallDetails = CONTRACT_INFO.unwrappedName[
          isOwner ? 'owner' : 'manager'
        ] as ContractDetails
        const canSendOwner = !!sendNameFunctionCallDetails?.sendOwner
        const canSendManager = !!sendNameFunctionCallDetails?.sendManager
        const canSend = canSendOwner || canSendManager
        return {
          canSend,
          canSendOwner,
          canSendManager,
          sendNameFunctionCallDetails,
        } as SendAbilities
      },
    )
    .otherwise(({ wrapperData }) => ({
      ...BASE_RESPONSE,
      ...(wrapperData?.child?.CANNOT_TRANSFER ? { canSendError: 'permissionRevoked' } : {}),
    }))
}

const getSubnameContractRole = (isSubname: boolean, isManager: boolean) =>
  match([isSubname, isManager])
    .with([true, false], () => 'subnameOwner' as const)
    .with([true, true], () => 'subnameManager' as const)
    .with([false, false], () => 'parentOwner' as const)
    .with([false, true], () => 'parentManager' as const)
    .exhaustive()

const getSubnameAbilities = ({
  address,
  basicNameData,
  parentBasicNameData,
}: {
  address?: string
  basicNameData: BasicName
  parentBasicNameData: BasicName
}): SendAbilities => {
  return match([basicNameData, parentBasicNameData])
    .with(
      CONTRACT_INFO.wrappedSubname.wrappedParent.pattern,
      CONTRACT_INFO.wrappedSubname.wrappedParent.guard(address),
      ({ subnameOwner, pccBurned, parentPCCBurned }) => {
        const isSubname = subnameOwner === address
        const isManager = isSubname ? !pccBurned : !parentPCCBurned
        const role = getSubnameContractRole(isSubname, isManager)
        const sendNameFunctionCallDetails = CONTRACT_INFO.wrappedSubname.wrappedParent[
          role
        ] as ContractDetails
        const canSendOwner = !!sendNameFunctionCallDetails?.sendOwner
        const canSendManager = !!sendNameFunctionCallDetails?.sendManager
        const canSend = canSendOwner || canSendManager
        if (!isSubname && pccBurned) return BASE_RESPONSE
        return {
          canSend,
          canSendOwner,
          canSendManager,
          sendNameFunctionCallDetails,
        } as SendAbilities
      },
    )
    .with(
      CONTRACT_INFO.unwrappedSubname.unwrappedParent.pattern,
      CONTRACT_INFO.unwrappedSubname.unwrappedParent.guard(address),
      ({ subnameOwner, parentOwner }) => {
        const isSubname = subnameOwner === address
        const isManager = isSubname ? true : parentOwner === address
        const role = getSubnameContractRole(isSubname, isManager)
        const sendNameFunctionCallDetails = CONTRACT_INFO.unwrappedSubname.unwrappedParent[
          role
        ] as ContractDetails
        const canSendOwner = !!sendNameFunctionCallDetails?.sendOwner
        const canSendManager = !!sendNameFunctionCallDetails?.sendManager
        const canSend = canSendOwner || canSendManager
        return {
          canSend,
          canSendOwner,
          canSendManager,
          sendNameFunctionCallDetails,
        } as SendAbilities
      },
    )
    .with(
      CONTRACT_INFO.wrappedSubname.unwrappedParent.pattern,
      CONTRACT_INFO.wrappedSubname.unwrappedParent.guard(address),
      ({ subnameOwner, pccBurned, parentOwner }) => {
        const isSubname = subnameOwner === address
        const isManager = isSubname ? !pccBurned : parentOwner === address
        const role = getSubnameContractRole(isSubname, isManager)
        const sendNameFunctionCallDetails = CONTRACT_INFO.wrappedSubname.unwrappedParent[
          role
        ] as ContractDetails
        const canSendOwner = !!sendNameFunctionCallDetails?.sendOwner
        const canSendManager = !!sendNameFunctionCallDetails?.sendManager
        const canSend = canSendOwner || canSendManager
        if (!isSubname && pccBurned) return BASE_RESPONSE
        return {
          canSend,
          canSendOwner,
          canSendManager,
          sendNameFunctionCallDetails,
        } as SendAbilities
      },
    )
    .with(
      CONTRACT_INFO.unwrappedSubname.wrappedParent.pattern,
      CONTRACT_INFO.unwrappedSubname.wrappedParent.guard(address),
      ({ subnameOwner, parentPCCBurned }) => {
        const isSubname = subnameOwner === address
        const isManager = isSubname ? true : !parentPCCBurned
        const role = getSubnameContractRole(isSubname, isManager)
        const sendNameFunctionCallDetails = CONTRACT_INFO.unwrappedSubname.wrappedParent[
          role
        ] as ContractDetails
        const canSendOwner = !!sendNameFunctionCallDetails?.sendOwner
        const canSendManager = !!sendNameFunctionCallDetails?.sendManager
        const canSend = canSendOwner || canSendManager
        return {
          canSend,
          canSendOwner,
          canSendManager,
          sendNameFunctionCallDetails,
        } as SendAbilities
      },
    )
    .otherwise(([{ wrapperData }]) => ({
      ...BASE_RESPONSE,
      ...(wrapperData?.child?.CANNOT_TRANSFER ? { canSendError: 'permissionRevoked' } : {}),
    }))
}

export const getSendAbilities = ({
  name,
  address,
  basicNameData,
  parentBasicNameData,
}: {
  name: string
  address?: string
  basicNameData: BasicName
  parentBasicNameData: BasicName
}) => {
  if (checkETH2LDFromName(name)) return get2LDEthAbilities({ address, basicNameData })
  if (checkSubname(name))
    return getSubnameAbilities({ address, basicNameData, parentBasicNameData })
  return BASE_RESPONSE
}
