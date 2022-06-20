import FastForwardSVG from '@app/assets/FastForward.svg'
import PaperPlaneSVG from '@app/assets/PaperPlane.svg'
import TripleDotSVG from '@app/assets/TripleDot.svg'
import { Card } from '@app/components/Card'
import { OutlinedButton } from '@app/components/OutlinedButton'
import { formatExpiry } from '@app/utils/utils'
import { Typography } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import { FavouriteButton } from '../FavouriteButton'

const Container = styled(Card)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.space['3']};
    & > div:first-of-type {
      margin-bottom: ${theme.space['3']};
    }
  `,
)

const ExpiryContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: ${theme.space['1']};
    & > div:first-of-type {
      color: ${theme.colors.textTertiary};
    }
  `,
)

const Row = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['1.5']};
    flex-gap: ${theme.space['1.5']};
  `,
)

const FullWidthOutlinedButton = styled(OutlinedButton)(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

const InnerButton = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const ButtonIcon = styled.svg(
  ({ theme }) => css`
    display: block;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

export const DetailSnippet = ({
  expiryDate,
  canSend,
}: {
  expiryDate?: Date | null
  canSend: boolean
}) => {
  return (
    <Container>
      <Row>
        {expiryDate && (
          <ExpiryContainer data-testid="expiry-data">
            <Typography weight="bold">Expires</Typography>
            <Typography weight="bold">{formatExpiry(expiryDate)}</Typography>
          </ExpiryContainer>
        )}
        <FavouriteButton />
      </Row>
      <Row>
        {expiryDate && (
          <FullWidthOutlinedButton
            size="small"
            shadowless
            variant="transparent"
          >
            <InnerButton>
              <ButtonIcon as={FastForwardSVG} />
              <Typography weight="bold">Extend</Typography>
            </InnerButton>
          </FullWidthOutlinedButton>
        )}
        {canSend && (
          <FullWidthOutlinedButton
            size="small"
            shadowless
            variant="transparent"
          >
            <InnerButton>
              <ButtonIcon as={PaperPlaneSVG} />
              <Typography weight="bold">Send</Typography>
            </InnerButton>
          </FullWidthOutlinedButton>
        )}
        <OutlinedButton size="extraSmall" shadowless variant="transparent">
          <InnerButton>
            <ButtonIcon as={TripleDotSVG} />
          </InnerButton>
        </OutlinedButton>
      </Row>
    </Container>
  )
}
