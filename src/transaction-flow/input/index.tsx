import dynamic from 'next/dynamic'
import TransactionLoader from '../TransactionLoader'
import type { Props as ProfileEditorProps } from './ProfileEditor/ProfileEditor'
import type { Props as AdvancedEditorProps } from './AdvancedEditor/AdvancedEditor'
import type { Props as EditResolverProps } from './EditResolver/EditResolver'
import type { Props as SelectPrimaryNameProps } from './SelectPrimaryName'

const EditResolver = dynamic<EditResolverProps>(
  () => import('./EditResolver/EditResolver').then((mod) => mod.EditResolver),
  {
    loading: () => <TransactionLoader />,
  },
)
const SelectPrimaryName = dynamic<SelectPrimaryNameProps>(
  () => import('./SelectPrimaryName').then((mod) => mod.SelectPrimaryName),
  {
    loading: () => <TransactionLoader />,
  },
)
const AdvancedEditor = dynamic<AdvancedEditorProps>(
  () => import('./AdvancedEditor/AdvancedEditor'),
  {
    loading: () => <TransactionLoader />,
  },
)
const ProfileEditor = dynamic<ProfileEditorProps>(() => import('./ProfileEditor/ProfileEditor'), {
  loading: () => <TransactionLoader />,
})

export const DataInputComponents = {
  EditResolver,
  ProfileEditor,
  AdvancedEditor,
  SelectPrimaryName,
}

export type DataInputName = keyof typeof DataInputComponents

export type DataInputComponent = typeof DataInputComponents
