import styled, { css } from 'styled-components'
import { DynamicContentHashIcon } from '../../../../assets/contentHash/DynamicContentHashIcon'

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
    value: 'ipfs',
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
