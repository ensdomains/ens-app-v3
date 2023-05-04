import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { Button, Dialog, Dropdown, Input, Typography, mq } from '@ensdomains/thorin'

import CalendarSVG from '@app/assets/Calendar.svg'
import FastForwardSVG from '@app/assets/FastForward.svg'
import OutlinkSVG from '@app/assets/Outlink.svg'
import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { Spacer } from '@app/components/@atoms/Spacer'
import { useChainId } from '@app/hooks/useChainId'
import { useChainName } from '@app/hooks/useChainName'
import useRegistrationDate from '@app/hooks/useRegistrationData'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { formatDateTime, formatExpiry, makeEtherscanLink } from '@app/utils/utils'

import { TabWrapper } from '../../../TabWrapper'

const EARNFI_ENDPOINT = 'https://notifications-api.vercel.app/api/v1/ens/subscribe'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

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

const Form = styled.form(
  ({ theme }) => css`
    width: 100%;
    ${mq.sm.min(css`
      width: 500px;
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
  const [hasEarnifiDialog, setHasEarnifiDialog] = useState(false)
  const [hasCreatedReminder, setHasCreatedReminder] = useState(false)

  const { address } = useAccount()
  const chainName = useChainName()
  const chainId = useChainId()
  const { data: registrationData, isCachedData: registrationCachedData } = useRegistrationDate(name)
  const { canExtend, canEdit } = useSelfAbilities(address, name)

  const { prepareDataInput } = useTransactionFlow()
  const showExtendNamesInput = prepareDataInput('ExtendNames')

  const makeEvent: () => CalendarEvent = useCallback(
    () => ({
      title: `Renew ${name}`,
      start: expiryDate,
      duration: [10, 'minute'],
      url: window.location.href,
    }),
    [name, expiryDate],
  )

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  const onSubmit = async ({ email }) => {
    console.log('email: ', email)
    try {
      const response = await fetch(EARNFI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          address: name,
          chainId,
        }),
      })
      // const data = await response.json()
      // console.log(data)
      setHasCreatedReminder(true)
    } catch (e) {
      setHasCreatedReminder(false)
      setError('submit', {
        type: 'submitError',
        message: 'Form submission failed. Please try again.',
      })
      setTimeout(() => {
        clearErrors('submit')
      }, 3000)
    }
  }

  if (!expiryDate) return null

  return (
    <>
      <Dialog open={hasEarnifiDialog} variant="blank" onDismiss={() => null}>
        <Dialog.Heading title="Earni.fi Reminders" />
        {match(hasCreatedReminder)
          .with(false, () => (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Typography style={{ textAlign: 'center' }}>
                Receive{' '}
                <a href="" target="_blank">
                  Earni.fi
                </a>{' '}
                Reminders through Email, PUSH, XMTP, Blockscan Chat, and Mailchain.
              </Typography>
              <Spacer $height="3" />
              <Input
                type="email"
                id="email"
                label="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: emailRegex,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message || errors.submit?.message}
              />
              <Spacer $height="3" />
              <Dialog.Footer
                leading={
                  <Button
                    onClick={() => {
                      setHasEarnifiDialog(false)
                      setHasCreatedReminder(false)
                    }}
                    colorStyle="accentSecondary"
                  >
                    Cancel
                  </Button>
                }
                trailing={
                  <Button
                    type="submit"
                    disabled={errors.email || errors.submit}
                    loading={isSubmitting}
                  >
                    Continue
                  </Button>
                }
              />
            </Form>
          ))
          .with(true, () => (
            <>
              <div style={{ width: '500px', textAlign: 'center' }}>
                You're almost done. Please check your email to confirm your subscription.
              </div>
              <Dialog.Footer
                trailing={
                  <Button
                    onClick={() => {
                      setHasEarnifiDialog(false)
                      setHasCreatedReminder(false)
                    }}
                  >
                    Close
                  </Button>
                }
              />
            </>
          ))
          .exhaustive()}
      </Dialog>
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
              items={[
                {
                  value: 'earnifi',
                  label: 'Earn.fi reminders',
                  onClick: () => {
                    setHasEarnifiDialog(true)
                  },
                },
                ...calendarOptions.map((option) => ({
                  label: option.label,
                  onClick: () => window.open(option.function(makeEvent()), '_blank'),
                  color: 'text',
                })),
              ]}
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
                  showExtendNamesInput(`extend-names-${name}`, {
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
    </>
  )
}
export default Miscellaneous

/*
{
  name: 'dawsonbotsford@gmail.com',
  address: 'example.eth',
  chainId: 5,
}
*/
