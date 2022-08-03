import textRecords from '@app/constants/textRecords.json'
import supportedTexts from '@app/constants/supportedTexts.json'
import styled, { css } from 'styled-components'
import { formSafeKey } from '@app/utils/editor'

const LabelWrapper = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.bold};
  `,
)

export const textOptions = [...textRecords, ...supportedTexts].map((key) => ({
  value: formSafeKey(key),
  label: key,
  node: <LabelWrapper>{key}</LabelWrapper>,
}))
