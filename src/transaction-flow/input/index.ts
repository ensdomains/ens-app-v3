import { EditResolver } from './EditResolver'
import { SelectPrimaryName } from './SelectPrimaryName'

export const DataInputComponents = {
  EditResolver,
  SelectPrimaryName,
}

export type DataInputName = keyof typeof DataInputComponents

export type DataInputComponent = typeof DataInputComponents
