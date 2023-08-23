import styled, { css } from 'styled-components'

import { RightArrowSVG, Typography } from '@ensdomains/thorin'

import { AvatarWithIdentifier } from '@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier'

type Props = {
  address: string
  role: string
  onClick?: () => void
}

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[4]};
    padding: ${theme.space[4]};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
  `,
)

const Title = styled(Typography)(
  () => css`
    text-transform: capitalize;
  `,
)

const Divider = styled.div(
  ({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.border};
    margin: ${theme.space[2]} -${theme.space[2]};
  `,
)

const Footer = styled.button(
  () => css`
    display: flex;
    justify-content: space-between;
  `,
)

export const EditRoleRow = ({ address, role, onClick }: Props) => {
  return (
    <Container>
      <Title fontVariant="bodyBold">{role}</Title>
      <Typography fontVariant="small" color="grey">
        description
      </Typography>
      <Divider />
      <Footer type="button" onClick={onClick}>
        <AvatarWithIdentifier address={address} size="8" />
        <div>
          Change
          <RightArrowSVG />
        </div>
      </Footer>
    </Container>
  )
}
