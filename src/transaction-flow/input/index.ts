import { EditResolver } from './EditResolver'
import { BurnFuses } from './BurnFuses'
import { SelectPrimaryName } from './SelectPrimaryName'

export const DataInputComponents = {
  EditResolver,
  BurnFuses,
  SelectPrimaryName,
}

export type DataInputName = keyof typeof DataInputComponents

export type DataInputComponent = typeof DataInputComponents
