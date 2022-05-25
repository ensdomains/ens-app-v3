import FastForwardSVG from '@app/assets/FastForward.svg'
import HeartSVG from '@app/assets/Heart.svg'
import PaperPlaneSVG from '@app/assets/PaperPlane.svg'
import TripleDotSVG from '@app/assets/TripleDot.svg'
import { formatExpiry } from '@app/utils/utils'
import { Button, Typography } from '@ensdomains/thorin'
import { useState } from 'react'
import styled from 'styled-components'
import { Card } from '../Card'
import { NFTImage } from '../NFTImage'

const Container = styled(Card)`
  ${({ theme }) => `
    padding: ${theme.space['3']};
    width: ${theme.space.full};
    align-items: stretch;
    gap: ${theme.space['3']};
  `}
`

const ImageWrapper = styled.div<{ $loading?: boolean }>`
  ${({ theme, $loading }) => `
    background: ${$loading ? theme.colors.accentGradient : 'none'};
    border-radius: ${theme.radii.extraLarge};
    & > span {
      border-radius: ${theme.radii.extraLarge};
    }
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

const FavouriteButton = styled.button`
  ${({ theme }) => `
    outline: none;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['8']};
    height: ${theme.space['8']};
  `}
`

const HeartIcon = styled.svg`
  ${({ theme }) => `
    display: block;
    color: transparent;
    stroke: ${theme.colors.borderSecondary};
    width: ${theme.space['6']};
    height: ${theme.space['6']};
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

const OutlinedButtonWrapper = styled.div`
  ${({ theme }) => `
  & > button {
    border: 1px solid rgba(0, 0, 0, 0.06);
    height: ${theme.space['12']};
    border-radius: ${theme.radii.extraLarge};
  }
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
  const [nftLoading, setNftLoading] = useState(true)

  return (
    <Container>
      <ImageWrapper $loading={nftLoading}>
        <NFTImage
          name={name}
          network={network}
          callback={setNftLoading}
          size={170}
        />
      </ImageWrapper>
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
          <FavouriteButton>
            <HeartIcon as={HeartSVG} />
          </FavouriteButton>
        </ExpiryAndFavouriteRow>
        {expiryDate && (
          <OutlinedButtonWrapper>
            <Button size="small" shadowless variant="transparent">
              <InnerButton>
                <ButtonIcon as={FastForwardSVG} />
                <Typography weight="bold">Extend</Typography>
              </InnerButton>
            </Button>
          </OutlinedButtonWrapper>
        )}
        {canSend && (
          <RowWithGap>
            <div style={{ flexGrow: 1 }}>
              <OutlinedButtonWrapper>
                <Button size="small" shadowless variant="transparent">
                  <InnerButton>
                    <ButtonIcon as={PaperPlaneSVG} />
                    <Typography weight="bold">Send</Typography>
                  </InnerButton>
                </Button>
              </OutlinedButtonWrapper>
            </div>
            <OutlinedButtonWrapper>
              <Button size="small" shadowless variant="transparent">
                <InnerButton>
                  <ButtonIcon as={TripleDotSVG} />
                </InnerButton>
              </Button>
            </OutlinedButtonWrapper>
          </RowWithGap>
        )}
      </RightColumn>
    </Container>
  )
}
