import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CheckCircleSVG, Colors, DisabledSVG, PlusCircleSVG } from '@ensdomains/thorin'

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
      background-color: ${$isActive ? theme.colors[colors[tab].hover] : 'auto'};
    }
  `,
)

export const MigrationNamesList = () => {
  const [activeTab, setTab] = useState<Tab>('eligible')

  const { t } = useTranslation('migrate')

  return (
    <Container>
      <TabsContainer>
        {tabs.map((tab) => (
          <TabButton tab={tab} $isActive={tab === activeTab} key={tab} onClick={() => setTab(tab)}>
            {icons[tab]} {t(`migration-list.${tab}`)}
          </TabButton>
        ))}
      </TabsContainer>
    </Container>
  )
}
