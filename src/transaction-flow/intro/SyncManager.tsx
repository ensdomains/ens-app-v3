import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Helper, Typography } from '@ensdomains/thorin'

import { shortenAddress } from '@app/utils/utils'

const StyledTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

export const SyncManager = ({ manager, isWrapped }: { manager: string; isWrapped: boolean }) => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <StyledTypography>
        <Trans
          i18nKey="intro.syncManager.description"
          ns="transactionFlow"
          components={{ b: <strong /> }}
          values={{ manager: shortenAddress(manager) }}
        />
      </StyledTypography>
      {isWrapped && <Helper alert="warning">{t('intro.syncManager.wrappedWarning')}</Helper>}
    </>
  )
}
