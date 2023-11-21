import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'
import { getSupportLink } from '@app/utils/supportLinks'

export const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[2]};
  `,
)

export const Header = () => {
  const { t } = useTranslation('profile')
  return (
    <Container>
      <Typography fontVariant="headingFour">
        {t('tabs.ownership.sections.contract.title')}
      </Typography>
      <QuestionTooltip
        content={t('tabs.ownership.sections.contract.tooltip')}
        link={getSupportLink('contract-address')}
      />
    </Container>
  )
}
