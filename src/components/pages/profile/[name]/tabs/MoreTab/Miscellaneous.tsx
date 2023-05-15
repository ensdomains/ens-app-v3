import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { Button, Dialog, Dropdown, Input, Typography, mq } from '@ensdomains/thorin'

import CalendarSVG from '@app/assets/Calendar.svg'
import FastForwardSVG from '@app/assets/FastForward.svg'
import OutlinkSVG from '@app/assets/Outlink.svg'
import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'
import { useChainId } from '@app/hooks/useChainId'
import { useChainName } from '@app/hooks/useChainName'
import useRegistrationDate from '@app/hooks/useRegistrationData'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { formatDateTime, formatExpiry, makeEtherscanLink } from '@app/utils/utils'

import { TabWrapper } from '../../../TabWrapper'

interface FormData {
  email: string
}

const EARNIFI_ENDPOINT = 'https://notifications-api.vercel.app/api/v1/ens/subscribe'
const EARNIFI_OUTLINK =
  'https://earni.fi/?utm_source=ENS+Modal&utm_medium=Banner&utm_campaign=ENS_Partnership'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i

const calendarOptions = [
  {
    value: 'google',
    label: 'tabs.more.misc.reminderOptions.google',
    function: google,
  },
  {
    value: 'outlook',
    label: 'tabs.more.misc.reminderOptions.outlook',
    function: outlook,
  },
  {
    value: 'office365',
    label: 'tabs.more.misc.reminderOptions.office365',
    function: office365,
  },
  {
    value: 'yahoo',
    label: 'tabs.more.misc.reminderOptions.yahoo',
    function: yahoo,
  },
  {
    value: 'ics',
    label: 'tabs.more.misc.reminderOptions.ical',
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

    #remind-me-button {
      cursor: pointer;
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
      width: ${theme.space['128']};
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
  } = useForm<FormData>({ mode: 'onChange' })

  const onSubmit = async ({ email }: FormData) => {
    try {
      const response = await fetch(EARNIFI_ENDPOINT, {
        method: 'POST',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          address: name,
          chainId,
        }),
      })
      if (response?.ok) {
        setHasCreatedReminder(true)
        return
      }
      if (response?.status === 400) {
        const responseMessage = ((await response.json()) as any)?.message
        setError('email', {
          type: 'submitError',
          message: responseMessage || 'Submission failed. Please try again.',
        })
        return
      }
      throw new Error('Submission error')
    } catch (e) {
      setError('email', {
        type: 'submitError',
        message: 'Submission failed. Please try again.',
      })
    }
    setTimeout(() => {
      clearErrors('email')
    }, 3000)
  }

  if (!expiryDate) return null

  return (
    <>
      <Dialog open={hasEarnifiDialog} variant="blank" onDismiss={() => null}>
        <Dialog.Heading title={t('tabs.more.misc.earnfi.title', { ns: 'profile' })} />
        {match(hasCreatedReminder)
          .with(false, () => (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Typography style={{ textAlign: 'center' }}>
                <Trans
                  style={{ textAlign: 'center' }}
                  i18nKey="tabs.more.misc.earnfi.enterEmail"
                  ns="profile"
                  components={{
                    a: <Outlink href={EARNIFI_OUTLINK} />,
                  }}
                />
              </Typography>
              <Spacer $height="3" />
              <Input
                type="email"
                id="email"
                label={t('action.enterEmail')}
                {...register('email', {
                  required: t('errors.emailRequired'),
                  pattern: {
                    value: emailRegex,
                    message: t('errors.emailInvalid'),
                  },
                })}
                error={errors.email?.message}
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
                    {t('action.cancel')}
                  </Button>
                }
                trailing={
                  <Button type="submit" disabled={!!errors.email} loading={isSubmitting}>
                    {t('action.continue')}
                  </Button>
                }
              />
            </Form>
          ))
          .with(true, () => (
            <>
              <div style={{ width: '500px', textAlign: 'center' }}>
                {t('tabs.more.misc.earnfi.emailConfirmation', { ns: 'profile' })}
              </div>
              <Dialog.Footer
                trailing={
                  <Button
                    onClick={() => {
                      setHasEarnifiDialog(false)
                      setHasCreatedReminder(false)
                    }}
                  >
                    {t('action.close')}
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
              width={220}
              items={[
                {
                  value: 'earnifi',
                  label: t('tabs.more.misc.reminderOptions.earnifi', { ns: 'profile' }),
                  onClick: () => {
                    setHasEarnifiDialog(true)
                  },
                },
                ...calendarOptions.map((option) => ({
                  label: t(option.label, { ns: 'profile' }),
                  onClick: () => window.open(option.function(makeEvent()), '_blank'),
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
