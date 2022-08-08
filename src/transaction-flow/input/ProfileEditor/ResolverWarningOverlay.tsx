import { Button, Typography } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

const Container = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      41.95% 17.64% at 50.14% 50.08%,
      #ffffff 0%,
      rgba(255, 255, 255, 0.81) 100%
    );
    backdrop-filter: blur(8px);
    border-radius: ${theme.radii.extraLarge};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    width: 90%;
    max-width: ${theme.space['72']};
  `,
)

const Message = styled.div(({ theme }) => css``)

const Title = styled(Typography)(({ theme }) => css``)

const Subtitle = styled(Typography)(({ theme }) => css``)

type Props = {}

const ResolverWarningOverlay = ({}: Props) => {
  return (
    <Container>
      <Content>
        <Message>
          <Title variant="extraLarge">Your resolver is out of date</Title>
          <Subtitle variant="base" weight="medium">
            Profile editing is disabled until you upgrade your resolver
          </Subtitle>
        </Message>
        <Button>Upgrade</Button>
      </Content>
    </Container>
  )
}

export default ResolverWarningOverlay
