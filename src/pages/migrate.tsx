import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import {
  Banner,
  Button,
  Card,
  GasPumpSVG,
  KeySVG,
  RightArrowSVG,
  Typography,
  WalletSVG,
} from '@ensdomains/thorin'

import { Carousel } from '@app/components/pages/migrate/Carousel'

const Title = styled.h1`
  font-weight: 830;
  text-align: center;

  font-size: 52px;
  line-height: 104%;

  @media (min-width: 640px) {
    font-size: 60px;
  }

  @media (min-width: 1024px) {
    font-size: 76px;
  }
`

const Header = styled.header(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space[4]};
    padding: ${theme.space[4]};
    min-height: 530px;
  `,
)

const Main = styled.main(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['16']};
  `,
)

const PartnershipAnnouncement = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    padding: ${theme.space['4']};
    background-color: ${theme.colors.backgroundPrimary};
    border-radius: ${theme.radii['4xLarge']};
    font-size: ${theme.fontSizes.body};
    font-weight: ${theme.fontWeights.bold};
    display: flex;
    justify-content: space-between;
    & > a {
      color: ${theme.colors.greenDim};
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: ${theme.space['2']};
    }
    & > a:hover {
      color: ${theme.colors.green};
    }
    @media (min-width: 640px) {
      border-radius: ${theme.radii['3xLarge']};
    }
  `,
)

const TopNav = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    align-items: center;
    position: sticky;
    top: 0;
    left: 0;
  `,
)

const CardWithEmoji = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 83px;
  position: relative;
  grid-column: 1 / -1;
  & > img {
    position: absolute;
    top: -72px;
  }
`

const GridOneToThree = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-rows: auto;
    gap: ${theme.space['4']};
    text-align: center;
    grid-template-columns: 1fr;
    @media (min-width: 640px) {
      grid-template-columns: repeat(3, 1fr);
    }
  `,
)

const CardHeader = styled.h3(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    font-size: ${theme.fontSizes.extraLarge};
    color: ${theme.colors.greenDim};
    font-weight: ${theme.fontWeights.bold};
    gap: ${theme.space['2']};
    align-items: center;
  `,
)

const AnnouncementSlide = ({ title, text }: { title: string; text: string }) => (
  <Banner style={{ height: '100%' }} as="a" alert="info" href="#" title={title}>
    {text}
  </Banner>
)

const SlideshowContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    h3 {
      text-align: center;
    }
  `,
)

export default function ENSv2() {
  const { t } = useTranslation('ensvs2')
  return (
    <Main>
      <TopNav>
        <PartnershipAnnouncement>
          <span>{t('partnership.text')}</span>
          <a>
            {t('partnership.watch')} <RightArrowSVG />
          </a>
        </PartnershipAnnouncement>
      </TopNav>
      <Header>
        <Title>{t('title')}</Title>
        <Typography>{t('caption')}</Typography>
      </Header>
      <div>video</div>
      <GridOneToThree>
        <CardWithEmoji>
          <img src="/confetti.png" width={108} height={108} alt="🎉" />
          <Typography fontVariant="headingTwo" asProp="h2">
            {t('accessible.title')}
          </Typography>
          <Typography fontVariant="body">{t('accessible.caption')}</Typography>
          <Button width="max" colorStyle="greenSecondary">
            {t('accessible.link')}
          </Button>
        </CardWithEmoji>
        <Card>
          <CardHeader>
            <GasPumpSVG />
            {t('accessible.gas.title')}
          </CardHeader>
          {t('accessible.gas.text')}
        </Card>
        <Card>
          <CardHeader>
            <KeySVG />
            {t('accessible.control.title')}
          </CardHeader>
          {t('accessible.control.text')}
        </Card>
        <Card>
          <CardHeader>
            <WalletSVG />
            {t('accessible.multichain.title')}
          </CardHeader>
          {t('accessible.multichain.text')}
        </Card>
      </GridOneToThree>
      <SlideshowContainer>
        <Typography asProp="h3" fontVariant="headingThree">
          {t('announcement.title')}
        </Typography>
        <Carousel>
          <AnnouncementSlide
            title={t('announcement.l2.title')}
            text={t('announcement.l2.caption')}
          />
          <AnnouncementSlide
            title={t('announcement.ensv2.title')}
            text={t('announcement.ensv2.caption')}
          />
          <AnnouncementSlide
            title={t('announcement.nextgen.title')}
            text={t('announcement.nextgen.caption')}
          />
        </Carousel>
      </SlideshowContainer>
    </Main>
  )
}
