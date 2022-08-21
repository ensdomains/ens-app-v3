import styled, { css } from 'styled-components'
import { formSafeKey } from '@app/utils/editor'
import { DynamicContentHashIcon } from '@app/assets/contentHash/DynamicContentHashIcon'

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

const websiteOptions = [
  {
    value: formSafeKey('ipfs'),
    label: 'IPFS',
    node: <LabelWrapper>IPFS</LabelWrapper>,
    prefix: (
      <IconWrapper>
        <DynamicContentHashIcon name="ipfs" />
      </IconWrapper>
    ),
  },
]

export default websiteOptions
