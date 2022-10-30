import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import { AvatarNFT } from './AvatarNFT'
import { AvatarUpload } from './AvatarUpload'

const Card = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['3.5']};
    border-radius: ${theme.radii['3xLarge']};
    background-color: ${theme.colors.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    gap: ${theme.space['4']};
    max-height: 85vh;
    overflow-y: auto;

    ${mq.sm.min(css`
      width: initial;
      min-width: ${theme.space['128']};
    `)}
  `,
)

export const AvatarViewManager = ({
  type,
  avatar,
  ...props
}: {
  handleCancel: () => void
  handleSubmit: (uri: string) => void
  name: string
  avatar?: File
  type: 'upload' | 'nft'
}) => {
  return (
    <Card>
      {type === 'upload' ? <AvatarUpload avatar={avatar!} {...props} /> : <AvatarNFT {...props} />}
    </Card>
  )
}
