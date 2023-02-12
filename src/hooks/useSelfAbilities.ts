import { useMemo } from 'react'

import { useBasicName } from '@app/hooks/useBasicName'
import { checkSubname } from '@app/utils/utils'

interface SendPermissions {
  canSendOwner: boolean
  canSendManager: boolean
}

type BasicNameData = ReturnType<typeof useBasicName>

interface CallDetails {
  contract: 'nameWrapper' | 'baseRegistrar' | 'registry'
  method: 'setOwner' | 'setSubnodeOwner' | 'safeTransferFrom' | 'reclaim'
}

interface FunctionCallDetails {
  sendManager?: CallDetails
  sendOwner?: CallDetails
}

interface GetFunctionCallDetailsArgs {
  basicNameData: BasicNameData
  parentBasicNameData: BasicNameData
  name: string
  address: string
}

interface UserStates {
  owner: FunctionCallDetails
  manager: FunctionCallDetails
  parentManager?: FunctionCallDetails
  parentOwner?: FunctionCallDetails
}

interface NameStates {
  name: UserStates
  subname: UserStates
  wrappedSubname: UserStates
}

interface ContractFunctionInfo {
  unwrapped: NameStates
  wrapped: NameStates
}

/*
To use this object, put yourself in the shoes of the user.
For example, if you are the owner of an unwrapped subname,
and the parent is unwrapped, and you want to transfer your 
role as manager to someone else, you would go: 
unwrapped.subname.manager.sendManager

If for the same name you were the parent manager, you would go:
unwrapped.subname.parentManager.sendManager
*/

const contractFunction: ContractFunctionInfo = {
  unwrapped: {
    name: {
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
    subname: {
      manager: {
        sendManager: {
          contract: 'registry',
          method: 'setOwner',
        },
      },
      owner: {},
      parentManager: {
        sendManager: {
          contract: 'registry',
          method: 'setSubnodeOwner',
        },
      },
      parentOwner: {
        // We shouldn't actually do this!
        // In parent change controller, then do what you would do as controller
        // sendManager: [],
      },
    },
    wrappedSubname: {
      manager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      owner: {
        // This state should never happen as the parent is unwrapped and cannot burn PCC
      },
      parentManager: {
        // We shouldn't actually do this! Will forcibly unwrap the name
        // sendManager: {
        //   contract: 'registry',
        //   method: 'setSubnodeOwner',
        // },
      },
      parentOwner: {
        // Will require setting yourself as manager first
        // sendManager: [],
      },
    },
  },
  wrapped: {
    name: {
      owner: {
        sendOwner: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      manager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
    },
    wrappedSubname: {
      owner: {
        sendOwner: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      manager: {
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
    subname: {
      manager: {
        sendManager: {
          contract: 'registry',
          method: 'setOwner',
        },
      },
      owner: {
        // Unwrapped subname cannot have an owner
      },
      parentManager: {
        // Must forcibly wrap subname or unwrap parent
        // sendManager: [],
      },
      parentOwner: {
        // Must forcibly wrap subname or unwrap parent
        // sendManager: [],
      },
    },
  },
}

// Will pick out the correct function call from the object above
export const getFunctionCallDetails = ({
  basicNameData,
  parentBasicNameData,
  name,
  address,
}: GetFunctionCallDetailsArgs): FunctionCallDetails => {
  const { ownerData, wrapperData } = basicNameData
  const { ownerData: parentOwnerData, wrapperData: parentWrapperData } = parentBasicNameData

  if (!wrapperData || !parentWrapperData) return {}

  const isSubname = checkSubname(name)
  const { parent: childParentFuseObj } = wrapperData
  const { parent: parentParentFuseObj } = parentWrapperData
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'
  const isOwnerOrManager = ownerData?.owner === address || ownerData?.registrant === address
  const isOwner = isWrapped
    ? childParentFuseObj.PARENT_CANNOT_CONTROL
    : ownerData?.registrant === address

  if (isSubname) {
    const isParentWrapped = parentOwnerData?.ownershipLevel === 'nameWrapper'
    const isParentOwnerOrManager = parentOwnerData?.owner === address

    if (!isOwnerOrManager && !isParentOwnerOrManager) {
      return {}
    }

    if (isOwnerOrManager) {
      const functionCallDetails =
        contractFunction[isParentWrapped ? 'wrapped' : 'unwrapped'][
          isWrapped ? 'wrappedSubname' : 'subname'
        ][isOwner ? 'owner' : 'manager']
      return functionCallDetails
    }

    const isParentManager = isParentWrapped
      ? !parentParentFuseObj.PARENT_CANNOT_CONTROL
      : parentOwnerData?.owner === address

    if (isParentOwnerOrManager) {
      const functionCallDetails =
        contractFunction[isParentWrapped ? 'wrapped' : 'unwrapped'][
          isWrapped ? 'wrappedSubname' : 'subname'
        ][`parent${isParentManager ? 'Manager' : 'Owner'}`]
      return functionCallDetails ?? {}
    }
  }

  // 2LD names
  if (isOwnerOrManager) {
    const functionCallDetails =
      contractFunction[isWrapped ? 'wrapped' : 'unwrapped'].name[isOwner ? 'owner' : 'manager']
    return functionCallDetails
  }

  return {}
}

export const getPermittedActions = (props: GetFunctionCallDetailsArgs): SendPermissions => {
  if (!props.basicNameData.ownerData) return { canSendOwner: false, canSendManager: false }
  if (props.basicNameData.wrapperData?.child.CANNOT_TRANSFER)
    return { canSendOwner: false, canSendManager: false }
  const result = getFunctionCallDetails(props)
  if (!result) return { canSendOwner: false, canSendManager: false }
  const keys = Object.keys(result)
  return {
    canSendOwner: keys.includes('sendOwner'),
    canSendManager: keys.includes('sendManager'),
  }
}

const isParentWithChildPCCBurnedCalc = (
  basicNameData: BasicNameData,
  parentBasicNameData: BasicNameData,
  address: string,
): boolean | undefined => {
  const { ownerData, wrapperData } = basicNameData
  const { ownerData: parentOwnerData } = parentBasicNameData
  const isOwnerOrManager = ownerData?.owner === address || ownerData?.registrant === address
  const isParentOwnerOrManager = parentOwnerData?.owner === address
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'

  return (
    !isOwnerOrManager &&
    isParentOwnerOrManager &&
    isWrapped &&
    wrapperData?.parent.PARENT_CANNOT_CONTROL
  )
}

export const useSelfAbilities = (address: string | undefined, name?: string) => {
  const parent = name?.split('.')?.slice(1)?.join('.')
  const is2LDEth = name?.split('.')?.length === 2 && name?.split('.')?.[1] === 'eth'

  const basicNameData = useBasicName(name)
  const parentBasicNameData = useBasicName(parent)

  return useMemo(() => {
    const abilities: {
      canEdit: boolean
      canExtend: boolean
      canSendManager: boolean
      canSendOwner: boolean
      canSend: boolean
      sendNameFunctionCallDetails: FunctionCallDetails
    } = {
      canEdit: false,
      canExtend: false,
      canSendManager: false,
      canSendOwner: false,
      canSend: false,
      sendNameFunctionCallDetails: {},
    }

    if (!name || !address || !basicNameData || !parentBasicNameData) return abilities

    if (is2LDEth) abilities.canExtend = true

    if (isParentWithChildPCCBurnedCalc(basicNameData, parentBasicNameData, address)) {
      // PCC burned so GTFO parent
      return abilities
    }

    const functionCallDetails = getFunctionCallDetails({
      basicNameData,
      parentBasicNameData,
      name,
      address,
    })

    abilities.sendNameFunctionCallDetails = functionCallDetails

    const { canSendOwner, canSendManager } = getPermittedActions({
      basicNameData,
      parentBasicNameData,
      name,
      address,
    })

    abilities.canSendOwner = canSendOwner
    abilities.canSendManager = canSendManager
    abilities.canSend = canSendManager || canSendOwner

    if (basicNameData?.ownerData?.owner === address) {
      abilities.canEdit = true
    }
    return abilities
  }, [address, name, is2LDEth, basicNameData, parentBasicNameData])
}
