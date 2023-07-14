import { P, match } from 'ts-pattern'

import { checkETH2LDFromName, checkSubname } from '@app/utils/utils'

import type { useBasicName } from '../../useBasicName'
import type { SendAbilities } from '../useAbilities'

type BasicName = ReturnType<typeof useBasicName>

const BASE_RESPONSE: SendAbilities = {
  canSend: false,
  canSendOwner: false,
  canSendManager: false,
  sendNameFunctionCallDetails: undefined,
  canSendError: undefined,
}

type NameContract = {
  owner: SendAbilities['sendNameFunctionCallDetails']
  manager: SendAbilities['sendNameFunctionCallDetails']
}

type SubnameContract = {
  subnameOwner: SendAbilities['sendNameFunctionCallDetails']
  subnameManager: SendAbilities['sendNameFunctionCallDetails']
  parentOwner: SendAbilities['sendNameFunctionCallDetails']
  parentManager: SendAbilities['sendNameFunctionCallDetails']
}

type SubnameRelationship = {
  wrappedParent: SubnameContract
  unwrappedParent: SubnameContract
}

const CONTRACT_FUNCTIONS: {
  unwrappedName: NameContract
  wrappedName: NameContract
  unwrappedSubname: SubnameRelationship
  wrappedSubname: SubnameRelationship
} = {
  unwrappedName: {
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
}

const get2LDEthAbilities = ({
  address,
  basicNameData,
}: {
  address?: string
  basicNameData: BasicName
}): SendAbilities => {
  return (
    match(basicNameData)
      // Wrapped name
      .with(
        {
          ownerData: { ownershipLevel: 'nameWrapper', owner: P.when((owner) => owner === address) },
          wrapperData: {
            parent: { PARENT_CANNOT_CONTROL: true },
            child: { CANNOT_TRANSFER: false },
          },
        },
        () => {
          const sendNameFunctionCallDetails = CONTRACT_FUNCTIONS.wrappedName.owner
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
      // Unwrapped name
      .with(
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
            registrant: P.select('registrant'),
          },
        },
        ({ ownerData: { registrant, owner } }) => registrant === address || owner === address,
        ({ registrant }) => {
          const isOwner = registrant === address
          const sendNameFunctionCallDetails =
            CONTRACT_FUNCTIONS.unwrappedName[isOwner ? 'owner' : 'manager']
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
  )
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
  return (
    match([basicNameData, parentBasicNameData])
      /* --------------- WRAPPED SUBNAME - WRAPPED PARENT --------------- */
      .with(
        [
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
        ([
          {
            ownerData: { owner },
          },
          {
            ownerData: { owner: parentOwner },
          },
        ]) => owner === address || parentOwner === address,
        ({ subnameOwner, pccBurned, parentPCCBurned }) => {
          const isSubname = subnameOwner === address
          const isManager = isSubname ? !pccBurned : !parentPCCBurned
          const role = getSubnameContractRole(isSubname, isManager)
          const sendNameFunctionCallDetails = CONTRACT_FUNCTIONS.wrappedSubname.wrappedParent[role]
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
      /* --------------- UNWRAPPED SUBNAME - UNWRAPPED PARENT --------------- */
      .with(
        [
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
        ([
          {
            ownerData: { owner },
          },
          {
            ownerData: { owner: parentOwner, registrant: parentRegistrant },
          },
        ]) => owner === address || parentOwner === address || parentRegistrant === address,
        ({ subnameOwner, parentOwner }) => {
          const isSubname = subnameOwner === address
          const isManager = isSubname ? true : parentOwner === address
          const role = getSubnameContractRole(isSubname, isManager)
          const sendNameFunctionCallDetails =
            CONTRACT_FUNCTIONS.unwrappedSubname.unwrappedParent[role]
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
      /* --------------- WRAPPED SUBNAME - UNWRAPPED PARENT --------------- */
      .with(
        [
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
        ([
          {
            ownerData: { owner },
          },
          {
            ownerData: { owner: parentOwner, registrant: parentRegistrant },
          },
        ]) => owner === address || parentOwner === address || parentRegistrant === address,
        ({ subnameOwner, pccBurned, parentOwner }) => {
          const isSubname = subnameOwner === address
          const isManager = isSubname ? !pccBurned : parentOwner === address
          const role = getSubnameContractRole(isSubname, isManager)
          const sendNameFunctionCallDetails =
            CONTRACT_FUNCTIONS.wrappedSubname.unwrappedParent[role]
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
      /* --------------- UNWRAPPED SUBNAME - WRAPPED PARENT --------------- */
      .with(
        [
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
        ([
          {
            ownerData: { owner },
          },
          {
            ownerData: { owner: parentOwner },
          },
        ]) => owner === address || parentOwner === address,
        ({ subnameOwner, parentPCCBurned }) => {
          const isSubname = subnameOwner === address
          const isManager = isSubname ? true : !parentPCCBurned
          const role = getSubnameContractRole(isSubname, isManager)
          const sendNameFunctionCallDetails =
            CONTRACT_FUNCTIONS.unwrappedSubname.wrappedParent[role]
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
  )
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
