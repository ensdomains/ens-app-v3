import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { getSupportLink } from '@app/utils/supportLinks'

const DescriptionWrapper = styled(Typography)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['5']};
    text-align: center;
    a {
      display: inline-block;
    }
    margin-bottom: ${theme.space['2']};
  `,
)

export const MigrateAndUpdateResolver = () => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <DescriptionWrapper>
        <Typography color="grey">
          {t('intro.migrateAndUpdateResolver.heading')}
          &nbsp;
          <span>
            <Outlink href={getSupportLink('resolver')}>
              {t('intro.migrateAndUpdateResolver.link')}
            </Outlink>
          </span>
        </Typography>
        <Typography color="textSecondary" weight="bold">
          {t('intro.migrateAndUpdateResolver.warning')}
        </Typography>
      </DescriptionWrapper>
    </>
  )
}
