import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Dropdown, Typography, mq } from '@ensdomains/thorin'

import CalendarSVG from '@app/assets/Calendar.svg'
import FastForwardSVG from '@app/assets/FastForward.svg'
import OutlinkSVG from '@app/assets/Outlink.svg'
import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { useChainName } from '@app/hooks/useChainName'
import useRegistrationDate from '@app/hooks/useRegistrationData'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { formatDateTime, formatExpiry, makeEtherscanLink } from '@app/utils/utils'

import { TabWrapper } from '../../../TabWrapper'

const calendarOptions = [
  {
    value: 'google',
    label: 'Google',
    function: google,
  },
  {
    value: 'outlook',
    label: 'Outlook',
    function: outlook,
  },
  {
    value: 'office365',
    label: 'Office 365',
    function: office365,
  },
  {
    value: 'yahoo',
    label: 'Yahoo',
    function: yahoo,
  },
  {
    value: 'ics',
    label: 'iCal',
    function: ics,
  },
]

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

const DateLayout = styled.div(
  ({ theme }) => css`
    align-self: flex-start;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    & > div:first-of-type {
      color: ${theme.colors.textTertiary};
      margin-bottom: ${theme.space['2']};
      font-weight: ${theme.fontWeights.bold};
    }

    & > div:nth-of-type(2) {
      color: ${theme.colors.text};
      font-weight: ${theme.fontWeights.bold};
    }

    & > div:nth-of-type(3) {
      color: ${theme.colors.textTertiary};
      font-weight: ${theme.fontWeights.normal};
      font-size: ${theme.fontSizes.small};
    }

    #remind-me-button,
    & > a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: ${theme.space['5.5']};
      color: ${theme.colors.accent};
      font-weight: ${theme.fontWeights.bold};

      /* stylelint-disable-next-line no-descending-specificity */
      & > svg {
        display: inline-block;
        margin-left: ${theme.space['1']};
        width: ${theme.space['3']};
        height: ${theme.space['3']};
      }
    }
  `,
)

const FastForwardIcon = styled.svg(
  ({ theme }) => css`
    display: block;
    color: ${theme.colors.background};
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 100%;
    ${mq.sm.min(css`
      width: fit-content;
      min-width: ${theme.space['40']};
      max-width: max-content;
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

  const { address } = useAccount()
  const chainName = useChainName()
  const { data: registrationData, isCachedData: registrationCachedData } = useRegistrationDate(name)
  const { canExtend, canEdit } = useSelfAbilities(address, name)

  const { showDataInput } = useTransactionFlow()

  const makeEvent: () => CalendarEvent = useCallback(
    () => ({
      title: `Renew ${name}`,
      start: expiryDate,
      duration: [10, 'minute'],
      url: window.location.href,
    }),
    [name, expiryDate],
  )

  if (!expiryDate) return null

  return (
    <MiscellaneousContainer $isCached={isCachedData || registrationCachedData}>
      <DatesContainer>
        {registrationData && (
          <DateLayout>
            <Typography>{t('name.registered')}</Typography>
            <Typography>{formatExpiry(registrationData.registrationDate)}</Typography>
            <Typography>{formatDateTime(registrationData.registrationDate)}</Typography>
            <a
              target="_blank"
              href={makeEtherscanLink(registrationData.transactionHash, chainName)}
              rel="noreferrer"
              data-testid="etherscan-registration-link"
            >
              {t('action.view')}
              <OutlinkSVG />
            </a>
          </DateLayout>
        )}
        <DateLayout>
          <Typography>{t('name.expires')}</Typography>
          <Typography data-testid="expiry-data">{formatExpiry(expiryDate)}</Typography>
          <Typography>{formatDateTime(expiryDate)}</Typography>
          <Dropdown
            shortThrow
            keepMenuOnTop
            items={calendarOptions.map((opt) => ({
              label: opt.label,
              onClick: () => window.open(opt.function(makeEvent()), '_blank'),
              color: 'text',
            }))}
          >
            <button id="remind-me-button" type="button">
              {t('action.remindMe')}
              <CalendarSVG />
            </button>
          </Dropdown>
        </DateLayout>
        {canExtend && (
          <ButtonContainer>
            <Button
              onClick={() => {
                showDataInput(`extend-names-${name}`, 'ExtendNames', {
                  names: [name],
                  isSelf: canEdit,
                })
              }}
              prefix={<FastForwardIcon as={FastForwardSVG} />}
            >
              {t('action.extend')}
            </Button>
          </ButtonContainer>
        )}
      </DatesContainer>
    </MiscellaneousContainer>
  )
}
export default Miscellaneous
