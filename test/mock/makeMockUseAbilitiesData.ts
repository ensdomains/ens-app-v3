/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'

export const mockUseAbilitiesConfig = {
  // 2ld: unwrapped
  'eth-unwrapped-2ld:owner': {
    basicNameType: 'eth-unwrapped-2ld:owner',
    parentNameType: 'eth',
    name: 'name.eth',
  },
  'eth-unwrapped-2ld:manager': {
    basicNameType: 'eth-unwrapped-2ld:manager',
    parentNameType: 'eth',
    name: 'name.eth',
  },
  'eth-wrapped:manager': {},
  'eth-emancipated:owner': {},
  'eth-locked:owner': {},
  'eth-burnt:owner': {},
  'dns-unwrapped-2ld:owner': {},
  'dns-unwrapped-2ld:manager': {},
  // 3LD
  'eth-unwrapped-subname:manager+unwrapped-2ld:unowned': {},
  'eth-unwrapped-subname:manager+wrapped-2ld:unowned': {},
  'eth-unwrapped-subname:manager+emancipated-2ld:unowned': {},
  'eth-unwrapped-subname:unowned+unwrapped-2ld:manager': {},
  'eth-unwrapped-subname:unowned+unwrapped-2ld:owner': {},
  'eth-unwrapped-subname:unowned+wrapped-2ld': {},
  'eth-unwrapped-subname:unowned+emancipated-2ld': {},
  'eth-wrapped-subname+emancipated-2ld:unowned': {},
  'eth-wrapped-subname+unwrapped-2ld:unowned': {},
  'eth-wrapped-subname:unowned+unwrapped-2ld': {},
  'eth-wrapped-subname:unowned+wrapped-2ld': {},
  'eth-wrapped-subname:unowned+emancipated-2ld': {},
  'eth-emancipated-subname+unwrapped-2ld': {},
  'eth-emancipated-subname+emancipated-2ld:unowned': {},
  'eth-emancipated-subname+emancipated-2ld:owner': {},
  'eth-emancipated-subname:unowned+emancipated-2ld': {},
  'eth-emancipated-subname:unowned+wrapped-2ld': {},

  // 4LD
  'eth-unwrapped-subname:manager+unwrapped-subname:unowned': {},
  'eth-unwrapped-subname:unowned+unwrapped-subname:manager': {},
  // 'eth-unwrapped-subname:unowned+unwrapped-subname:owner': {}, Not possible
  'eth-wrapped-subname:manager+wrapped-subname:manager': {},
  'eth-wrapped-subname:manager+unwrapped-subname:unowned': {},
  'eth-wrapped-subname:unowned+unwrapped-subname:manager': {},
} as const

type MockUseAbilitiesType = keyof typeof mockUseAbilitiesConfig
export const mockUseAbilitiesTypes = Object.keys(mockUseAbilitiesConfig) as MockUseAbilitiesType[]

export const makeMockUseAbilitiesData = (type: MockUseAbilitiesType) => {
  return (
    match(type)
      // 2LD
      .with('eth-unwrapped-2ld:owner', () => ({
        canCreateSubdomains: false,
        canDelete: false,
        canEdit: false,
        canEditPermissions: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditTTL: false,
        canExtend: true,
        canReclaim: false,
        canSend: true,
        canSendError: undefined,
        canSendManager: true,
        canSendOwner: true,
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
      .with('eth-unwrapped-2ld:manager', () => ({
        canCreateSubdomains: false,
        canDelete: false,
        canEdit: false,
        canEditPermissions: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditTTL: false,
        canExtend: true,
        canReclaim: false,
        canSend: true,
        canSendError: undefined,
        canSendManager: true,
        canSendOwner: true,
        sendNameFunctionCallDetails: {
          sendManager: {
            contract: 'registry',
            method: 'setOwner',
          },
        },
      }))
      // 3LD
      .with(P.union('eth-unwrapped-subname:manager+unwrapped-2ld:unowned'), () => ({
        canCreateSubdomains: false,
        canDelete: false,
        canEdit: false,
        canEditPermissions: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditTTL: false,
        canExtend: true,
        canReclaim: false,
        canSend: true,
        canSendError: undefined,
        canSendManager: true,
        canSendOwner: false,
        sendNameFunctionCallDetails: {
          sendManager: {
            contract: 'registry',
            method: 'setOwner',
          },
        },
      }))
      .with('eth-unwrapped-subname:unowned+unwrapped-2ld:owner', () => ({
        canCreateSubdomains: false,
        canDelete: false,
        canEdit: false,
        canEditPermissions: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditTTL: false,
        canExtend: true,
        canReclaim: false,
        canSend: false,
        canSendError: undefined,
        canSendManager: false,
        canSendOwner: false,
        sendNameFunctionCallDetails: undefined,
      }))
      .with(P.union('eth-wrapped-subname:unowned+unwrapped-2ld:manager'), () => ({
        canCreateSubdomains: false,
        canDelete: false,
        canEdit: false,
        canEditPermissions: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditTTL: false,
        canExtend: true,
        canReclaim: false,
        canSend: false,
        canSendError: undefined,
        canSendManager: false,
        canSendOwner: false,
        sendNameFunctionCallDetails: undefined,
      }))
      // 4LD
      .with(P.union('eth-unwrapped-subname:manager+unwrapped-subname:unowned'), () => ({
        canCreateSubdomains: false,
        canDelete: false,
        canEdit: false,
        canEditPermissions: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditTTL: false,
        canExtend: true,
        canReclaim: false,
        canSend: true,
        canSendError: undefined,
        canSendManager: true,
        canSendOwner: false,
        sendNameFunctionCallDetails: {
          sendManager: {
            contract: 'registry',
            method: 'setOwner',
          },
        },
      }))
      .with('eth-unwrapped-subname:unowned+unwrapped-subname:manager', () => ({
        canCreateSubdomains: false,
        canDelete: false,
        canEdit: false,
        canEditPermissions: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditTTL: false,
        canExtend: true,
        canReclaim: false,
        canSend: true,
        canSendError: undefined,
        canSendManager: true,
        canSendOwner: true,
        sendNameFunctionCallDetails: {
          sendManager: {
            contract: 'registry',
            method: 'setSubnodeOwner',
          },
        },
      }))
      .with('eth-wrapped-subname:manager+unwrapped-subname:unowned', () => ({
        canCreateSubdomains: false,
        canDelete: false,
        canEdit: false,
        canEditPermissions: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditTTL: false,
        canExtend: true,
        canReclaim: false,
        canSend: true,
        canSendError: undefined,
        canSendManager: true,
        canSendOwner: true,
        sendNameFunctionCallDetails: {
          sendManager: {
            contract: 'nameWrapper',
            method: 'safeTransferFrom',
          },
        },
      }))
      .with(P.union('eth-wrapped-subname:unowned+unwrapped-subname:manager'), () => ({
        canCreateSubdomains: false,
        canDelete: false,
        canEdit: false,
        canEditPermissions: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditTTL: false,
        canExtend: true,
        canReclaim: false,
        canSend: false,
        canSendError: undefined,
        canSendManager: false,
        canSendOwner: false,
        sendNameFunctionCallDetails: undefined,
      }))
      .exhaustive()
  )
}
