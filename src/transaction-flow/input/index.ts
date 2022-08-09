import AdvancedEditor from './AdvancedEditor/AdvancedEditor'
import { CreateSubname } from './CreateSubname'
import { EditResolver } from './EditResolver'
import ProfileEditor from './ProfileEditor/ProfileEditor'
import { SelectPrimaryName } from './SelectPrimaryName'

export const DataInputComponents = {
  EditResolver,
  ProfileEditor,
  AdvancedEditor,
  SelectPrimaryName,
  CreateSubname,
}

export type DataInputName = keyof typeof DataInputComponents

export type DataInputComponent = typeof DataInputComponents
