import textRecords from '@app/constants/textRecords.json'
import supportedTexts from '@app/constants/supportedTexts.json'
import styled, { css } from 'styled-components'

const LabelWrapper = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.bold};
  `,
)

export const textOptions = [...textRecords, ...supportedTexts].map((key) => ({
  value: key,
  label: key,
  node: <LabelWrapper>{key}</LabelWrapper>,
}))
