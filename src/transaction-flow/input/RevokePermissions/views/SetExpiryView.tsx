import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormTrigger,
  useFormState,
  useWatch,
} from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dialog, Input, RadioButton, Typography } from '@ensdomains/thorin'

import { dateTimeLocalToDate, dateToDateTimeLocal } from '@app/utils/datetime-local'

import type { FormData } from '../RevokePermissions-flow'
import { CenterAlignedTypography } from '../components/CenterAlignedTypography'

type Props = {
  name: string
  minExpiry?: number
  maxExpiry: number
  register: UseFormRegister<FormData>
  control: Control<FormData>
  getValues: UseFormGetValues<FormData>
  trigger: UseFormTrigger<FormData>
}

const ExpiryOptionsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
)

const DateContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']} ${theme.space['4']};
    background: ${theme.colors.greySurface};
    border-radius: ${theme.space['2']};
  `,
)

const CustomExpiryErrorLabel = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.red};
    margin-top: ${theme.space['2']};
    padding: 0 ${theme.space['2']};
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.body};
    line-height: ${theme.lineHeights.body};
  `,
)

export const SetExpiryView = ({
  name,
  minExpiry,
  maxExpiry,
  register,
  control,
  getValues,
  trigger,
}: Props) => {
  const { t } = useTranslation('transactionFlow')

  const canExtendExpiry = useWatch({ control, name: 'parentFuses.CAN_EXTEND_EXPIRY' })
  const nameParts = name.split('.')
  const parentName = nameParts.slice(1).join('.')

  const formState = useFormState({ control, name: 'expiryCustom' })
  const customErrorLabel = formState.errors.expiryCustom?.message

  const minDate = minExpiry ? new Date(minExpiry * 1000) : new Date()
  const maxDate = new Date(maxExpiry * 1000)

  const minDateTime = dateToDateTimeLocal(minDate)
  const maxDateTime = dateToDateTimeLocal(maxDate)

  const maxDateLabel = maxDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const maxTimeLabel = maxDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZoneName: 'short',
  })

  const expiryLabel = minDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <>
      <Dialog.Heading title={t('input.revokePermissions.views.setExpiry.title')} />
      <CenterAlignedTypography>
        {canExtendExpiry ? (
          <Trans
            t={t}
            i18nKey="input.revokePermissions.views.setExpiry.subtitleWithCEE"
            values={{ parent: parentName, expiry: expiryLabel }}
          />
        ) : (
          <Trans
            t={t}
            i18nKey="input.revokePermissions.views.setExpiry.subtitle"
            values={{ parent: parentName, expiry: expiryLabel }}
          />
        )}
      </CenterAlignedTypography>
      <ExpiryOptionsContainer>
        <RadioButton
          data-testid="radio-max"
          value="max"
          label={
            <Typography fontVariant="bodyBold" color="text">
              {t('input.revokePermissions.views.setExpiry.options.max')}
            </Typography>
          }
          description={
            <DateContainer>
              <Typography fontVariant="smallBold" color="text">
                {maxDateLabel}
              </Typography>
              <Typography fontVariant="small" color="grey">
                {maxTimeLabel}
              </Typography>
            </DateContainer>
          }
          {...register('expiryType', {
            onChange: () => {
              trigger('expiryCustom')
            },
          })}
        />
        <RadioButton
          data-testid="radio-custom"
          value="custom"
          label={
            <Typography fontVariant="bodyBold" color="text">
              {t('input.revokePermissions.views.setExpiry.options.custom')}
            </Typography>
          }
          description={
            <>
              <Input
                data-testid="input-expiry-custom"
                label="custom-expiry"
                type="datetime-local"
                hideLabel
                error={formState.errors.expiryCustom}
                clearable={false}
                min={minDateTime}
                max={maxDateTime}
                {...register('expiryCustom', {
                  validate: (value) => {
                    const expiryType = getValues('expiryType')
                    if (expiryType !== 'custom') return true
                    if (!value) return t('input.revokePermissions.views.setExpiry.error.required')
                    if (value < minDateTime) {
                      const dateLabel = dateTimeLocalToDate(minDateTime).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        },
                      )
                      return t('input.revokePermissions.views.setExpiry.error.min', {
                        date: dateLabel,
                      })
                    }
                    if (value > maxDateTime) {
                      const dateLabel = dateTimeLocalToDate(maxDateTime).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        },
                      )
                      return t('input.revokePermissions.views.setExpiry.error.max', {
                        date: dateLabel,
                      })
                    }
                    return true
                  },
                })}
              />
              {customErrorLabel && (
                <CustomExpiryErrorLabel>{customErrorLabel}</CustomExpiryErrorLabel>
              )}
            </>
          }
          {...register('expiryType')}
        />
      </ExpiryOptionsContainer>
    </>
  )
}
