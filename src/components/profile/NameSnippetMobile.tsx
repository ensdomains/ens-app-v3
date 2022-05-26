import FastForwardSVG from '@app/assets/FastForward.svg'
import PaperPlaneSVG from '@app/assets/PaperPlane.svg'
import TripleDotSVG from '@app/assets/TripleDot.svg'
import { formatExpiry } from '@app/utils/utils'
import { Typography } from '@ensdomains/thorin'
import styled from 'styled-components'
import { Card } from '../Card'
import { NFTWithPlaceholder } from '../NFTWithPlaceholder'
import { OutlinedButton } from '../OutlinedButton'
import { FavouriteButton } from './FavouriteButton'

const Container = styled(Card)`
  ${({ theme }) => `
    padding: ${theme.space['3']};
    width: ${theme.space.full};
    align-items: stretch;
    gap: ${theme.space['3']};
  `}
`

const ImageWrapper = styled(NFTWithPlaceholder)`
  ${({ theme }) => `
    border-radius: ${theme.radii.extraLarge};
    width: 170px;
    height: 170px;
  `}
`

const RightColumn = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  justify-content: flex-end;
  ${({ theme }) => `
    height: ${theme.space.full};
    gap: ${theme.space['1']};
  `}
`

const ExpiresHeading = styled(Typography)`
  ${({ theme }) => `
    color: ${theme.colors.textTertiary};
  `}
`

const ExpiryAndFavouriteRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => `
    margin-bottom: ${theme.space['1']};
  `}
`

const RowWithGap = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1']};
  `}
`

const InnerButton = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `}
`

const ButtonIcon = styled.svg`
  ${({ theme }) => `
    display: block;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `}
`

export const NameSnippetMobile = ({
  name,
  network,
  expiryDate,
  canSend,
}: {
  name: string
  network: string
  expiryDate?: Date | null
  canSend?: boolean
}) => {
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
              <ButtonIcon as={FastForwardSVG} />
              <Typography weight="bold">Extend</Typography>
            </InnerButton>
          </OutlinedButton>
        )}
        {canSend && (
          <RowWithGap>
            <div style={{ flexGrow: 1 }}>
              <OutlinedButton size="small" shadowless variant="transparent">
                <InnerButton>
                  <ButtonIcon as={PaperPlaneSVG} />
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
