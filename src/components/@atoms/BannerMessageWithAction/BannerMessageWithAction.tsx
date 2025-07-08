import { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Button } from '@ensdomains/thorin'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['4']};
    border-radius: ${theme.radii.medium};

    @media (max-width: ${theme.breakpoints.md}px) {
      flex-direction: column;
      align-items: stretch;
      gap: ${theme.space['3']};
    }
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    flex: 1;
    font-size: ${theme.fontSizes.body};
    line-height: ${theme.lineHeights.body};
    color: ${theme.colors.text};
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    flex-shrink: 0;
    margin-top: -25px;

    @media (max-width: ${theme.breakpoints.sm}px) {
      width: 100%;
      margin-top: 0;

      button {
        width: 100%;
      }
    }
  `,
)

type BannerMessageWithActionProps = {
  content: string | ReactNode
  button: React.ComponentProps<typeof Button> | null
}

export const BannerMessageWithAction = ({ content, button }: BannerMessageWithActionProps) => {
  return (
    <Container>
      <Content>{content}</Content>
      {button && (
        <ButtonContainer>
          <Button {...button} />
        </ButtonContainer>
      )}
    </Container>
  )
}
