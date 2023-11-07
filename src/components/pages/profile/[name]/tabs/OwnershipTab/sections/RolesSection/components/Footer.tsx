import styled, { css } from 'styled-components'

import { Button } from '@ensdomains/thorin2'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    gap: ${theme.space[2]};
    min-height: ${theme.space[12]};
  `,
)

export const Footer = ({ buttons }: { buttons: any[] }) => {
  return (
    <Container>
      {buttons.map((button) => (
        <div>
          <Button
            key={button.label}
            colorStyle={button.primary ? 'accentPrimary' : 'accentSecondary'}
            prefix={button.prefix}
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        </div>
      ))}
    </Container>
  )
}
