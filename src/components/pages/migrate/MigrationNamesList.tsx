import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

const tabs = ['eligible', 'ineligible', 'approved'] as const

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

const TabButton = styled.button<{ $isActive?: boolean }>(
  ({ theme, $isActive }) => css`
    width: ${theme.space.full};
    padding: 0 ${theme.space['4']};
    height: ${theme.space['12']};
    border-radius: ${theme.radii.large};
    color: ${$isActive ? theme.colors.blueDim : theme.colors.textSecondary};
    background-color: ${$isActive ? theme.colors.blueSurface : theme.colors.background};
    cursor: pointer;
  `,
)

export const MigrationNamesList = () => {
  const [activeTab, setTab] = useState<Tab>('eligible')

  const { t } = useTranslation('migrate')

  return (
    <Container>
      <TabsContainer>
        {tabs.map((tab) => (
          <TabButton $isActive={tab === activeTab} key={tab} onClick={() => setTab(tab)}>
            {t(`migration-list.${tab}`)}
          </TabButton>
        ))}
      </TabsContainer>
    </Container>
  )
}
