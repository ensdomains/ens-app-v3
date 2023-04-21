import styled, { css } from 'styled-components'

import { RightArrowSVG, Typography } from '@ensdomains/thorin'

const Container = styled.button(
  ({ theme }) => css`
    background-color: ${theme.colors.yellowSurface};
    display: flex;
    padding: ${theme.space['4']};
    gap: ${theme.space['4']};
    width: 100%;
    border-radius: ${theme.radii.large};
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: ${theme.colors.yellowLight};
      transform: translateY(-1px);
    }
  `,
)

const StyledTypography = styled(Typography)(
  () => css`
    flex: 1;
    text-align: left;
  `,
)

const SkipLabel = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.yellowDim};
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
    padding: ${theme.space['2']};
  `,
)

type Props = {
  description: string
  actionLabel?: string
  onClick?: () => void
}

export const SkipButton = ({ description, actionLabel = 'Skip', onClick, ...props }: Props) => {
  return (
    <Container type="button" onClick={onClick} {...props}>
      <StyledTypography fontVariant="small">{description}</StyledTypography>
      <SkipLabel>
        <Typography fontVariant="bodyBold" color="yellowDim">
          {actionLabel}
        </Typography>
        <RightArrowSVG />
      </SkipLabel>
    </Container>
  )
}
