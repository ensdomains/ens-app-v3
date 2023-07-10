import { P, match } from 'ts-pattern'

import { checkETH2LDFromName, checkSubname } from '@app/utils/utils'

import type { useBasicName } from '../../useBasicName'

type BasicName = ReturnType<typeof useBasicName>

type Results = {
  canSend: boolean
  canSendOwner: boolean
  canSendManager: boolean
  sendNameFunctionCallDetails?: {
    sendOwner?: {
      contract: 'registry' | 'nameWrapper' | 'baseRegistrar'
      method: 'safeTransferFrom'
    }
    sendManager?: {
      contract: 'registry' | 'nameWrapper' | 'baseRegistrar'
      method: 'safeTransferFrom' | 'reclaim' | 'setOwner' | 'setSubnodeOwner'
    }
  }
  canSendError?: string
}

const BASE_RESPONSE: Results = {
  canSend: false,
  canSendOwner: false,
  canSendManager: false,
  sendNameFunctionCallDetails: undefined,
  canSendError: undefined,
}

const get2LDEthAbilities = ({
  address,
  basicNameData,
}: {
  address?: string
  basicNameData: BasicName
}): Results => {
  return (
    match(basicNameData)
      /*
       * WRAPPED NAME OWNER OR MANAGER
       * */
      .with(
        {
          ownerData: { ownershipLevel: 'nameWrapper', owner: P.when((owner) => owner === address) },
          wrapperData: {
            parent: { PARENT_CANNOT_CONTROL: P.select('isOwner') },
            child: { CANNOT_TRANSFER: P.not(true) },
          },
        },
        ({ isOwner }) =>
          isOwner
            ? {
                ...BASE_RESPONSE,
                canSend: true,
                canSendOwner: true,
                sendNameFunctionCallDetails: {
                  sendOwner: {
                    contract: 'nameWrapper',
                    method: 'safeTransferFrom',
                  } as const,
                },
              }
            : {
                ...BASE_RESPONSE,
                canSend: true,
                canSendManager: true,
                sendNameFunctionCallDetails: {
                  sendManager: {
                    contract: 'nameWrapper',
                    method: 'safeTransferFrom',
                  } as const,
                },
              },
      )
      /*
       * UNWRAPPED NAME OWNER
       * */
      .with(
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
            registrant: P.when((registrant) => registrant === address),
          },
        },
        () => ({
          ...BASE_RESPONSE,
          canSend: true,
          canSendOwner: true,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'baseRegistrar',
              method: 'reclaim',
            } as const,
            sendOwner: {
              contract: 'baseRegistrar',
              method: 'safeTransferFrom',
            } as const,
          },
        }),
      )
      /* *
       * UNWRAPPED NAME MANAGER
       * */
      .with(
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
            owner: P.when((owner) => owner === address),
          },
        },
        () => ({
          ...BASE_RESPONSE,
          canSend: true,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'registry',
              method: 'setOwner',
            } as const,
          },
        }),
      )
      .otherwise(({ wrapperData }) => ({
        ...BASE_RESPONSE,
        ...(wrapperData?.child?.CANNOT_TRANSFER ? { canSendError: 'permissionRevoked' } : {}),
      }))
  )
}

const getSubnameAbilities = ({
  address,
  basicNameData,
  parentBasicNameData,
}: {
  address?: string
  basicNameData: BasicName
  parentBasicNameData: BasicName
}): Results => {
  return (
    match([basicNameData, parentBasicNameData])
      /* --------------- WRAPPED SUBNAME - WRAPPED PARENT --------------- */
      /* *
       * WRAPPED SUBNAME OWNER OR MANAGER
       * */
      .with(
        [
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
              owner: P.when((owner) => owner === address),
            },
            wrapperData: {
              parent: { PARENT_CANNOT_CONTROL: P.select('isOwner') },
              child: { CANNOT_TRANSFER: P.not(true) },
            },
          },
          {
            ownerData: { ownershipLevel: 'nameWrapper' },
          },
        ],
        ({ isOwner }) =>
          isOwner
            ? {
                ...BASE_RESPONSE,
                canSend: true,
                canSendOwner: true,
                sendNameFunctionCallDetails: {
                  sendOwner: {
                    contract: 'nameWrapper',
                    method: 'safeTransferFrom',
                  } as const,
                },
              }
            : {
                ...BASE_RESPONSE,
                canSend: true,
                canSendManager: true,
                sendNameFunctionCallDetails: {
                  sendManager: {
                    contract: 'nameWrapper',
                    method: 'safeTransferFrom',
                  } as const,
                },
              },
      )
      /* *
       * WRAPPED PARENT OWNER OR MANAGER
       * */
      .with(
        [
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
            },
            wrapperData: {
              parent: { PARENT_CANNOT_CONTROL: P.not(true) },
              child: { CANNOT_TRANSFER: P.not(true) },
            },
          },
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
              owner: P.when((owner) => owner === address),
            },
            wrapperData: {
              parent: { PARENT_CANNOT_CONTROL: P.select('isOwner') },
            },
          },
        ],
        ({ isOwner }) =>
          isOwner
            ? {
                ...BASE_RESPONSE,
                canSend: true,
                canSendManager: true,
                sendNameFunctionCallDetails: {
                  sendManager: {
                    contract: 'nameWrapper',
                    method: 'setSubnodeOwner',
                  } as const,
                },
              }
            : {
                ...BASE_RESPONSE,
                canSend: true,
                canSendManager: true,
                sendNameFunctionCallDetails: {
                  sendManager: {
                    contract: 'nameWrapper',
                    method: 'setSubnodeOwner',
                  } as const,
                },
              },
      )
      /* --------------- UNWRAPPED SUBNAME - UNWRAPPED PARENT --------------- */
      /* *
       * UNWRAPPED SUBNAME OWNER
       * Subnames cannot have a registrant.
       * This is the equivalent of unwrapped parent manager
       * */
      /* *
       * UNWRAPPED SUBNAME MANAGER
       * */
      .with(
        [
          {
            ownerData: {
              ownershipLevel: P.not('nameWrapper'),
              owner: P.when((owner) => owner === address),
            },
          },
          {
            ownerData: { ownershipLevel: P.not('nameWrapper') },
          },
        ],
        () => ({
          ...BASE_RESPONSE,
          canSend: true,
          canSendOwner: false,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'registry',
              method: 'setOwner',
            } as const,
          },
        }),
      )
      /* *
       * UNWRAPPED PARENT OWNER
       * We shouldn't actually do this!
       * In parent change controller, then do what you would do as controller
       * sendManager: [],
       * */
      /* *
       * UNWRAPPED PARENT MANAGER
       * */
      .with(
        [
          {
            ownerData: {
              ownershipLevel: P.not('nameWrapper'),
            },
          },
          {
            ownerData: {
              ownershipLevel: P.not('nameWrapper'),
              owner: P.when((owner) => owner === address),
            },
          },
        ],
        () => ({
          ...BASE_RESPONSE,
          canSend: true,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'registry',
              method: 'setSubnodeOwner',
            } as const,
          },
        }),
      )
      /* --------------- WRAPPED SUBNAME - UNWRAPPED PARENT --------------- */
      /* *
       * WRAPPED SUBNAME MANAGER
       * */
      .with(
        [
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
              owner: P.when((owner) => owner === address),
            },
            wrapperData: {
              parent: { PARENT_CANNOT_CONTROL: false },
              child: { CANNOT_TRANSFER: P.not(true) },
            },
          },
          {
            ownerData: { ownershipLevel: P.not('nameWrapper') },
          },
        ],
        () => ({
          ...BASE_RESPONSE,
          canSend: true,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'nameWrapper',
              method: 'safeTransferFrom',
            } as const,
          },
        }),
      )
      /*
       * WRAPPED SUBNAME OWNER
       * This state should never happen as the parent is unwrapped and cannot burn PCC
       * */
      /* *
       * UNWRAPPED PARENT OWNER
       * Will require setting yourself as manager first
       * sendManager: [],
       * */
      /* *
       * UNWRAPPED PARENT MANAGER
       * We shouldn't actually do this! Will forcibly unwrap the name
       * sendManager: {
       *   contract: 'registry',
       *   method: 'setSubnodeOwner',
       * }
       * */
      /* --------------- UNWRAPPED SUBNAME - WRAPPED PARENT --------------- */
      /* *
       * UNWRAPPED SUBNAME OWNER
       * Unwrapped subname cannot have an owner
       * */
      /* *
       * UNWRAPPED SUBNAME MANAGER
       * */
      .with(
        [
          {
            ownerData: {
              ownershipLevel: P.not('nameWrapper'),
              owner: P.when((owner) => owner === address),
            },
          },
          {
            ownerData: { ownershipLevel: 'nameWrapper' },
          },
        ],
        () => ({
          ...BASE_RESPONSE,
          canSend: true,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'registry',
              method: 'setOwner',
            } as const,
          },
        }),
      )
      /* *
       * WRAPPED PARENT OWNER
       * Must forcibly wrap subname or unwrap parent
       * sendManager: []
       * */
      /* *
       * WRAPPED PARENT MANAGER
       * Must forcibly wrap subname or unwrap parent
       * sendManager: []
       * */
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
