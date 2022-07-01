import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { Typography, Space } from '@ensdomains/thorin'

import { useGetFuseData } from '@app/hooks/useGetFuseData'

import { TrafficLight } from '@app/components/TrafficLight'
import { useTranslation } from 'react-i18next'

const FusesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 20px 25px;
`

const FusesRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: ${theme.borderWidths.px} ${theme.borderStyles.solid}
        ${theme.colors.borderTertiary};
    }
  `,
)

const Spacer = styled.div<{ $height: Space }>(
  ({ theme, $height }) => css`
    width: 100%;
    height: ${theme.space[$height]};
  `,
)

const Fuses = () => {
  const { t } = useTranslation('profile', { keyPrefix: 'details.tabs.more' })
  const router = useRouter()
  const { name } = router.query
  const { fuseData } = useGetFuseData((name as string) || '')

  return !fuseData ? (
    <Typography>{t('fuses.callToAction')}</Typography>
  ) : (
    <FusesContainer>
      <div>
        <Typography weight="bold" color="textTertiary">
          {t('fuses.permissions.label')}
        </Typography>
        <Spacer $height="5" />
        <div>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.canDoEverything')}
            </Typography>
            <TrafficLight
              $go={fuseData.fuseObj.canDoEverything}
              data-testid="first-traffic-light"
            />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.canBurnFuses')}
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotBurnFuses} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.canCreateSubdomains')}
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotCreateSubdomains} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.canSetResolver')}
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotSetResolver} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.canSetTTL')}
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotSetTTL} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.canTransfer')}
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotTransfer} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.canUnwrap')}
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.cannotUnwrap} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.parentCanControl')}
            </Typography>
            <TrafficLight $go={!fuseData.fuseObj.parentCannotControl} />
          </FusesRow>
        </div>
      </div>
      <Spacer $height="10" />
      <div>
        <Typography weight="bold" color="textTertiary">
          {t('fuses.vulnerabilities.label')}
        </Typography>
        <Spacer $height="5" />
        <FusesRow>
          <Typography color="textSecondary" weight="bold">
            {t('fuses.vulnerabilities.vulnerability')}
          </Typography>
          <Typography color="textSecondary" data-testid="vulnerability">
            {fuseData.vulnerability}
          </Typography>
        </FusesRow>
        <FusesRow>
          <Typography color="textSecondary" weight="bold">
            {t('fuses.vulnerabilities.vulnerableNode')}
          </Typography>
          <Typography color="textSecondary">
            {fuseData.vulnerableNode ?? t('fuses.vulnerabilities.none')}
          </Typography>
        </FusesRow>
      </div>
    </FusesContainer>
  )
}

export default Fuses
