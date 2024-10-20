import dynamic from 'next/dynamic'
import { useContext, useEffect } from 'react'

import DynamicLoadingContext from '@app/components/@molecules/TransactionDialogManager/DynamicLoadingContext'

import TransactionLoader from '../TransactionLoader'
import type { Props as AdvancedEditorProps } from './AdvancedEditor/AdvancedEditor-flow'
import type { Props as CreateSubnameProps } from './CreateSubname-flow'
import type { Props as DeleteEmancipatedSubnameWarningProps } from './DeleteEmancipatedSubnameWarning/DeleteEmancipatedSubnameWarning-flow'
import type { Props as DeleteSubnameNotParentWarningProps } from './DeleteSubnameNotParentWarning/DeleteSubnameNotParentWarning-flow'
import type { Props as EditResolverProps } from './EditResolver/EditResolver-flow'
import type { Props as EditRolesProps } from './EditRoles/EditRoles-flow'
import type { Props as ExtendNamesProps } from './ExtendNames/ExtendNames-flow'
import type { Props as ProfileEditorProps } from './ProfileEditor/ProfileEditor-flow'
import type { Props as ProfileReclaimProps } from './ProfileReclaim-flow'
import type { Props as ResetPrimaryNameProps } from './ResetPrimaryName/ResetPrimaryName-flow'
import type { Props as RevokePermissionsProps } from './RevokePermissions/RevokePermissions-flow'
import type { Props as SelectPrimaryNameProps } from './SelectPrimaryName/SelectPrimaryName-flow'
import type { Props as SendNameProps } from './SendName/SendName-flow'
import type { Props as SyncManagerProps } from './SyncManager/SyncManager-flow'
import type { Props as UnknownLabelsProps } from './UnknownLabels/UnknownLabels-flow'
import type { Props as VerifyProfileProps } from './VerifyProfile/VerifyProfile-flow'

// Lazily load input components as needed
const dynamicHelper = <P,>(name: string) =>
  dynamic<P>(
    () =>
      import(
        /* webpackMode: "lazy" */
        /* webpackExclude: /\.test.tsx$/ */
        `./${name}-flow`
      ),
    {
      loading: () => {
        /* eslint-disable react-hooks/rules-of-hooks */
        const setLoading = useContext(DynamicLoadingContext)
        useEffect(() => {
          setLoading(true)
          return () => setLoading(false)
        }, [setLoading])
        return <TransactionLoader isComponentLoader />
        /* eslint-enable react-hooks/rules-of-hooks */
      },
    },
  )

const AdvancedEditor = dynamicHelper<AdvancedEditorProps>('AdvancedEditor/AdvancedEditor')
const CreateSubname = dynamicHelper<CreateSubnameProps>('CreateSubname')
const DeleteEmancipatedSubnameWarning = dynamicHelper<DeleteEmancipatedSubnameWarningProps>(
  'DeleteEmancipatedSubnameWarning/DeleteEmancipatedSubnameWarning',
)
const DeleteSubnameNotParentWarning = dynamicHelper<DeleteSubnameNotParentWarningProps>(
  'DeleteSubnameNotParentWarning/DeleteSubnameNotParentWarning',
)
const EditResolver = dynamicHelper<EditResolverProps>('EditResolver/EditResolver')
const EditRoles = dynamicHelper<EditRolesProps>('EditRoles/EditRoles')
const ExtendNames = dynamicHelper<ExtendNamesProps>('ExtendNames/ExtendNames')
const ProfileEditor = dynamicHelper<ProfileEditorProps>('ProfileEditor/ProfileEditor')
const ProfileReclaim = dynamicHelper<ProfileReclaimProps>('ProfileReclaim')
const ResetPrimaryName = dynamicHelper<ResetPrimaryNameProps>('ResetPrimaryName/ResetPrimaryName')
const RevokePermissions = dynamicHelper<RevokePermissionsProps>(
  'RevokePermissions/RevokePermissions',
)
const SelectPrimaryName = dynamicHelper<SelectPrimaryNameProps>(
  'SelectPrimaryName/SelectPrimaryName',
)
const SendName = dynamicHelper<SendNameProps>('SendName/SendName')
const SyncManager = dynamicHelper<SyncManagerProps>('SyncManager/SyncManager')
const UnknownLabels = dynamicHelper<UnknownLabelsProps>('UnknownLabels/UnknownLabels')
const VerifyProfile = dynamicHelper<VerifyProfileProps>('VerifyProfile/VerifyProfile')

export const DataInputComponents = {
  AdvancedEditor,
  CreateSubname,
  DeleteEmancipatedSubnameWarning,
  DeleteSubnameNotParentWarning,
  EditResolver,
  EditRoles,
  ExtendNames,
  ProfileEditor,
  ProfileReclaim,
  ResetPrimaryName,
  RevokePermissions,
  SelectPrimaryName,
  SendName,
  SyncManager,
  UnknownLabels,
  VerifyProfile,
}

export type DataInputName = keyof typeof DataInputComponents

export type DataInputComponent = typeof DataInputComponents
