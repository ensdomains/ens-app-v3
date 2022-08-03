import { EditResolver } from './EditResolver'
import ProfileEditor from './ProfileEditor/ProfileEditor'
import AdvancedEditor from './AdvancedEditor/AdvancedEditor'

export type DataInputName = 'EditResolver' | 'ProfileEditor'

export const DataInputComponents = {
  EditResolver,
  ProfileEditor,
  AdvancedEditor,
}

export type DataInputComponent = typeof DataInputComponents
