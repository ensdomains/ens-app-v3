import { Typography } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import { NameAvatar } from '../AvatarWithZorb'

const Container = styled.div(
  ({ theme }) => css`
    border-radius: ${theme.radii.full};
    border: 1px solid ${theme.colors.borderSecondary};
    padding: ${theme.space['1']};
    padding-right: ${theme.space['4']};

    height: ${theme.space['9']};

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['7']};
    height: ${theme.space['7']};
  `,
)

export const NamePill = ({ name, network }: { name: string; network: number }) => {
  return (
    <Container>
      <AvatarWrapper>
        <NameAvatar label={name} name={name} network={network} />
      </AvatarWrapper>
      <Typography>{name}</Typography>
    </Container>
  )
}
