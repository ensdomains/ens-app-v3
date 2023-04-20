import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { NameAvatar } from '../AvatarWithZorb'

const Container = styled.div(
  ({ theme }) => css`
    border-radius: ${theme.radii.full};
    border: 1px solid ${theme.colors.border};
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
    flex: 0 0 ${theme.space['7']};
    width: ${theme.space['7']};
    height: ${theme.space['7']};
  `,
)

const TypographyWrapper = styled.div(
  () => css`
    flex: 1;
    overflow: hidden;
  `,
)

export const NamePill = ({
  name,
  truncatedName = name,
  network,
}: {
  name: string
  truncatedName?: string
  network: number
}) => {
  return (
    <Container>
      <AvatarWrapper>
        <NameAvatar label={name} name={truncatedName} network={network} />
      </AvatarWrapper>
      <TypographyWrapper>
        <Typography ellipsis>{truncatedName}</Typography>
      </TypographyWrapper>
    </Container>
  )
}
