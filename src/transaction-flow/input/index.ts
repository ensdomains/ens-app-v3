import { EditResolver } from './EditResolver'
import ProfileEditor from './ProfileEditor/ProfileEditor'
import AdvancedEditor from './AdvancedEditor/AdvancedEditor'
import { SelectPrimaryName } from './SelectPrimaryName'

export const DataInputComponents = {
  EditResolver,
  ProfileEditor,
  AdvancedEditor,
  SelectPrimaryName,
}

export type DataInputName = keyof typeof DataInputComponents

export type DataInputComponent = typeof DataInputComponents
