import { useWatch } from 'react-hook-form'
import styled, { css } from 'styled-components'

import { AddRecordButton } from '@app/components/@molecules/AddRecordButton/AddRecordButton'
import useProfileEditor from '@app/hooks/useProfileEditor'
import { ProfileEditorType } from '@app/types'

import { convertFormSafeKey } from '../../../utils/editor'

const AddRecordContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

type Props = {
  control: ReturnType<typeof useProfileEditor>['control']
  AddButtonProps: ReturnType<typeof useProfileEditor>['AddButtonProps']
}

const AddRecord = ({ control, AddButtonProps }: Props) => {
  const editor = useWatch<ProfileEditorType>({
    control,
    name: ['avatar', 'general', 'accounts', 'other'],
  })

  const [avatar, general, accounts, other] = editor
  const reservedKeys = [
    ...(avatar ? ['avatar'] : []),
    ...Object.keys(general || {}),
    ...Object.keys(accounts || {}),
    ...Object.keys(other || {}),
  ].map((key) => convertFormSafeKey(key))

  if (!AddButtonProps) return null
  return (
    <AddRecordContainer>
      <AddRecordButton {...AddButtonProps} reservedKeys={reservedKeys} />
    </AddRecordContainer>
  )
}

export default AddRecord
