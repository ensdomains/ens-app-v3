import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Toggle, Typography } from '@ensdomains/thorin'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    width: 100%;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    border: 1px solid ${theme.colors.border};
  `,
)

const ContentContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    flex-direction: column;
    gap: ${theme.space['1']};
  `,
)

type ToggleProps = ComponentProps<typeof Toggle>

type Props = {
  title?: string
  description?: string
} & ToggleProps

export const DetailedSwitch = ({ title, description, ...toggleProps }: Props) => {
  return (
    <Container data-testid="detailed-switch">
      <ContentContainer>
        {title && <Typography fontVariant="bodyBold">{title}</Typography>}{' '}
        {description && <Typography fontVariant="small">{description}</Typography>}
      </ContentContainer>
      <Toggle {...toggleProps} size="large" />
    </Container>
  )
}
