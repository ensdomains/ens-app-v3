/* stylelint-disable no-descending-specificity */
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import {
  Banner,
  Button,
  Card,
  GasPumpSVG,
  // InfoCircleSVG,
  KeySVG,
  // QuestionBubbleSVG,
  // QuestionCircleSVG,
  // RightArrowSVG,
  // SpannerAltSVG,
  Typography,
  WalletSVG,
} from '@ensdomains/thorin'

// import DAOSVG from '../assets/DAO.svg'
// import SocialX from '../assets/social/SocialX.svg'

const Title = styled.h1(
  ({ theme }) => css`
    font-weight: 830;
    text-align: center;

    font-size: 36px;
    line-height: 104%;

    @media (min-width: ${theme.breakpoints.sm}px) {
      font-size: 52px;
    }
  `,
)

const Header = styled.header(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space[4]};
    padding: ${theme.space[4]};
    padding-top: ${theme.space[16]};
    text-align: center;
  `,
)

const Main = styled.main(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['16']};
  `,
)

/* const PartnershipAnnouncement = styled.div(
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
     @media (min-width: ${theme.breakpoints.sm}px) {
      border-radius: ${theme.radii['3xLarge']};
    }
  `,
) */

/* const Footer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    h3 {
      text-align: center;
    }

    & > div {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: ${theme.space['4']};
    }
    & > div a {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${theme.space['2']};
      color: ${theme.colors.green};
    }
    & > div a:hover {
      color: ${theme.colors.greenDim};
    }
    & > div > div {
      width: 100%;
      display: flex;
      align-items: center;
    }
    @media (min-width: 480px) {
      & > div {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `,
) */

const AnnouncementBanner = styled.div(
  ({ theme }) => css`
    width: 312px;
    height: 182px;
    text-align: center;
    & > a {
      height: ${theme.space.full};
      justify-content: flex-start;
      & > div {
        height: ${theme.space.full};
        justify-content: flex-start;
      }
    }
  `,
)

/* const TopNav = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    align-items: center;
    position: sticky;
    top: ${theme.space['4']};
    left: 0;
    z-index: 1;
  `,
) */

const CenteredCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const CardWithEmoji = styled(CenteredCard)`
  grid-column: 1 / -1;
`

const GridOneToThree = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-rows: auto;
    gap: ${theme.space['4']};
    text-align: center;
    grid-template-columns: 1fr;
    @media (min-width: ${theme.breakpoints.sm}px) {
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

    svg {
      width: 20px;
      height: 20px;
    }
  `,
)

// const AnnouncementSlide = ({
//   title,
//   text,
//   href = '#',
// }: {
//   title: string
//   text: string
//   href?: string
// }) => (
//   <AnnouncementBanner>
//     <Banner as="a" alert="info" target="_blank" rel="noopener noreferrer" href={href} title={title}>
//       {text}
//     </Banner>
//   </AnnouncementBanner>
// )

const AnnouncementSlideTemp = ({
  title,
  text,
  href = '#',
}: {
  title: string
  text: string
  href?: string
}) => (
  <AnnouncementBanner>
    <Banner as="a" alert="info" target="_blank" rel="noopener noreferrer" href={href} title={title}>
      {text}
    </Banner>
  </AnnouncementBanner>
)

const AnnouncementContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};
    flex-flow: row wrap;
  `,
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

const YoutubeEmbed = styled.iframe(
  ({ theme }) => css`
    aspect-ratio: 16 / 9;
    width: ${theme.space.full};
  `,
)

export default function ENSv2() {
  const { t } = useTranslation('ensv2')
  return (
    <Main>
      {/* <TopNav>
        <PartnershipAnnouncement>
          <span>{t('partnership.text')}</span>
          <a>
            {t('partnership.watch')} <RightArrowSVG />
          </a>
        </PartnershipAnnouncement>
      </TopNav> */}
      <Header>
        <Title>{t('title')}</Title>
        <Typography fontVariant="body">{t('caption')}</Typography>
      </Header>
      <YoutubeEmbed
        src="https://www.youtube.com/embed/THnbTKjhZwA?si=Cu7lrt6yirDPVNsL&amp;start=3291"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <GridOneToThree>
        <CardWithEmoji>
          <Typography fontVariant="headingTwo" as="h2">
            {t('accessible.title')}
          </Typography>
          <Typography fontVariant="body">{t('accessible.caption')}</Typography>
          <Button
            as="a"
            href="https://roadmap.ens.domains/l2-roadmap"
            width="max"
            colorStyle="greenPrimary"
            target="_blank"
            rel="noopener noreferrer"
          >
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
        <Typography as="h3" fontVariant="headingThree">
          {t('announcement.title')}
        </Typography>
        {/* <Carousel>
          <AnnouncementSlide
            title={t('announcement.l2.title')}
            text={t('announcement.l2.caption')}
          />
          <AnnouncementSlide
            title={t('announcement.ensv2.title')}
            text={t('announcement.ensv2.caption')}
            href="https://blog.ens.domains/post/ensv2-update"
          />
          <AnnouncementSlide
            title={t('announcement.nextgen.title')}
            text={t('announcement.nextgen.caption')}
            href="https://blog.ens.domains/post/ensv2"
          />
        </Carousel> */}
        <AnnouncementContainer>
          <AnnouncementSlideTemp
            title={t('announcement.ensv2.title')}
            text={t('announcement.ensv2.caption')}
            href="https://blog.ens.domains/post/ensv2-update"
          />
          <AnnouncementSlideTemp
            title={t('announcement.nextgen.title')}
            text={t('announcement.nextgen.caption')}
            href="https://blog.ens.domains/post/ensv2"
          />
        </AnnouncementContainer>
      </SlideshowContainer>
      {/* <Footer as="footer">
        <Typography asProp="h3" fontVariant="headingThree">
          {t('footer.title')}
        </Typography>
        <div>
          <Card title={t('footer.learn.title')}>
            <span>
              <QuestionBubbleSVG /> {t('footer.learn.faq')}
            </span>
            <span>
              <SpannerAltSVG /> {t('footer.learn.plan')}
            </span>
            <span>
              <InfoCircleSVG /> {t('footer.learn.base')}
            </span>
          </Card>
          <Card title={t('footer.support.title')}>
            <span>
              <QuestionCircleSVG /> {t('footer.support.ticket')}
            </span>
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/ensdomains">
              <SocialX height="16" width="16" /> {t('footer.support.twitter')}
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://discuss.ens.domains">
              <DAOSVG height="16" width="16" /> {t('footer.support.dao')}
            </a>
          </Card>
        </div>
      </Footer> */}
    </Main>
  )
}
