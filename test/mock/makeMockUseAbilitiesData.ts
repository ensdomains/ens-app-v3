/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'

import { MockUseBasicNameType } from './makeMockUseBasicName'

type MockUseAbilitiesConfig = {
  basicNameType: MockUseBasicNameType
  parentNameType: MockUseBasicNameType
  name: string
}

export const mockUseAbilitiesConfig = {
  // 2LD
  'eth-unwrapped-2ld': {
    basicNameType: 'eth-unwrapped-2ld',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-2ld:owner': {
    basicNameType: 'eth-unwrapped-2ld:owner',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-2ld:manager': {
    basicNameType: 'eth-unwrapped-2ld:manager',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-2ld:unowned': {
    basicNameType: 'eth-unwrapped-2ld:unowned',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-2ld:grace-period': {
    basicNameType: 'eth-unwrapped-2ld:grace-period',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'eth-emancipated-2ld': {
    basicNameType: 'eth-emancipated-2ld',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'eth-emancipated-2ld:unowned': {
    basicNameType: 'eth-emancipated-2ld:unowned',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'eth-emancipated-2ld:grace-period': {
    basicNameType: 'eth-emancipated-2ld:grace-period',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'eth-burnt-2ld': {
    basicNameType: 'eth-burnt-2ld',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'eth-burnt-2ld:unowned': {
    basicNameType: 'eth-burnt-2ld:unowned',
    parentNameType: 'eth',
    name: 'name.eth',
  } as MockUseAbilitiesConfig,
  'dns-unwrapped-2ld': {
    basicNameType: 'dns-unwrapped-2ld',
    parentNameType: 'dns',
    name: 'name.com',
  } as MockUseAbilitiesConfig,
  'dns-unwrapped-2ld:owner': {
    basicNameType: 'dns-unwrapped-2ld:owner',
    parentNameType: 'dns',
    name: 'name.com',
  } as MockUseAbilitiesConfig,
  'dns-unwrapped-2ld:manager': {
    basicNameType: 'dns-unwrapped-2ld:manager',
    parentNameType: 'dns',
    name: 'name.com',
  } as MockUseAbilitiesConfig,
  'dns-wrappped-2ld': {
    basicNameType: 'dns-wrapped-2ld',
    parentNameType: 'dns',
    name: 'name.com',
  } as MockUseAbilitiesConfig,
  // 3LD
  // eth-unwrapped-subname
  'eth-unwrapped-subname': {
    basicNameType: 'eth-unwrapped-subname',
    parentNameType: 'eth-unwrapped-2ld:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname+unwrapped-2ld:unowned': {
    basicNameType: 'eth-unwrapped-subname',
    parentNameType: 'eth-unwrapped-2ld:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname+unwrapped-2ld:grace-period:unowned': {
    basicNameType: 'eth-unwrapped-subname',
    parentNameType: 'eth-unwrapped-2ld:grace-period:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname+emancipated-2ld:unowned': {
    basicNameType: 'eth-unwrapped-subname',
    parentNameType: 'eth-emancipated-2ld:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname+emancipated-2ld:grace-period:unowned': {
    basicNameType: 'eth-unwrapped-subname',
    parentNameType: 'eth-emancipated-2ld:grace-period:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-unwrapped-subname:unowned
  'eth-unwrapped-subname:unowned+unwrapped-2ld': {
    basicNameType: 'eth-unwrapped-subname:unowned',
    parentNameType: 'eth-unwrapped-2ld',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname:unowned+unwrapped-2ld:manager': {
    basicNameType: 'eth-unwrapped-subname:unowned',
    parentNameType: 'eth-unwrapped-2ld:manager',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname:unowned+unwrapped-2ld:owner': {
    basicNameType: 'eth-unwrapped-subname:unowned',
    parentNameType: 'eth-unwrapped-2ld:owner',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname:unowned+unwrapped-2ld:grace-period': {
    basicNameType: 'eth-unwrapped-subname:unowned',
    parentNameType: 'eth-unwrapped-2ld:grace-period',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname:unowned+emancipated-2ld': {
    basicNameType: 'eth-unwrapped-subname:unowned',
    parentNameType: 'eth-emancipated-2ld',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname:unowned+emancipated-2ld:grace-period': {
    basicNameType: 'eth-unwrapped-subname:unowned',
    parentNameType: 'eth-emancipated-2ld:grace-period',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-wrapped-subname
  'eth-wrapped-subname': {
    basicNameType: 'eth-wrapped-subname',
    parentNameType: 'eth-locked-2ld:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname+unwrapped-2ld:unowned': {
    basicNameType: 'eth-wrapped-subname',
    parentNameType: 'eth-unwrapped-2ld:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname+unwrapped-2ld:grace-period:unowned': {
    basicNameType: 'eth-wrapped-subname',
    parentNameType: 'eth-unwrapped-2ld:grace-period:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname+emancipated-2ld:unowned': {
    basicNameType: 'eth-wrapped-subname',
    parentNameType: 'eth-emancipated-2ld:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname+emancipated-2ld:grace-period:unowned': {
    basicNameType: 'eth-wrapped-subname',
    parentNameType: 'eth-emancipated-2ld:grace-period:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-wrapped-subname:unowned
  'eth-wrapped-subname:unowned+unwrapped-2ld': {
    basicNameType: 'eth-wrapped-subname:unowned',
    parentNameType: 'eth-unwrapped-2ld',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname:unowned+unwrapped-2ld:grace-period': {
    basicNameType: 'eth-wrapped-subname:unowned',
    parentNameType: 'eth-unwrapped-2ld:grace-period',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname:unowned+emancipated-2ld': {
    basicNameType: 'eth-wrapped-subname:unowned',
    parentNameType: 'eth-emancipated-2ld',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname:unowned+emancipated-2ld:grace-period': {
    basicNameType: 'eth-wrapped-subname:unowned',
    parentNameType: 'eth-emancipated-2ld:grace-period',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-emancipated-subname
  'eth-emancipated-subname': {
    basicNameType: 'eth-emancipated-subname',
    parentNameType: 'eth-locked-2ld:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  // 'eth-emancipated-subname+unwrapped-2ld:unowned': {}, unwrapped name cannot burn pcc
  // 'eth-emancipated-subname+unwrapped-2ld:grace-period:unowned': {}, unwrapped name cannot burn pcc
  'eth-emancipated-subname+emancipated-2ld:unowned': {
    basicNameType: 'eth-emancipated-subname',
    parentNameType: 'eth-emancipated-2ld:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-emancipated-subname+locked-2ld:grace-period:unowned': {
    basicNameType: 'eth-emancipated-subname',
    parentNameType: 'eth-locked-2ld:grace-period:unowned',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-emancipated-subname:unowned
  // 'eth-emancipated-subname:unowned+emancipated-2ld': {}, Can't burn pcc if name is not locked
  'eth-emancipated-subname:unowned+locked-2ld': {
    basicNameType: 'eth-emancipated-subname:unowned',
    parentNameType: 'eth-locked-2ld',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-emancipated-subname:unowned+locked-2ld:grace-period': {
    basicNameType: 'eth-emancipated-subname:unowned',
    parentNameType: 'eth-locked-2ld:grace-period',
    name: 'subname.name.eth',
  } as MockUseAbilitiesConfig,

  // 4LD - We will reuse the 3ld subname types since the abilities only depends on the name being a subname
  // eth-unwrapped-subname
  'eth-unwrapped-subname+unwrapped-subname:unowned': {
    basicNameType: 'eth-unwrapped-subname',
    parentNameType: 'eth-unwrapped-subname:unowned',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname+wrapped-subname:unowned': {
    basicNameType: 'eth-unwrapped-subname',
    parentNameType: 'eth-wrapped-subname:unowned',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname+emancipated-subname:unowned': {
    basicNameType: 'eth-unwrapped-subname',
    parentNameType: 'eth-emancipated-subname:unowned',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-unwrapped-subname:unowned
  'eth-unwrapped-subname:unowned+unwrapped-subname': {
    basicNameType: 'eth-unwrapped-subname:unowned',
    parentNameType: 'eth-unwrapped-subname',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname:unowned+wrapped-subname': {
    basicNameType: 'eth-unwrapped-subname:unowned',
    parentNameType: 'eth-wrapped-subname',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-unwrapped-subname:unowned+emancipated-subname': {
    basicNameType: 'eth-unwrapped-subname:unowned',
    parentNameType: 'eth-emancipated-subname',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-wrapped-subname
  'eth-wrapped-subname+unwrapped-subname:unowned': {
    basicNameType: 'eth-wrapped-subname',
    parentNameType: 'eth-unwrapped-subname:unowned',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname+wrapped-subname:unowned': {
    basicNameType: 'eth-wrapped-subname',
    parentNameType: 'eth-wrapped-subname:unowned',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname+emancipated-subname:unowned': {
    basicNameType: 'eth-wrapped-subname',
    parentNameType: 'eth-emancipated-subname:unowned',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-wrapped-subname:unowned
  'eth-wrapped-subname:unowned+unwrapped-subname': {
    basicNameType: 'eth-wrapped-subname:unowned',
    parentNameType: 'eth-unwrapped-subname',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname:unowned+wrapped-subname': {
    basicNameType: 'eth-wrapped-subname:unowned',
    parentNameType: 'eth-wrapped-subname',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,
  'eth-wrapped-subname:unowned+emancipated-subname': {
    basicNameType: 'eth-wrapped-subname:unowned',
    parentNameType: 'eth-emancipated-subname',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-emancipated-subname
  // 'eth-emancipated-subname+unwrapped-subname': {}, unwrapped name cannot burn pcc
  // 'eth-emancipated-subname+wrapped-subname:unowned': {}, Can't burn pcc if name is not locked
  'eth-emancipated-subname+locked-subname:unowned': {
    basicNameType: 'eth-emancipated-subname',
    parentNameType: 'eth-locked-subname:unowned',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,

  // eth-emancipated-subname:unowned
  // 'eth-emancipated-subname:unowned+unwrapped-subname': {}, unwrapped name cannot burn pcc
  // 'eth-emancipated-subname:unowned+wrapped-subname': {}, unwrapped name cannot burn pcc
  'eth-emancipated-subname:unowned+locked-subname': {
    basicNameType: 'eth-emancipated-subname:unowned',
    parentNameType: 'eth-locked-subname',
    name: 'subname.subname.name.eth',
  } as MockUseAbilitiesConfig,
} as const

export type MockUseAbilitiesType = keyof typeof mockUseAbilitiesConfig
export const mockUseAbilitiesTypes = Object.keys(mockUseAbilitiesConfig) as MockUseAbilitiesType[]

export const makeMockUseAbilitiesData = (type: MockUseAbilitiesType) => {
  return match(type)
    .with(P.union('eth-unwrapped-2ld'), () => ({
      canExtend: true,
      canSelfExtend: true,
      canSend: true,
      canSendOwner: true,
      canSendManager: true,
      sendNameFunctionCallDetails: {
        sendManager: { contract: 'registrar', method: 'reclaim' },
        sendOwner: { contract: 'registrar', method: 'safeTransferFrom' },
      },
      canEdit: true,
      canEditRecords: true,
      canEditResolver: true,
      canEditPermissions: false,
      canCreateSubdomains: true,
      canEditTTL: true,
      canDelete: false,
      canReclaim: false,
    }))
    .with(P.union('eth-unwrapped-2ld:owner'), () => ({
      canExtend: true,
      canSelfExtend: true,
      canSend: true,
      canSendOwner: true,
      canSendManager: true,
      sendNameFunctionCallDetails: {
        sendManager: { contract: 'registrar', method: 'reclaim' },
        sendOwner: { contract: 'registrar', method: 'safeTransferFrom' },
      },
      canEdit: false,
      canEditRecords: false,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
      canDelete: false,
      canReclaim: false,
    }))
    .with(P.union('eth-unwrapped-2ld:manager'), () => ({
      canExtend: true,
      canSelfExtend: false,
      canSend: true,
      canSendOwner: false,
      canSendManager: true,
      sendNameFunctionCallDetails: { sendManager: { contract: 'registry', method: 'setOwner' } },
      canEdit: true,
      canEditRecords: true,
      canEditResolver: true,
      canEditPermissions: false,
      canCreateSubdomains: true,
      canEditTTL: true,
      canDelete: false,
      canReclaim: false,
    }))
    .with(P.union('eth-unwrapped-2ld:unowned', 'eth-emancipated-2ld:unowned'), () => ({
      canExtend: true,
      canSelfExtend: false,
      canSend: false,
      canSendOwner: false,
      canSendManager: false,
      canEdit: false,
      canEditRecords: false,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
      canDelete: false,
      canReclaim: false,
    }))
    .with(P.union('eth-unwrapped-2ld:grace-period'), () => ({
      canExtend: true,
      canSelfExtend: true,
      canSend: false,
      canSendOwner: false,
      canSendManager: false,
      canSendError: 'gracePeriod',
      canEdit: true,
      canEditRecords: true,
      canEditResolver: true,
      canEditPermissions: false,
      canCreateSubdomains: true,
      canEditTTL: true,
      canDelete: false,
      canReclaim: false,
    }))
    .with(P.union('eth-emancipated-2ld'), () => ({
      canExtend: true,
      canSelfExtend: true,
      canSend: true,
      canSendOwner: true,
      canSendManager: false,
      sendNameFunctionCallDetails: {
        sendOwner: { contract: 'nameWrapper', method: 'safeTransferFrom' },
      },
      canEdit: true,
      canEditRecords: true,
      canEditResolver: true,
      canEditPermissions: true,
      canCreateSubdomains: true,
      canEditTTL: true,
      canDelete: false,
      canReclaim: false,
    }))
    .with(P.union('eth-emancipated-2ld:grace-period'), () => ({
      canExtend: true,
      canSelfExtend: true,
      canSend: false,
      canSendOwner: false,
      canSendManager: false,
      canSendError: 'gracePeriod',
      canEdit: true,
      canEditRecords: true,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
      canCreateSubdomainsError: 'gracePeriod',
      canEditResolverError: 'gracePeriod',
      canDelete: false,
      canReclaim: false,
    }))
    .with(P.union('eth-burnt-2ld'), () => ({
      canExtend: true,
      canSelfExtend: true,
      canSend: false,
      canSendOwner: false,
      canSendManager: false,
      canSendError: 'permissionRevoked',
      canEdit: true,
      canEditRecords: true,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
      canCreateSubdomainsError: 'permissionRevoked',
      canEditResolverError: 'permissionRevoked',
      canDelete: false,
      canReclaim: false,
    }))
    .with(P.union('eth-burnt-2ld:unowned'), () => ({
      canExtend: true,
      canSelfExtend: false,
      canSend: false,
      canSendOwner: false,
      canSendManager: false,
      canSendError: 'permissionRevoked',
      canEdit: false,
      canEditRecords: false,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
      canDelete: false,
      canReclaim: false,
    }))
    .with(P.union('dns-unwrapped-2ld', 'dns-unwrapped-2ld:manager'), () => ({
      canExtend: false,
      canSelfExtend: false,
      canSend: true,
      canSendOwner: false,
      canSendManager: true,
      sendNameFunctionCallDetails: { sendManager: { contract: 'registry', method: 'setOwner' } },
      canEdit: true,
      canEditRecords: true,
      canEditResolver: true,
      canEditPermissions: false,
      canCreateSubdomains: true,
      canEditTTL: true,
      canDelete: false,
      canReclaim: false,
    }))
    .with(
      P.union(
        'dns-unwrapped-2ld:owner',
        'eth-unwrapped-subname:unowned+emancipated-2ld:grace-period',
        'eth-wrapped-subname:unowned+emancipated-2ld:grace-period',
        'eth-emancipated-subname:unowned+locked-2ld',
        'eth-emancipated-subname:unowned+locked-2ld:grace-period',
        'eth-emancipated-subname:unowned+locked-subname',
      ),
      () => ({
        canExtend: false,
        canSelfExtend: false,
        canSend: false,
        canSendOwner: false,
        canSendManager: false,
        canEdit: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditPermissions: false,
        canCreateSubdomains: false,
        canEditTTL: false,
        canDelete: false,
        canReclaim: false,
      }),
    )
    .with(P.union('dns-wrappped-2ld'), () => ({
      canExtend: false,
      canSelfExtend: false,
      canSend: true,
      canSendOwner: false,
      canSendManager: true,
      sendNameFunctionCallDetails: {
        sendManager: { contract: 'nameWrapper', method: 'safeTransferFrom' },
      },
      canEdit: true,
      canEditRecords: true,
      canEditResolver: true,
      canEditPermissions: true,
      canCreateSubdomains: true,
      canEditTTL: true,
      canDelete: false,
      canReclaim: false,
    }))
    .with(
      P.union(
        'eth-unwrapped-subname',
        'eth-unwrapped-subname+unwrapped-2ld:unowned',
        'eth-unwrapped-subname+unwrapped-2ld:grace-period:unowned',
        'eth-unwrapped-subname+emancipated-2ld:unowned',
        'eth-unwrapped-subname+emancipated-2ld:grace-period:unowned',
        'eth-unwrapped-subname+unwrapped-subname:unowned',
        'eth-unwrapped-subname+wrapped-subname:unowned',
        'eth-unwrapped-subname+emancipated-subname:unowned',
      ),
      () => ({
        canExtend: false,
        canSelfExtend: false,
        canSend: true,
        canSendOwner: false,
        canSendManager: true,
        sendNameFunctionCallDetails: { sendManager: { contract: 'registry', method: 'setOwner' } },
        canEdit: true,
        canEditRecords: true,
        canEditResolver: true,
        canEditPermissions: false,
        canCreateSubdomains: true,
        canEditTTL: true,
        canDelete: true,
        canDeleteContract: 'registry',
        canDeleteRequiresWrap: false,
        canDeleteMethod: 'setRecord',
        isParentOwner: false,
        canReclaim: false,
      }),
    )
    .with(
      P.union(
        'eth-unwrapped-subname:unowned+unwrapped-2ld',
        'eth-unwrapped-subname:unowned+unwrapped-2ld:manager',
        'eth-unwrapped-subname:unowned+unwrapped-2ld:grace-period',
        'eth-unwrapped-subname:unowned+unwrapped-subname',
      ),
      () => ({
        canExtend: false,
        canSelfExtend: false,
        canSend: true,
        canSendOwner: false,
        canSendManager: true,
        sendNameFunctionCallDetails: {
          sendManager: { contract: 'registry', method: 'setSubnodeOwner' },
        },
        canEdit: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditPermissions: false,
        canCreateSubdomains: false,
        canEditTTL: false,
        canDelete: true,
        canDeleteContract: 'registry',
        canDeleteRequiresWrap: false,
        canDeleteMethod: 'setSubnodeOwner',
        isParentOwner: true,
        canReclaim: false,
      }),
    )
    .with(P.union('eth-unwrapped-subname:unowned+unwrapped-2ld:owner'), () => ({
      canExtend: false,
      canSelfExtend: false,
      canSend: false,
      canSendOwner: false,
      canSendManager: false,
      canEdit: false,
      canEditRecords: false,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
      canDelete: false,
      canReclaim: false,
    }))
    .with(
      P.union(
        'eth-unwrapped-subname:unowned+emancipated-2ld',
        'eth-unwrapped-subname:unowned+wrapped-subname',
        'eth-unwrapped-subname:unowned+emancipated-subname',
      ),
      () => ({
        canExtend: false,
        canSelfExtend: false,
        canSend: false,
        canSendOwner: false,
        canSendManager: false,
        canEdit: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditPermissions: false,
        canCreateSubdomains: false,
        canEditTTL: false,
        canDelete: true,
        canDeleteContract: 'nameWrapper',
        canDeleteRequiresWrap: true,
        canDeleteMethod: 'setSubnodeOwner',
        isParentOwner: true,
        canReclaim: false,
      }),
    )
    .with(
      P.union(
        'eth-wrapped-subname',
        'eth-wrapped-subname+unwrapped-2ld:unowned',
        'eth-wrapped-subname+unwrapped-2ld:grace-period:unowned',
        'eth-wrapped-subname+emancipated-2ld:unowned',
        'eth-wrapped-subname+emancipated-2ld:grace-period:unowned',
        'eth-wrapped-subname+unwrapped-subname:unowned',
        'eth-wrapped-subname+wrapped-subname:unowned',
        'eth-wrapped-subname+emancipated-subname:unowned',
      ),
      () => ({
        canExtend: false,
        canSelfExtend: false,
        canSend: true,
        canSendOwner: false,
        canSendManager: true,
        sendNameFunctionCallDetails: {
          sendManager: { contract: 'nameWrapper', method: 'safeTransferFrom' },
        },
        canEdit: true,
        canEditRecords: true,
        canEditResolver: true,
        canEditPermissions: true,
        canCreateSubdomains: true,
        canEditTTL: true,
        canDelete: true,
        canDeleteContract: 'nameWrapper',
        canDeleteMethod: 'setRecord',
        isParentOwner: false,
        isPCCBurned: false,
        canReclaim: false,
      }),
    )
    .with(
      P.union(
        'eth-wrapped-subname:unowned+unwrapped-2ld',
        'eth-wrapped-subname:unowned+unwrapped-2ld:grace-period',
        'eth-wrapped-subname:unowned+unwrapped-subname',
      ),
      () => ({
        canExtend: false,
        canSelfExtend: false,
        canSend: false,
        canSendOwner: false,
        canSendManager: false,
        canEdit: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditPermissions: false,
        canCreateSubdomains: false,
        canEditTTL: false,
        canDelete: true,
        canDeleteContract: 'registry',
        canDeleteMethod: 'setSubnodeOwner',
        isParentOwner: true,
        isPCCBurned: false,
        canReclaim: false,
      }),
    )
    .with(
      P.union(
        'eth-wrapped-subname:unowned+emancipated-2ld',
        'eth-wrapped-subname:unowned+wrapped-subname',
        'eth-wrapped-subname:unowned+emancipated-subname',
      ),
      () => ({
        canExtend: false,
        canSelfExtend: false,
        canSend: true,
        canSendOwner: false,
        canSendManager: true,
        sendNameFunctionCallDetails: {
          sendManager: { contract: 'nameWrapper', method: 'setSubnodeOwner' },
        },
        canEdit: false,
        canEditRecords: false,
        canEditResolver: false,
        canEditPermissions: false,
        canCreateSubdomains: false,
        canEditTTL: false,
        canDelete: true,
        canDeleteContract: 'nameWrapper',
        canDeleteMethod: 'setSubnodeOwner',
        isParentOwner: true,
        isPCCBurned: false,
        canReclaim: false,
      }),
    )
    .with(
      P.union(
        'eth-emancipated-subname',
        'eth-emancipated-subname+emancipated-2ld:unowned',
        'eth-emancipated-subname+locked-subname:unowned',
      ),
      () => ({
        canExtend: false,
        canSelfExtend: false,
        canSend: true,
        canSendOwner: true,
        canSendManager: false,
        sendNameFunctionCallDetails: {
          sendOwner: { contract: 'nameWrapper', method: 'safeTransferFrom' },
        },
        canEdit: true,
        canEditRecords: true,
        canEditResolver: true,
        canEditPermissions: true,
        canCreateSubdomains: true,
        canEditTTL: true,
        canDelete: true,
        canDeleteContract: 'nameWrapper',
        canDeleteMethod: 'setRecord',
        isPCCBurned: true,
        isParentOwner: false,
        canReclaim: false,
      }),
    )
    .with(P.union('eth-emancipated-subname+locked-2ld:grace-period:unowned'), () => ({
      canExtend: false,
      canSelfExtend: false,
      canSend: false,
      canSendOwner: false,
      canSendManager: false,
      canEdit: true,
      canEditRecords: true,
      canEditResolver: true,
      canEditPermissions: true,
      canCreateSubdomains: true,
      canEditTTL: true,
      canDelete: true,
      canDeleteContract: 'nameWrapper',
      canDeleteMethod: 'setRecord',
      isPCCBurned: true,
      isParentOwner: false,
      canReclaim: false,
    }))
    .exhaustive()
}
