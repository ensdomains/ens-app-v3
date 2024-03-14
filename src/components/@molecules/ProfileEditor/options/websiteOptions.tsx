import styled, { css } from 'styled-components'

import { DynamicContentHashIcon } from '@app/assets/contentHash/DynamicContentHashIcon'
import { supportedContentHashKeys } from '@app/constants/supportedContentHashKeys'
import { formSafeKey } from '@app/utils/editor'

const IconWrapper = styled.div(
  () => css`
    width: 22px;
    display: flex;
    align-items: center;
  `,
)

const LabelWrapper = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.bold};
  `,
)

export default supportedContentHashKeys.map((value) => ({
  value: formSafeKey(value),
  label: value.toUpperCase(),
  node: <LabelWrapper>{value.toUpperCase()}</LabelWrapper>,
  prefix: (
    <IconWrapper>
      <DynamicContentHashIcon name={value} />
    </IconWrapper>
  ),
}))
