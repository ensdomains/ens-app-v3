import { Outlink } from '@app/components/Outlink'
import { Typography } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

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
        <Typography color="textTertiary">
          {t('intro.migrateAndUpdateResolver.title')}
          &nbsp;
          <span>
            <Outlink href="#">{t('intro.migrateAndUpdateResolver.link')}</Outlink>
          </span>
        </Typography>
        <Typography color="textSecondary" weight="bold">
          {t('intro.migrateAndUpdateResolver.warning')}
        </Typography>
      </DescriptionWrapper>
    </>
  )
}
