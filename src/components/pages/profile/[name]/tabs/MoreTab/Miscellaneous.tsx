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
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { useNameDates } from '@app/hooks/useNameDates'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { formatDateTime, formatExpiry } from '@app/utils/utils'

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
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: ${theme.space['4']};

    padding: ${theme.space['4']};

    ${mq.md.min(css`
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
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

const Miscellaneous = ({ name }: { name: string }) => {
  const { t } = useTranslation('common')

  const { address } = useAccount()
  const { data: nameDates, isCachedData } = useNameDates(name)
  const { canExtend, canEdit } = useSelfAbilities(address, name)

  const { showDataInput } = useTransactionFlow()

  const makeEvent: () => CalendarEvent = useCallback(
    () => ({
      title: `Renew ${name}`,
      start: nameDates?.expiryDate,
      duration: [10, 'minute'],
      url: window.location.href,
    }),
    [name, nameDates],
  )

  if (!nameDates) return null

  return (
    <MiscellaneousContainer $isCached={isCachedData}>
      <DatesContainer>
        <DateLayout>
          <Typography>{t('name.registered')}</Typography>
          <Typography>{formatExpiry(nameDates.registrationDate)}</Typography>
          <Typography>{formatDateTime(nameDates.registrationDate)}</Typography>
          <a href="#">
            {t('action.view')}
            <OutlinkSVG />
          </a>
        </DateLayout>
        <DateLayout>
          <Typography>{t('name.expires')}</Typography>
          <Typography data-testid="expiry-data">{formatExpiry(nameDates.expiryDate)}</Typography>
          <Typography>{formatDateTime(nameDates.expiryDate)}</Typography>
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
          <MobileFullWidth>
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
          </MobileFullWidth>
        )}
      </DatesContainer>
    </MiscellaneousContainer>
  )
}
export default Miscellaneous
