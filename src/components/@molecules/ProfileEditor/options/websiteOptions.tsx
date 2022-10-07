import styled, { css } from 'styled-components'

import {
  ContentHashIconType,
  DynamicContentHashIcon,
} from '@app/assets/contentHash/DynamicContentHashIcon'
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

const SUPPORTED_CONTENT_HASHES: ContentHashIconType[] = [
  'ipfs',
  'swarm',
  'onion',
  'skynet',
  'arweave',
]
// const websiteOptions = [
//   {
//     value: formSafeKey('ipfs'),
//     label: 'IPFS',
//     node: <LabelWrapper>IPFS</LabelWrapper>,
//     prefix: (
//       <IconWrapper>
//         <DynamicContentHashIcon name="ipfs" />
//       </IconWrapper>
//     ),
//   },
//   {},
// ]

export default SUPPORTED_CONTENT_HASHES.map((value) => ({
  value: formSafeKey(value),
  label: value.toUpperCase(),
  node: <LabelWrapper>{value.toUpperCase()}</LabelWrapper>,
  prefix: (
    <IconWrapper>
      <DynamicContentHashIcon name={value} />
    </IconWrapper>
  ),
}))
