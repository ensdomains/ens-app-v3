import styled, { css } from 'styled-components'

import { Avatar, UpRightArrowSVG } from '@ensdomains/thorin'

import { useAvatar } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { useZorb } from '@app/hooks/useZorb'
import { getDestination } from '@app/routes'

const Container = styled.a(
  ({ theme }) => css`
    display: block;
    position: relative;
    width: ${theme.space.full};
    height: ${theme.space.full};
    transition: transform 0.2s ease-in-out;

    :hover {
      transform: translateY(-1px);
    }
  `,
)

const Border = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: ${theme.space.full};
    height: ${theme.space.full};
    border-radius: ${theme.radii.full};
    border: 4px solid ${theme.colors.bluePrimary};
  `,
)

const IconWrapper = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${theme.space['7']};
    height: ${theme.space['7']};
    border-radius: ${theme.radii.full};
    background: ${theme.colors.bluePrimary};
    color: ${theme.colors.backgroundPrimary};

    svg {
      width: ${theme.space['3']};
      height: ${theme.space['3']};
    }
  `,
)

type Props = {
  name?: string
  label: string
}

export const AvatarWithLink = ({ name, label }: Props) => {
  const chainId = useChainId()
  const { avatar } = useAvatar(name, chainId)
  const zorb = useZorb(name || '', 'name')
  const profileURL = getDestination(`/profile/${name}`) as string
  return (
    <Container href={profileURL} data-testid="avatar-with-link">
      <Avatar src={avatar || zorb} label={label} />
      <Border />
      <IconWrapper>
        <UpRightArrowSVG />
      </IconWrapper>
    </Container>
  )
}
