import { forwardRef } from 'react'
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  useFormState,
  UseFormTrigger,
  useWatch,
} from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dialog, Input, RadioButton, Typography } from '@ensdomains/thorin'

import { dateTimeLocalToDate, dateToDateTimeLocal, stripDateMs } from '@app/utils/datetime-local'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'
import type { FormData, RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

type Props = {
  name: string
  minExpiry?: number
  maxExpiry: number
  register: UseFormRegister<FormData>
  control: Control<FormData>
  getValues: UseFormGetValues<FormData>
  trigger: UseFormTrigger<FormData>
} & RevokePermissionsDialogContentProps

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

export const SetExpiryView = forwardRef<HTMLFormElement, Props>(
  (
    { name, minExpiry, maxExpiry, register, control, getValues, trigger, ...dialogContentProps },
    ref,
  ) => {
    const { t } = useTranslation('transactionFlow')

    const canExtendExpiry = useWatch({ control, name: 'parentFuses.CAN_EXTEND_EXPIRY' })
    const nameParts = name.split('.')
    const parentName = nameParts.slice(1).join('.')

    const formState = useFormState({ control, name: 'expiryCustom' })
    const customErrorLabel = formState.errors.expiryCustom?.message

    const minDate = new Date(Math.max((minExpiry || 0) * 1000, Date.now()))
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
        <Dialog.Content {...dialogContentProps} ref={ref}>
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
                  error={!!customErrorLabel}
                  clearable={false}
                  min={stripDateMs(minDateTime)}
                  max={stripDateMs(maxDateTime)}
                  step={60}
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
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
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
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
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
        </Dialog.Content>
      </>
    )
  },
)
