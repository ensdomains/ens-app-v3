/* eslint-disable @next/next/no-img-element */
import { ReactNode } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'
import { useAccount, useEnsAvatar } from 'wagmi'

import { NameWithRelation } from '@ensdomains/ensjs/subgraph'
import { Button, CheckCircleSVG, Colors, DisabledSVG, PlusCircleSVG, Tag } from '@ensdomains/thorin'

import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { formatDurationOfDates } from '@app/utils/utils'

type Tab = 'eligible' | 'ineligible' | 'approved' | 'claimed'

const icons: Record<Tab, any> = {
  eligible: <PlusCircleSVG />,
  ineligible: <DisabledSVG />,
  approved: <CheckCircleSVG />,
  claimed: <CheckCircleSVG />,
}

const colors: Record<Tab, { fg: Colors; bg: Colors; hover: Colors }> = {
  eligible: {
    fg: 'bluePrimary',
    bg: 'blueSurface',
    hover: 'blueLight',
  },
  ineligible: {
    fg: 'redPrimary',
    bg: 'redSurface',
    hover: 'redLight',
  },
  approved: {
    fg: 'greenPrimary',
    bg: 'greenSurface',
    hover: 'greenLight',
  },
  claimed: {
    fg: 'greenPrimary',
    bg: 'greenSurface',
    hover: 'greenLight',
  },
}

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const TabsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['4']};
    padding: ${theme.space['0.5']};
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.background};
    border: 4px solid ${theme.colors.background};
  `,
)

const TabButton = styled.button<{ $isActive?: boolean; tab: NameListTab }>(
  ({ theme, $isActive, tab }) => css`
    width: ${theme.space.full};
    padding: 0 ${theme.space['4']};
    height: ${theme.space['12']};
    border-radius: ${theme.radii.large};
    color: ${$isActive ? theme.colors[colors[tab].fg] : theme.colors.textTertiary};
    background-color: ${$isActive ? theme.colors[colors[tab].bg] : theme.colors.background};
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: ${theme.fontWeights.bold};
    gap: ${theme.space['2']};

    transition-property: background-color;
    transition-duration: ${theme.transitionDuration['150']};
    transition-timing-function: ${theme.transitionTimingFunction.inOut};

    &:hover {
      background-color: ${$isActive
        ? theme.colors[colors[tab].hover]
        : theme.colors[colors[tab].bg]};
    }
  `,
)

const NamesGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: ${theme.space['2']};
  `,
)

const NameCard = styled.div(
  ({ theme }) => css`
    background: ${theme.colors.background};
    border-radius: ${theme.radii['2xLarge']};
    padding: ${theme.space['8']};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    & > span:nth-of-type(1) {
      font-weight: ${theme.fontWeights.bold};
    }
    & > span:nth-of-type(2) {
      color: ${theme.colors.textTertiary};
      font-size: ${theme.fontSizes.small};
    }
    & > span[data-owner='not-owner'] {
      color: ${theme.colors.redPrimary};
      font-size: ${theme.fontSizes.small};
      margin-top: ${theme.space['2']};
    }
    & > button {
      margin-top: ${theme.space['6']};
    }

    & > img {
      border-radius: ${theme.radii.full};
    }
  `,
)

const nameListTabs = ['eligible', 'ineligible', 'approved', 'claimed'] as const

export type NameListTab = (typeof nameListTabs)[number]

const TagListContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2']};
    margin-top: ${theme.space['2']};
  `,
)

const TagList = ({ name, address }: { name: NameWithRelation; address: Address }) => {
  const tags: ReactNode[] = []
  if (name.registrant === address || name.wrappedOwner === address) tags.push(<Tag>Owner</Tag>)
  if (name.owner === address) tags.push(<Tag>Manager</Tag>)
  return <TagListContainer>{tags.map((tag) => tag)}</TagListContainer>
}

const ExtendableNameButton = ({ name, t }: { name: NameWithRelation; t: TFunction }) => {
  const { usePreparedDataInput } = useTransactionFlow()
  const showExtendNamesInput = usePreparedDataInput('ExtendNames')

  return (
    <Button
      width="max"
      colorStyle="greenSecondary"
      onClick={() => showExtendNamesInput('ExtendNames', { names: [name.name!], isSelf: true })}
    >
      {t('action.extend', { ns: 'common' })}
    </Button>
  )
}

const MigrationName = ({
  name,
  t,
  address,
  mode,
}: {
  name: NameWithRelation
  t: TFunction
  address?: Address
  mode: 'migration' | 'extension'
}) => {
  const now = new Date()
  const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name: name.name! })

  const expiresIn = formatDurationOfDates({
    startDate: now,
    endDate: new Date(name.expiryDate?.date!),
    t,
  }).split(', ')[0]

  if (name.registrant === address || name.wrappedOwner === address) {
    return (
      <NameCard>
        {avatar && <img width="40" height="40" src={avatar} alt="" />}
        <span>{name.truncatedName}</span>
        <span>Expires in {expiresIn}</span>
        {mode === 'extension' ? (
          <>
            <TagList {...{ name, address }} />
            <ExtendableNameButton {...{ name, t }} />
          </>
        ) : null}
      </NameCard>
    )
  }
  return (
    <NameCard>
      {avatar && <img width="40" height="40" src={avatar} alt="" />}
      <span>{name.truncatedName}</span>
      <span>Expires in {expiresIn}</span>
      <span data-owner="not-owner">Not owner</span>
    </NameCard>
  )
}

export const MigrationNamesList = <T extends NameListTab>({
  activeTab,
  setTab,
  names,
  tabs,
  mode,
}: {
  activeTab: T
  names: NameWithRelation[]
  setTab: (tab: T) => void
  tabs: T[]
  mode: 'migration' | 'extension'
}) => {
  const { t } = useTranslation(['migrate', 'common'])
  const { address } = useAccount()

  if (!tabs.length) return null

  return (
    <Container>
      <TabsContainer>
        {tabs.map((tab) => (
          <TabButton tab={tab} $isActive={tab === activeTab} key={tab} onClick={() => setTab(tab)}>
            {icons[tab]} {t(`migration-list.${tab}`)}
          </TabButton>
        ))}
      </TabsContainer>
      <NamesGrid>
        {names.map((name) => (
          <MigrationName {...{ name, t, address, mode }} />
        ))}
      </NamesGrid>
    </Container>
  )
}
