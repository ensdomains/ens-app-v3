import { useState } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'
import { useEnsAvatar } from 'wagmi'

import { GetNamesForAddressParameters, NameWithRelation } from '@ensdomains/ensjs/subgraph'
import { CheckCircleSVG, Colors, DisabledSVG, PlusCircleSVG } from '@ensdomains/thorin'

import { useNamesForAddress } from '@app/hooks/ensjs/subgraph/useNamesForAddress'
import { calculateDatesDiff } from '@app/utils/date'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { formatDurationOfDates } from '@app/utils/utils'

const tabs = ['eligible', 'ineligible', 'approved'] as const

const icons: Record<Tab, any> = {
  eligible: <PlusCircleSVG />,
  ineligible: <DisabledSVG />,
  approved: <CheckCircleSVG />,
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
}

type Tab = (typeof tabs)[number]

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

const TabButton = styled.button<{ $isActive?: boolean; tab: Tab }>(
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

    & > img {
      border-radius: ${theme.radii.full};
    }
  `,
)

const MigrationName = ({ name, t }: { name: NameWithRelation; t: TFunction }) => {
  const now = new Date()
  const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name: name.name! })

  const expiresIn = formatDurationOfDates({
    startDate: now,
    endDate: new Date(name.expiryDate?.date!),
    t,
  }).split(', ')[0]

  return (
    <NameCard>
      {avatar && <img width="40" height="40" src={avatar} alt="" />}
      <span>{name.name}</span>
      <span>Expires in {expiresIn}</span>
    </NameCard>
  )
}

const filter: Record<Tab, GetNamesForAddressParameters['filter']> = {
  eligible: { owner: false, wrappedOwner: true, registrant: true, resolvedAddress: false },
  ineligible: { owner: true, wrappedOwner: false, registrant: false, resolvedAddress: false },
}

export const MigrationNamesList = ({ address }: { address?: Address }) => {
  const [activeTab, setTab] = useState<Tab>('eligible')

  const { t } = useTranslation('migrate')

  const { infiniteData, isLoading } = useNamesForAddress({
    address,
    pageSize: 20,
    filter: filter[activeTab],
  })

  const names = infiniteData.filter(
    (name) =>
      name.parentName === 'eth' &&
      (activeTab === 'ineligible' ? name.registrant !== name.owner : true),
  )

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
          <MigrationName {...{ name, t }} />
        ))}
      </NamesGrid>
    </Container>
  )
}
