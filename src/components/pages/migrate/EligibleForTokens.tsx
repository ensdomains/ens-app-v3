import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { InfoCircleSVG, OutlinkSVG, Typography } from '@ensdomains/thorin'

import { REBATE_DATE } from '@app/utils/constants'

const EligibleForTokensContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    gap: ${theme.space['2']};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: ${theme.space.full};
    border-radius: ${theme.radii['2xLarge']};
    background: ${theme.colors.greenSurface};

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${theme.space['2']};
      color: ${theme.colors.greenPrimary};
    }
  `,
)

const InelegibleForTokensContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    background: ${theme.colors.greenSurface};
    padding: ${theme.space['4']};
    gap: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    align-items: center;
    width: 100%;
    svg {
      color: ${theme.colors.greenDim};
    }
  `,
)

export const EligibleForTokens = ({
  amount,
  extendedDate,
}: {
  amount: number
  extendedDate?: Date
}) => {
  const { t } = useTranslation('common')

  if (!extendedDate) return null

  if (extendedDate < REBATE_DATE) {
    return (
      <InelegibleForTokensContainer>
        <InfoCircleSVG height={24} width={24} />
        names expiring in 2031 smth smth
      </InelegibleForTokensContainer>
    )
  }

  return (
    <EligibleForTokensContainer>
      <Typography fontVariant="largeBold">Eligible for {amount} $ENS</Typography>
      something something
      <Link href="#" target="_blank" rel="noreferrer noopener">
        <Typography color="greenPrimary" fontVariant="bodyBold">
          {t('action.learnMore')}
        </Typography>
        <OutlinkSVG />
      </Link>
    </EligibleForTokensContainer>
  )
}
