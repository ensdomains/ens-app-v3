import dynamic from 'next/dynamic'
import type { Props as ProfileEditorProps } from './ProfileEditor/ProfileEditor'
import type { Props as AdvancedEditorProps } from './AdvancedEditor/AdvancedEditor'
import type { Props as EditResolverProps } from './EditResolver'
import type { Props as SelectPrimaryNameProps } from './SelectPrimaryName'

const EditResolver = dynamic<EditResolverProps>(() =>
  import('./EditResolver').then((mod) => mod.EditResolver),
)
const SelectPrimaryName = dynamic<SelectPrimaryNameProps>(() =>
  import('./SelectPrimaryName').then((mod) => mod.SelectPrimaryName),
)
const AdvancedEditor = dynamic<AdvancedEditorProps>(() =>
  import('./AdvancedEditor/AdvancedEditor').then((mod) => mod.default),
)
const ProfileEditor = dynamic<ProfileEditorProps>(() =>
  import('./ProfileEditor/ProfileEditor').then((mod) => mod.default),
)

export const DataInputComponents = {
  EditResolver,
  ProfileEditor,
  AdvancedEditor,
  SelectPrimaryName,
}

export type DataInputName = keyof typeof DataInputComponents

export type DataInputComponent = typeof DataInputComponents
