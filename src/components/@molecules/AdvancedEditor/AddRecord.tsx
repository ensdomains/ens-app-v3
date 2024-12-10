import { useWatch } from 'react-hook-form'
import styled, { css } from 'styled-components'

import { AddRecordButton } from '@app/components/@molecules/AddRecordButton/AddRecordButton'
import useAdvancedEditor, { AdvancedEditorType } from '@app/hooks/useAdvancedEditor'

import { convertFormSafeKey } from '../../../utils/editor'

const AddRecordContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    @media (min-width: ${theme.breakpoints.sm}px) {
      margin-top: -${theme.space['2']};
    }
  `,
)

type Props = {
  control: ReturnType<typeof useAdvancedEditor>['control']
  AddButtonProps: ReturnType<typeof useAdvancedEditor>['AddButtonProps']
}

const AddRecord = ({ control, AddButtonProps }: Props) => {
  const editor = useWatch<AdvancedEditorType>({
    control,
    name: ['text'],
  })

  const [text] = editor
  const reservedKeys = [...Object.keys(text || {})].map((key) => convertFormSafeKey(key))

  if (!AddButtonProps) return null
  return (
    <AddRecordContainer>
      <AddRecordButton {...AddButtonProps} reservedKeys={reservedKeys} />
    </AddRecordContainer>
  )
}

export default AddRecord
