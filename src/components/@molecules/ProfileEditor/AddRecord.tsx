import { AddRecordButton } from '@app/components/@molecules/AddRecordButton/AddRecordButton'
import useProfileEditor from '@app/hooks/useProfileEditor'
import styled, { css } from 'styled-components'

const AddRecordContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

type Props = {
  AddButtonProps: ReturnType<typeof useProfileEditor>['AddButtonProps']
}

const AddRecord = ({ AddButtonProps }: Props) => {
  if (!AddButtonProps) return null
  return (
    <AddRecordContainer>
      <AddRecordButton {...AddButtonProps} />
    </AddRecordContainer>
  )
}

export default AddRecord
