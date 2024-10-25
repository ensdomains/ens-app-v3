/* eslint-disable @next/next/no-img-element */
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import {
  Button,
  Card,
  InfoCircleSVG,
  QuestionBubbleSVG,
  QuestionCircleSVG,
  RightArrowSVG,
  SpannerAltSVG,
  Typography,
} from '@ensdomains/thorin'

import { MigrationSection } from '@app/components/pages/migrate/MigrationSection'
import {
  MigrationTab,
  migrationTabs,
  MigrationTabType,
} from '@app/components/pages/migrate/MigrationTab'
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

const Footer = styled(MigrationSection)(
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

export default function Page() {
  const { t } = useTranslation('migrate')

  const [currentTab, setTab] = useQueryParameterState<MigrationTabType>('tab', 'ensv2')

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
            {migrationTabs.map((tab) => (
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

        <MigrationTab tab={currentTab} setTab={setTab} t={t} />

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
