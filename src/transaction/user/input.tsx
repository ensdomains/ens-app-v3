import dynamic from 'next/dynamic'
import { useContext, useEffect, type ComponentProps } from 'react'

import DynamicLoadingContext from '@app/components/@molecules/TransactionDialogManager/DynamicLoadingContext'

import TransactionLoader from '../components/TransactionLoader'
import type { Props as AdvancedEditorProps } from './input/AdvancedEditor/AdvancedEditor-flow'
import type { Props as CreateSubnameProps } from './input/CreateSubname/CreateSubname-flow'
import type { Props as DeleteEmancipatedSubnameWarningProps } from './input/DeleteEmancipatedSubnameWarning/DeleteEmancipatedSubnameWarning-flow'
import type { Props as DeleteSubnameNotParentWarningProps } from './input/DeleteSubnameNotParentWarning/DeleteSubnameNotParentWarning-flow'
import type { Props as EditResolverProps } from './input/EditResolver/EditResolver-flow'
import type { Props as EditRolesProps } from './input/EditRoles/EditRoles-flow'
import type { Props as ExtendNamesProps } from './input/ExtendNames/ExtendNames-flow'
import type { Props as ProfileEditorProps } from './input/ProfileEditor/ProfileEditor-flow'
import type { Props as ResetPrimaryNameProps } from './input/ResetPrimaryName/ResetPrimaryName-flow'
import type { Props as RevokePermissionsProps } from './input/RevokePermissions/RevokePermissions-flow'
import type { Props as SelectPrimaryNameProps } from './input/SelectPrimaryName/SelectPrimaryName-flow'
import type { Props as SendNameProps } from './input/SendName/SendName-flow'
import type { Props as SyncManagerProps } from './input/SyncManager/SyncManager-flow'
import type { Props as UnknownLabelsProps } from './input/UnknownLabels/UnknownLabels-flow'
import type { Props as VerifyProfileProps } from './input/VerifyProfile/VerifyProfile-flow'

// Lazily load input components as needed
const dynamicHelper = <P,>(name: string) =>
  dynamic<P>(
    () =>
      import(
        /* webpackMode: "lazy" */
        /* webpackExclude: /\.test.tsx$/ */
        `./input/${name}-flow`
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
const CreateSubname = dynamicHelper<CreateSubnameProps>('CreateSubname/CreateSubname')
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

export const transactionInputComponents = {
  AdvancedEditor,
  CreateSubname,
  DeleteEmancipatedSubnameWarning,
  DeleteSubnameNotParentWarning,
  EditResolver,
  EditRoles,
  ExtendNames,
  ProfileEditor,
  ResetPrimaryName,
  RevokePermissions,
  SelectPrimaryName,
  SendName,
  SyncManager,
  UnknownLabels,
  VerifyProfile,
}

export type TransactionInputName = keyof typeof transactionInputComponents

export type TransactionInputComponent = typeof transactionInputComponents

export type GenericTransactionInput<
  name extends TransactionInputName = TransactionInputName,
  data extends ComponentProps<TransactionInputComponent[name]> = ComponentProps<
    TransactionInputComponent[name]
  >,
> = {
  name: name
  data: data
}
export type TransactionInput = {
  [name in TransactionInputName]: GenericTransactionInput<name>
}[TransactionInputName]
