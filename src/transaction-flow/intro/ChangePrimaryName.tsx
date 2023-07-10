import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { getSupportLink } from '@app/utils/supportLinks'

const DescriptionWrapper = styled(Typography)(
  ({ theme }) => css`
    display: inline;
    text-align: center;
    a {
      display: inline-block;
    }
    margin-bottom: ${theme.space['2']};
  `,
)

export const ChangePrimaryName = () => {
  const { t } = useTranslation('profile')

  return (
    <DescriptionWrapper>
      <Typography>
        {t('tabs.profile.actions.setAsPrimaryName.description')}{' '}
        <span>
          <Outlink href={getSupportLink('primaryName')}>
            {t('action.learnMore', { ns: 'common' })}
          </Outlink>
        </span>
      </Typography>
    </DescriptionWrapper>
  )
}
