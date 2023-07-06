import { P, match } from 'ts-pattern'

import { checkETH2LDFromName, checkSubname } from '@app/utils/utils'

import type { useBasicName } from '../../useBasicName'

type BasicName = ReturnType<typeof useBasicName>

const get2LDEthAbilities = ({
  address,
  basicNameData,
}: {
  address?: string
  basicNameData: BasicName
}) => {
  return (
    match(basicNameData)
      /*
       * WRAPPED NAME OWNER OR MANAGER
       * */
      .with(
        {
          ownerData: { ownershipLevel: 'nameWrapper', owner: P.when((owner) => owner === address) },
          wrapperData: { parent: { PARENT_CANNOT_CONTROL: P.select('isOwner') } },
        },
        ({ isOwner }) =>
          isOwner
            ? {
                canSend: true,
                canSendOwner: true,
                canSendManager: false,
                sendNameFunctionCallDetails: {
                  sendOwner: {
                    contract: 'nameWrapper',
                    method: 'safeTransferFrom',
                  },
                },
              }
            : {
                canSend: true,
                canSendOwner: false,
                canSendManager: true,
                sendNameFunctionCallDetails: {
                  sendManager: {
                    contract: 'nameWrapper',
                    method: 'safeTransferFrom',
                  },
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
          canSend: true,
          canSendOwner: true,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'baseRegistrar',
              method: 'reclaim',
            },
            sendOwner: {
              contract: 'baseRegistrar',
              method: 'safeTransferFrom',
            },
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
          canSend: true,
          canSendOwner: false,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'registry',
              method: 'setOwner',
            },
          },
        }),
      )
      .otherwise(() => ({
        canSend: false,
        canSendOwner: false,
        canSendManager: false,
        sendNameFunctionCallDetails: undefined,
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
}) => {
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
            },
          },
          {
            ownerData: { ownershipLevel: 'nameWrapper' },
          },
        ],
        ({ isOwner }) =>
          isOwner
            ? {
                canSend: true,
                canSendOwner: true,
                canSendManager: false,
                sendNameFunctionCallDetails: {
                  sendOwner: {
                    contract: 'nameWrapper',
                    method: 'safeTransferFrom',
                  },
                },
              }
            : {
                canSend: true,
                canSendOwner: false,
                canSendManager: true,
                sendNameFunctionCallDetails: {
                  sendManager: {
                    contract: 'nameWrapper',
                    method: 'safeTransferFrom',
                  },
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
                canSend: true,
                canSendOwner: false,
                canSendManager: true,
                sendNameFunctionCallDetails: {
                  sendManager: {
                    contract: 'nameWrapper',
                    method: 'setSubnodeOwner',
                  },
                },
              }
            : {
                canSend: true,
                canSendOwner: false,
                canSendManager: true,
                sendNameFunctionCallDetails: {
                  sendManager: {
                    contract: 'nameWrapper',
                    method: 'setSubnodeOwner',
                  },
                },
              },
      )
      /* --------------- UNWRAPPED SUBNAME - UNWRAPPED PARENT --------------- */
      /* *
       * UNWRAPPED SUBNAME OWNER
       * */
      .with(
        [
          {
            ownerData: {
              ownershipLevel: P.not('nameWrapper'),
              registrant: P.when((registrant) => registrant === address),
            },
          },
          {
            ownerData: { ownershipLevel: P.not('nameWrapper') },
          },
        ],
        () => ({
          canSend: false,
          canSendOwner: false,
          canSendManager: false,
          sendNameFunctionCallDetails: undefined,
        }),
      )
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
          canSend: true,
          canSendOwner: false,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'registry',
              method: 'setOwner',
            },
          },
        }),
      )
      /* *
       * UNWRAPPED PARENT OWNER
       * We shouldn't actually do this!
       * In parent change controller, then do what you would do as controller
       * sendManager: [],
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
              registrant: P.when((registrant) => registrant === address),
            },
          },
        ],
        () => ({
          canSend: false,
          canSendOwner: false,
          canSendManager: false,
          sendNameFunctionCallDetails: undefined,
        }),
      )
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
          canSend: true,
          canSendOwner: false,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'registry',
              method: 'setSubnodeOwner',
            },
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
            },
          },
          {
            ownerData: { ownershipLevel: P.not('nameWrapper') },
          },
        ],
        () => ({
          canSend: true,
          canSendOwner: false,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'nameWrapper',
              method: 'safeTransferFrom',
            },
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
          canSend: true,
          canSendOwner: false,
          canSendManager: true,
          sendNameFunctionCallDetails: {
            sendManager: {
              contract: 'registry',
              method: 'setOwner',
            },
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
      .otherwise(() => {
        return {
          canSend: false,
          canSendOwner: false,
          canSendManager: false,
          sendNameFunctionCallDetails: undefined,
        }
      })
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
  console.log('Did not match subnames')
  return {
    sendNameFunctionCallDetails: undefined,
  }
}
