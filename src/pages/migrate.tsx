/* eslint-disable @next/next/no-img-element */
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import {
  Banner,
  Button,
  Card,
  GasPumpSVG,
  InfoCircleSVG,
  KeySVG,
  QuestionBubbleSVG,
  QuestionCircleSVG,
  RightArrowSVG,
  SpannerAltSVG,
  Typography,
  UpCircleSVG,
  WalletSVG,
} from '@ensdomains/thorin'

import { Carousel } from '@app/components/pages/migrate/Carousel'
import { MigrationNamesList } from '@app/components/pages/migrate/MigrationNamesList'
import { useQueryParameterState } from '@app/hooks/useQueryParameterState'

import DAOSVG from '../assets/DAO.svg'
import SocialX from '../assets/social/SocialX.svg'

const Main = styled.main(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['16']};
  `,
)

const Header = styled.header<{ $isLanding: boolean }>(
  ({ theme, $isLanding }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.space['4']};
    gap: ${theme.space['4']};
    min-height: ${$isLanding ? '530px' : 'unset'};
  `,
)

const Heading = styled.h1(
  ({ theme }) => css`
    font-size: 52px;
    font-size: 850;
    color: ${theme.colors.textPrimary};
    text-align: center;
    line-height: 104%;
    @media (min-width: 360px) {
      font-size: 60px;
    }
    @media (min-width: 640px) {
      font-size: 76px;
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['2']};
    flex-direction: column;

    @media (min-width: 360px) {
      flex-direction: row;
    }
  `,
)

const Caption = styled(Typography)`
  text-align: center;
  max-width: 538px;
`

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
    }
    & > a:hover {
      color: ${theme.colors.green};
    }
    @media (min-width: 640px) {
      border-radius: ${theme.radii['3xLarge']};
    }
  `,
)

const CenteredCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const CardWithEmoji = styled(CenteredCard)`
  padding-top: 83px;
  position: relative;
  grid-column: 1 / -1;

  img {
    position: absolute;
    top: -72px;
  }
`

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

const Section = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    h3 {
      text-align: center;
    }
    & > div {
      display: flex;
      flex-direction: column;
      gap: ${theme.space['4']};
    }
    & > div > div {
      width: 100%;
      display: flex;
      align-items: center;
    }
    @media (min-width: 360px) {
      & > div {
        flex-direction: row;
      }
    }
  `,
)
const Footer = styled(Section)(
  ({ theme }) => css`
    span {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${theme.space['2']};
      color: ${theme.colors.green};
    }
  `,
)

const GetStarted = styled(Section)(
  ({ theme }) => css`
    & > div button span {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${theme.space['2']};
    }
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

const TopNav = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    align-items: center;
  `,
)

const TabManager = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['4']};
  `,
)

const tabs = ['ensv2', 'migrations', 'extension'] as const

type Tab = (typeof tabs)[number]

export default function Page() {
  const { t } = useTranslation('migrate')

  const { isConnected } = useAccount()

  const { openConnectModal } = useConnectModal()

  const [currentTab, setTab] = useQueryParameterState<Tab>('tab', 'ensv2')

  return (
    <>
      <Main>
        <TopNav>
          <PartnershipAnnouncement>
            <span>{t('partnership.text')}</span>
            <a>
              {t('partnership.watch')} <RightArrowSVG />
            </a>
          </PartnershipAnnouncement>
          <TabManager>
            {tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => setTab(tab)}
                shape="rounded"
                width="max"
                colorStyle={currentTab === tab ? 'greenPrimary' : 'greenSecondary'}
              >
                {t(`nav.${tab}`)}
              </Button>
            ))}
          </TabManager>
        </TopNav>
        <Header $isLanding={currentTab === 'ensv2'}>
          {match(currentTab)
            .with('ensv2', () => (
              <>
                <Head>
                  <title>{t('title.landing')}</title>
                </Head>
                <Heading>{t('title.landing')}</Heading>
                {/** @ts-expect-error styled-components don't know how to inherit types */}
                <Caption fontVariant="bodyLarge">{t('caption.ensv2')}</Caption>
              </>
            ))
            .with('migrations', () => (
              <>
                <Head>
                  <title>{t('title.migration')}</title>
                </Head>
                <Heading>{t('title.migration')}</Heading>
                {/** @ts-expect-error styled-components don't know how to inherit types */}
                <Caption fontVariant="bodyLarge">{t('caption.migration')}</Caption>
              </>
            ))
            .otherwise(() => (
              <div>bloop</div>
            ))}
          <ButtonContainer>
            {match(currentTab)
              .with('ensv2', () => (
                <Button
                  onClick={() => {
                    if (isConnected) {
                      setTab('migrations')
                    } else {
                      openConnectModal?.()
                    }
                  }}
                  colorStyle="greenPrimary"
                >
                  {isConnected ? t('cta.approve') : t('cta.unconnected')}
                </Button>
              ))
              .with('migrations', () => (
                <Button
                  onClick={() => {
                    if (isConnected) {
                      // nothing for now
                    } else {
                      openConnectModal?.()
                    }
                  }}
                  colorStyle="greenPrimary"
                >
                  {isConnected ? t('cta.begin') : t('cta.unconnected')}
                </Button>
              ))
              .otherwise(() => (
                <div>bloop</div>
              ))}

            <Button colorStyle="greenSecondary">{t('cta.learn-more')}</Button>
          </ButtonContainer>
        </Header>
        {match(currentTab)
          .with('ensv2', () => (
            <>
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
              <GetStarted>
                <Typography asProp="h3" fontVariant="headingThree">
                  {t('get-started.title')}
                </Typography>
                <div>
                  <Card>
                    <CardHeader>
                      <UpCircleSVG />
                      {t('get-started.upgrade.title')}
                    </CardHeader>
                    {t('get-started.upgrade.caption')}
                    <Button colorStyle="greenPrimary" width="max">
                      <span>
                        {t('cta.connected')} <RightArrowSVG />
                      </span>
                    </Button>
                  </Card>
                </div>
              </GetStarted>
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
            </>
          ))
          .with('migrations', () => (
            <>
              {isConnected ? <MigrationNamesList /> : null}
              <Section>
                <Typography asProp="h3" fontVariant="headingThree">
                  {t('approval-benefits.title')}
                </Typography>
                <div>
                  <Card>
                    <CardHeader>
                      <UpCircleSVG />
                      {t('approval-benefits.migration.title')}
                    </CardHeader>
                    {t('approval-benefits.migration.caption')}
                  </Card>
                  <Card>
                    <CardHeader>
                      <GasPumpSVG />
                      {t('approval-benefits.no-gas-cost.title')}
                    </CardHeader>
                    {t('approval-benefits.no-gas-cost.caption')}
                  </Card>
                </div>
              </Section>
            </>
          ))
          .otherwise(() => (
            <p>bloop</p>
          ))}

        <Footer as="footer">
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
              <span>
                <SocialX height="16" width="16" /> {t('footer.support.twitter')}
              </span>
              <span>
                <DAOSVG height="16" width="16" /> {t('footer.support.dao')}
              </span>
            </Card>
          </div>
        </Footer>
      </Main>
    </>
  )
}
