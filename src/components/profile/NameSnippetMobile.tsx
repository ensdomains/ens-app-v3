import FastForwardSVG from '@app/assets/FastForward.svg'
import PaperPlaneSVG from '@app/assets/PaperPlane.svg'
import TripleDotSVG from '@app/assets/TripleDot.svg'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { formatExpiry } from '@app/utils/utils'
import { Typography } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import { Card } from '../Card'
import { NFTWithPlaceholder } from '../NFTWithPlaceholder'
import { OutlinedButton } from '../OutlinedButton'
import { FavouriteButton } from './FavouriteButton'

const Container = styled(Card)(
  ({ theme }) => css`
    padding: ${theme.space['3']};
    width: ${theme.space.full};
    align-items: stretch;
    gap: ${theme.space['3']};
  `,
)

const ImageWrapper = styled(NFTWithPlaceholder)(
  ({ theme }) => css`
    border-radius: ${theme.radii.extraLarge};
    width: 35vw;
    height: 35vw;
    max-width: 170px;
    max-height: 170px;
  `,
)

const RightColumn = styled.div(
  ({ theme }) => css`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-self: flex-end;
    justify-content: flex-end;
    height: ${theme.space.full};
    gap: ${theme.space['1']};
  `,
)

const ExpiresHeading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const ExpiryAndFavouriteRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.space['1']};
  `,
)

const RowWithGap = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1']};
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

export const NameSnippetMobile = ({
  name,
  network,
  expiryDate,
  canSend,
}: {
  name: string
  network: number
  expiryDate?: Date | null
  canSend?: boolean
}) => {
  const breakpoints = useBreakpoint()

  return (
    <Container>
      <ImageWrapper name={name} network={network} />
      <RightColumn>
        <ExpiryAndFavouriteRow>
          {expiryDate ? (
            <div>
              <ExpiresHeading variant="label">Expires</ExpiresHeading>
              <Typography variant="small" weight="bold">
                {formatExpiry(expiryDate)}
              </Typography>
            </div>
          ) : (
            <Typography>No expiry</Typography>
          )}
          <FavouriteButton />
        </ExpiryAndFavouriteRow>
        {expiryDate && (
          <OutlinedButton size="small" shadowless variant="transparent">
            <InnerButton>
              {breakpoints.xs && <ButtonIcon as={FastForwardSVG} />}
              <Typography weight="bold">Extend</Typography>
            </InnerButton>
          </OutlinedButton>
        )}
        {canSend && (
          <RowWithGap>
            <div style={{ flexGrow: 1 }}>
              <OutlinedButton size="small" shadowless variant="transparent">
                <InnerButton>
                  {breakpoints.xs && <ButtonIcon as={PaperPlaneSVG} />}
                  <Typography weight="bold">Send</Typography>
                </InnerButton>
              </OutlinedButton>
            </div>
            <OutlinedButton size="small" shadowless variant="transparent">
              <InnerButton>
                <ButtonIcon as={TripleDotSVG} />
              </InnerButton>
            </OutlinedButton>
          </RowWithGap>
        )}
      </RightColumn>
    </Container>
  )
}
