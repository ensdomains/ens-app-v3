import dynamic from 'next/dynamic'
import TransactionLoader from '../TransactionLoader'
import type { Props as AdvancedEditorProps } from './AdvancedEditor/AdvancedEditor'
import type { Props as CreateSubnameProps } from './CreateSubname'
import type { Props as EditResolverProps } from './EditResolver/EditResolver'
import type { Props as ProfileEditorProps } from './ProfileEditor/ProfileEditor'
import type { Props as SelectPrimaryNameProps } from './SelectPrimaryName'
import type { Props as TransferProfileProps } from './TransferProfile/TransferProfile'

const dynamicHelper = <P,>(name: string) =>
  dynamic<P>(
    () =>
      import(
        /* webpackExclude: /\.test.tsx$/ */
        `./${name}`
      ),
    { loading: () => <TransactionLoader /> },
  )

const EditResolver = dynamicHelper<EditResolverProps>('EditResolver/EditResolver')
const SelectPrimaryName = dynamicHelper<SelectPrimaryNameProps>('SelectPrimaryName')
const AdvancedEditor = dynamicHelper<AdvancedEditorProps>('AdvancedEditor/AdvancedEditor')
const ProfileEditor = dynamicHelper<ProfileEditorProps>('ProfileEditor/ProfileEditor')
const CreateSubname = dynamicHelper<CreateSubnameProps>('CreateSubname')

const TransferProfile = dynamic<TransferProfileProps>(
  () => import('./TransferProfile/TransferProfile'),
  {
    loading: () => <TransactionLoader />,
  },
)

export const DataInputComponents = {
  EditResolver,
  ProfileEditor,
  AdvancedEditor,
  SelectPrimaryName,
  TransferProfile,
  CreateSubname,
}

export type DataInputName = keyof typeof DataInputComponents

export type DataInputComponent = typeof DataInputComponents
