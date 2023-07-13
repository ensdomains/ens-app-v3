import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import useRegistrationDate from '@app/hooks/useRegistrationData'
import { checkETH2LDFromName } from '@app/utils/utils'

import { TabWrapper } from '../../../../TabWrapper'
import { EarnifiDialog } from './EarnifiDialog'
import { ExpirationDate } from './ExpirationDate'
import { ExtendButton } from './ExtendButton'
import { GraceEndDate } from './GraceEndDate'
import { RegistrationDate } from './RegistrationDate'

const MiscellaneousContainer = styled(TabWrapper)(
  cacheableComponentStyles,
  () => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
  `,
)

const DatesContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    position: relative;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-between;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.sm.min(css`
      padding: ${theme.space['6']};
    `)}
  `,
)

const Miscellaneous = ({
  name,
  expiryDate,
  isCachedData,
}: {
  name: string
  expiryDate: Date | undefined
  isCachedData: boolean
}) => {
  const { t } = useTranslation('common')

  const { data: registrationData, isCachedData: registrationCachedData } = useRegistrationDate(name)
  const [showEarnifiDialog, setShowEarnifiDialog] = useState(false)

  if (!expiryDate) return null

  return (
    <>
      <EarnifiDialog
        name={name}
        open={showEarnifiDialog}
        onDismiss={() => setShowEarnifiDialog(false)}
      />
      <MiscellaneousContainer $isCached={isCachedData || registrationCachedData}>
        <DatesContainer>
          <RegistrationDate {...{ registrationData, t }} />
          <ExpirationDate {...{ setShowEarnifiDialog, expiryDate, t, name }} />
          {checkETH2LDFromName(name) && <GraceEndDate expiryDate={expiryDate} />}
          <ExtendButton {...{ name }} />
        </DatesContainer>
      </MiscellaneousContainer>
    </>
  )
}
export default Miscellaneous
