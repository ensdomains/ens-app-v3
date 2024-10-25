import { useConnectModal } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useState } from 'react'
import { TFunction } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { GetNamesForAddressParameters } from '@ensdomains/ensjs/subgraph'
import {
  Banner,
  Button,
  Card,
  GasPumpSVG,
  KeySVG,
  RightArrowSVG,
  Typography,
  UpCircleSVG,
  WalletSVG,
} from '@ensdomains/thorin'

import { Carousel } from '@app/components/pages/migrate/Carousel'
import { useNamesForAddress } from '@app/hooks/ensjs/subgraph/useNamesForAddress'
import { useApprovedNamesForMigration } from '@app/hooks/migration/useApprovedNamesForMigration'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { createTransactionItem, TransactionData } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { MigrationNamesList, NameListTab } from './MigrationNamesList'
import { MigrationSection } from './MigrationSection'

const Header = styled.header<{ $isLanding?: boolean }>(
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

const GetStarted = styled(MigrationSection)(
  ({ theme }) => css`
    & > div button span {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${theme.space['2']};
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

const GradientText = styled.span`
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  background: linear-gradient(90deg, #199c75 2.87%, #9b9ba7 97.95%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
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

export const migrationTabs = ['ensv2', 'migrations', 'extension'] as const

export type MigrationTabType = (typeof migrationTabs)[number]

const LandingTab = ({
  t,
  isConnected,
  openConnectModal,
  setTab,
}: {
  t: TFunction
  isConnected: boolean
  openConnectModal?: () => void
  setTab: (tab: MigrationTabType) => void
}) => {
  return (
    <>
      <Header $isLanding>
        <Head>
          <title>{t('title.landing')}</title>
        </Head>
        <Heading>{t('title.landing')}</Heading>
        {/** @ts-expect-error styled-components don't know how to inherit types */}
        <Caption fontVariant="bodyLarge">{t('caption.ensv2')}</Caption>
        <ButtonContainer>
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
          <Button colorStyle="greenSecondary">{t('cta.learn-more')}</Button>
        </ButtonContainer>
      </Header>
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
      <MigrationSection>
        <Typography asProp="h3" fontVariant="headingThree">
          {t('get-started.title')}
        </Typography>
        <GetStarted>
          <Card>
            <CardHeader>
              <UpCircleSVG />
              {t('get-started.upgrade.title')}
            </CardHeader>
            {t('get-started.upgrade.caption')}
            <Button colorStyle="greenPrimary" width="max">
              <span>
                {t('cta.approve')} <RightArrowSVG />
              </span>
            </Button>
          </Card>
        </GetStarted>
      </MigrationSection>
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
  )
}

const filter: Record<NameListTab, GetNamesForAddressParameters['filter']> = {
  eligible: { owner: false, wrappedOwner: true, registrant: true, resolvedAddress: false },
  ineligible: { owner: true, wrappedOwner: false, registrant: false, resolvedAddress: false },
  approved: { owner: false, wrappedOwner: true, registrant: true, resolvedAddress: false },
}

const MigrationsTab = ({
  t,
  isConnected,
  openConnectModal,
  address,
}: {
  t: TFunction
  isConnected: boolean
  openConnectModal?: () => void
  address?: Address
}) => {
  const [activeNameListTab, setNameListTab] = useState<NameListTab>('eligible')

  const { infiniteData } = useNamesForAddress({
    address,
    pageSize: 20,
    filter: filter[activeNameListTab],
  })

  const names = infiniteData.filter(
    (name) =>
      name.parentName === 'eth' &&
      (activeNameListTab === 'ineligible' ? name.registrant !== name.owner : true),
  )

  const approvedNames = useApprovedNamesForMigration({ names })

  const { createTransactionFlow } = useTransactionFlow()

  return (
    <>
      <Header>
        <Head>
          <title>{t('title.migration')}</title>
        </Head>
        <Heading>{t('title.migration')}</Heading>
        {/** @ts-expect-error styled-components don't know how to inherit types */}
        <Caption fontVariant="bodyLarge">{t('caption.migration')}</Caption>
        <ButtonContainer>
          <Button
            onClick={() => {
              if (isConnected) {
                const transactions: {
                  name: 'approveNameWrapperForMigration' | 'approveRegistrarForMigration'
                  data: TransactionData<
                    'approveNameWrapperForMigration' | 'approveRegistrarForMigration'
                  >
                }[] = []

                if (names.find((name) => name.wrappedOwner)) {
                  transactions.push(
                    createTransactionItem('approveNameWrapperForMigration', {
                      address: address!,
                    }),
                  )
                }
                if (names.find((name) => name.relation.registrant)) {
                  transactions.push(
                    createTransactionItem('approveRegistrarForMigration', {
                      address: address!,
                    }),
                  )
                }

                createTransactionFlow('migrate-names', {
                  resumable: true,
                  intro: {
                    title: ['details.approve.title', { ns: 'migrate' }],
                    content: makeIntroItem('GenericWithDescription', {
                      description: t('details.approve.description'),
                    }),
                  },
                  transactions,
                })
              } else {
                openConnectModal?.()
              }
            }}
            colorStyle="greenPrimary"
          >
            {isConnected ? t('cta.begin') : t('cta.unconnected')}
          </Button>
          <Button colorStyle="greenSecondary">{t('cta.learn-more')}</Button>
        </ButtonContainer>
      </Header>
      {isConnected ? (
        <MigrationNamesList
          names={activeNameListTab === 'approved' ? approvedNames : names}
          activeTab={activeNameListTab}
          setTab={setNameListTab}
        />
      ) : null}
      <MigrationSection>
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
      </MigrationSection>
    </>
  )
}

const ExtensionTab = ({ t, isConnected }: { t: TFunction; isConnected: boolean }) => {
  return (
    <>
      <Header>
        <Head>
          <title>
            {t('title.extension.part1')} {t('title.extension.part2')}
          </title>
        </Head>
        <Heading>
          {t('title.extension.part1')} <GradientText>{t('title.extension.part2')}</GradientText>
        </Heading>
        <Caption>bloop</Caption>
        <ButtonContainer>
          <Button colorStyle="greenPrimary">
            {isConnected ? t('cta.begin') : t('cta.unconnected')}
          </Button>
          <Button colorStyle="greenSecondary">{t('cta.learn-more')}</Button>
        </ButtonContainer>
      </Header>
    </>
  )
}

export const MigrationTab = ({
  tab,
  setTab,
  t,
}: {
  tab: MigrationTabType
  setTab: (tab: MigrationTabType) => void
  t: TFunction
}) => {
  const { isConnected, address } = useAccount()
  const { openConnectModal } = useConnectModal()

  return match(tab)
    .with('ensv2', () => <LandingTab {...{ isConnected, openConnectModal, t, setTab }} />)
    .with('migrations', () => <MigrationsTab {...{ isConnected, openConnectModal, t, address }} />)
    .with('extension', () => <ExtensionTab {...{ t, isConnected }} />)
    .exhaustive()
}
