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
    max-height: 75vh;
    overflow-y: auto;

    ${mq.sm.min(css`
      width: initial;
      min-width: ${theme.space['128']};
    `)}
  `,
)

export const AvatarViewManager = ({
  handleCancel,
  handleSubmit,
  avatar,
  name,
}: {
  handleCancel: () => void
  handleSubmit: (uri: string) => void
  name: string
  avatar?: File
}) => {
  const Component = avatar ? AvatarUpload : AvatarNFT

  return (
    <Card>
      <Component
        name={name}
        avatar={avatar!}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      />
    </Card>
  )
}
