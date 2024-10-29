import { useConnectModal } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { useState } from 'react'
import { TFunction } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { NameWithRelation } from '@ensdomains/ensjs/subgraph'
import {
  Banner,
  Button,
  Card,
  FastForwardSVG,
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

const ContainerWithCenteredButton = styled.div(
  ({ theme }) => css`
    button span {
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

const AllNamesAreApprovedBanner = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    flex: 1 0 0;
    align-items: center;
    border-radius: ${theme.radii['4xLarge']};
    gap: ${theme.space['2']};
    padding: ${theme.space['4']} ${theme.space['6']};
    background: ${theme.colors.greenSurface};
    border: 1px solid ${theme.colors.greenPrimary};
  `,
)

const RebatesMigrationSection = styled(MigrationSection)`
  & > div > div:nth-child(3) {
    grid-column: 1 / -1;
    grid-row: 2;
  }
`

export const migrationTabs = ['ensv2', 'migrations', 'extension'] as const

export type MigrationTabType = (typeof migrationTabs)[number]

const LandingTab = ({
  t,
  isConnected,
  openConnectModal,
  setTab,
  allNamesAreApproved,
  eligibleToApprove,
}: {
  t: TFunction
  isConnected: boolean
  openConnectModal?: () => void
  setTab: (tab: MigrationTabType) => void
  allNamesAreApproved: boolean
  eligibleToApprove: boolean
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
                setTab(allNamesAreApproved ? 'extension' : 'migrations')
              } else {
                openConnectModal?.()
              }
            }}
            colorStyle="greenPrimary"
          >
            {match({
              isConnected,
              allNamesAreApproved,
              eligibleToApprove,
            })
              .with(
                { isConnected: true, allNamesAreApproved: false, eligibleToApprove: true },
                () => t('cta.approve'),
              )
              .with({ isConnected: true, allNamesAreApproved: true }, () => t('cta.extend-names'))
              .with({ isConnected: false }, () => t('cta.unconnected'))
              .otherwise(() => null)}
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
        <ContainerWithCenteredButton>
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
          <Card>
            <CardHeader>
              <FastForwardSVG />
              {t('get-started.extend.title')}
            </CardHeader>
            {t('get-started.extend.caption')}
            <Button colorStyle="greenPrimary" width="max" onClick={() => setTab('extension')}>
              <span>
                {t('cta.claim-rebates')} <RightArrowSVG />
              </span>
            </Button>
          </Card>
        </ContainerWithCenteredButton>
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

type MigrationHelperTab = Exclude<NameListTab, 'claimed'>

const filterNamesForMigration = (names: NameWithRelation[]) => {
  const eligibleNames: NameWithRelation[] = []
  const inelegibleNames: NameWithRelation[] = []

  for (const name of names.filter(
    ({ expiryDate }) => expiryDate?.date && expiryDate?.date > new Date(),
  )) {
    if (name.parentName === 'eth' && (name.relation.wrappedOwner || name.relation.registrant)) {
      eligibleNames.push(name)
    } else {
      inelegibleNames.push(name)
    }
  }
  return { eligibleNames, inelegibleNames }
}

const filterTabs = <T extends string>({
  approvedNames = [],
  eligibleNames = [],
  inelegibleNames = [],
  claimedNames = [],
}: Partial<{
  approvedNames: NameWithRelation[]
  eligibleNames: NameWithRelation[]
  inelegibleNames: NameWithRelation[]
  claimedNames: NameWithRelation[]
}>) => {
  const tabs: T[] = []

  if (eligibleNames.length) {
    tabs.push('eligible' as T)
  }

  if (inelegibleNames.length) {
    tabs.push('ineligible' as T)
  }

  if (approvedNames.length) {
    tabs.push('approved' as T)
  }

  if (claimedNames.length) {
    tabs.push('claimed' as T)
  }

  return tabs
}

const MigrationsTab = ({
  t,
  isConnected,
  openConnectModal,
  address,
  setTab,
  eligibleNames,
  inelegibleNames,
  approvedNames,
  allNamesAreApproved,
}: {
  t: TFunction
  isConnected: boolean
  openConnectModal?: () => void
  address?: Address
  setTab: (tab: MigrationTabType) => void
  eligibleNames: NameWithRelation[]
  inelegibleNames: NameWithRelation[]
  approvedNames: NameWithRelation[]
  allNamesAreApproved: boolean
}) => {
  const tabs = filterTabs<MigrationHelperTab>({ approvedNames, eligibleNames, inelegibleNames })

  const { createTransactionFlow } = useTransactionFlow()
  const [activeNameListTab, setNameListTab] = useState<MigrationHelperTab>(tabs[0])

  const names: Record<MigrationHelperTab, NameWithRelation[]> = {
    eligible: eligibleNames,
    ineligible: inelegibleNames,
    approved: approvedNames,
  }

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
          {match({ isConnected, allNamesAreApproved })
            .with({ isConnected: true, allNamesAreApproved: false }, () => (
              <Button
                onClick={() => {
                  if (isConnected) {
                    const transactions: {
                      name: 'approveNameWrapperForMigration' | 'approveRegistrarForMigration'
                      data: TransactionData<
                        'approveNameWrapperForMigration' | 'approveRegistrarForMigration'
                      >
                    }[] = []

                    if (eligibleNames.find((name) => name.wrappedOwner)) {
                      transactions.push(
                        createTransactionItem('approveNameWrapperForMigration', {
                          address: address!,
                        }),
                      )
                    }
                    if (eligibleNames.find((name) => name.relation.registrant)) {
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
                {t('cta.begin')}
              </Button>
            ))
            .with({ isConnected: true, allNamesAreApproved: true }, () => null)
            .with({ isConnected: false }, () => (
              <Button colorStyle="greenPrimary">{t('cta.unconnected')}</Button>
            ))
            .exhaustive()}

          <Button colorStyle="greenSecondary">{t('cta.learn-more')}</Button>
        </ButtonContainer>
      </Header>
      {allNamesAreApproved ? (
        <AllNamesAreApprovedBanner>{t('banner.all-approved')}</AllNamesAreApprovedBanner>
      ) : null}
      {isConnected ? (
        <MigrationNamesList
          names={names[activeNameListTab]}
          activeTab={activeNameListTab}
          setTab={setNameListTab}
          tabs={tabs}
        />
      ) : null}
      <RebatesMigrationSection>
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
          <Card>
            <CardHeader>
              <FastForwardSVG />
              {t('approval-benefits.claim-rebates.title')}
            </CardHeader>
            {t('approval-benefits.claim-rebates.caption')}
            <ContainerWithCenteredButton>
              <Button colorStyle="greenPrimary" width="max" onClick={() => setTab('extension')}>
                <span>
                  {t('cta.claim-rebates')} <RightArrowSVG />
                </span>
              </Button>
            </ContainerWithCenteredButton>
          </Card>
        </div>
      </RebatesMigrationSection>
    </>
  )
}

type ExtensionTabType = Exclude<NameListTab, 'ineligible' | 'approved'>

const ExtensionTab = ({
  t,
  isConnected,
  address,
  allNamesAreApproved,
  setTab,
}: {
  t: TFunction
  isConnected: boolean
  address?: Address
  allNamesAreApproved: boolean
  setTab: (tab: MigrationTabType) => void
}) => {
  const { infiniteData } = useNamesForAddress({
    address,
    pageSize: 20,
    filter: { owner: false, wrappedOwner: true, registrant: true, resolvedAddress: false },
    enabled: allNamesAreApproved,
  })

  const allNames = infiniteData.filter((name) => name.parentName === 'eth' && name.expiryDate)

  const [activeTab, setNameListTab] = useState<ExtensionTabType>('eligible')

  const claimedNames = allNames.filter(
    (name) => name.expiryDate && name.expiryDate.date > new Date(2030, 11, 31, 0, 0),
  )

  const eligibleNames = allNames.filter((name) => !claimedNames.includes(name))

  const { openConnectModal } = useConnectModal()

  const names: Record<ExtensionTabType, NameWithRelation[]> = {
    claimed: claimedNames,
    eligible: eligibleNames,
  }

  const tabs = filterTabs<ExtensionTabType>({ claimedNames, eligibleNames })

  const { usePreparedDataInput } = useTransactionFlow()
  const showExtendNamesInput = usePreparedDataInput('BulkRenewal')

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
          {match({ isConnected, allNamesAreApproved })
            .with({ isConnected: true, allNamesAreApproved: true }, () => (
              <Button
                colorStyle="greenPrimary"
                onClick={() => {
                  showExtendNamesInput('BulkRenewal', { names: eligibleNames })
                }}
              >
                {t('cta.extend-names')}
              </Button>
            ))
            .with({ isConnected: true, allNamesAreApproved: false }, () => (
              <Button colorStyle="greenPrimary" onClick={() => setTab('migrations')}>
                {t('cta.begin')}
              </Button>
            ))
            .with({ isConnected: false }, () => (
              <Button colorStyle="greenPrimary" onClick={() => openConnectModal?.()}>
                {t('cta.unconnected')}
              </Button>
            ))
            .exhaustive()}
          <Button colorStyle="greenSecondary">{t('cta.learn-more')}</Button>
        </ButtonContainer>
      </Header>
      {isConnected ? (
        <MigrationNamesList
          activeTab={activeTab}
          names={names[activeTab]}
          setTab={setNameListTab}
          tabs={tabs}
        />
      ) : null}
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

  const { infiniteData: names } = useNamesForAddress({
    address,
    pageSize: 100,
    filter: { registrant: true, owner: true, resolvedAddress: true, wrappedOwner: true },
  })

  const { eligibleNames: initialEligibleNames, inelegibleNames } = filterNamesForMigration(names)

  const approvedNames = useApprovedNamesForMigration({
    names: initialEligibleNames,
    owner: address,
  })

  const eligibleNames = initialEligibleNames.filter((name) => !approvedNames.includes(name))

  const allNamesAreApproved = approvedNames.length !== 0 && approvedNames.length === names.length

  const eligibleToApprove = eligibleNames.length !== 0

  return match(tab)
    .with('ensv2', () => (
      <LandingTab
        {...{ isConnected, openConnectModal, t, setTab, eligibleToApprove, allNamesAreApproved }}
      />
    ))
    .with('migrations', () => (
      <MigrationsTab
        {...{
          isConnected,
          openConnectModal,
          t,
          address,
          setTab,
          eligibleNames,
          inelegibleNames,
          approvedNames,
          allNamesAreApproved,
        }}
      />
    ))
    .with('extension', () => (
      <ExtensionTab {...{ t, isConnected, address, allNamesAreApproved, setTab }} />
    ))
    .exhaustive()
}
