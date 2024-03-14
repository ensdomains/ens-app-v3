import styled, { css } from 'styled-components'

import { supportedSocialRecordKeys } from '@app/constants/supportedSocialRecordKeys'
import { textRecords } from '@app/constants/textRecords'
import { formSafeKey } from '@app/utils/editor'

const LabelWrapper = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.bold};
  `,
)

export const textOptions = [...textRecords, ...supportedSocialRecordKeys].map((key) => ({
  value: formSafeKey(key),
  label: key,
  node: <LabelWrapper>{key}</LabelWrapper>,
}))
