import { UseFormRegister } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dialog, Input, RadioButton, Typography } from '@ensdomains/thorin'

import { dateToDateTimeLocal } from '@app/utils/datetime-local'

import type { FormData } from '../RevokePermissions-flow'
import { AccountLink } from '../components/AccountLink'
import { CenterAlignedTypography } from '../components/CenterAlignedTypography'

type Props = {
  name: string
  minExpiry: number
  maxExpiry: number
  register: UseFormRegister<FormData>
  onDismiss: () => void
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

export const SetExpiryView = ({ name, minExpiry, maxExpiry, register, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const now = new Date(minExpiry)
  const date = new Date(maxExpiry)

  const min = dateToDateTimeLocal(now)
  const max = dateToDateTimeLocal(date)

  return (
    <>
      <Dialog.Heading
        title={t('input.revokePermissions.views.setExpiry.title')}
        onDismiss={() => onDismiss()}
      />
      <CenterAlignedTypography>
        <Trans
          t={t}
          i18nKey="input.revokePermissions.views.setExpiry.subtitle"
          values={{ account: name }}
          components={{
            parent: <AccountLink nameOrAddress={name} />,
          }}
        >
          {t('input.revokePermissions.views.setExpiry.subtitle')}
        </Trans>
      </CenterAlignedTypography>
      <ExpiryOptionsContainer>
        <RadioButton
          value="max"
          label={
            <Typography typography="Body/Bold" color="text">
              Keep current (max)
            </Typography>
          }
          description={
            <DateContainer>
              <Typography typography="Small/Bold" color="text">
                {`${date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}`}
              </Typography>
              <Typography typography="Small/Normal" color="grey">
                {`${date.toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: false,
                  timeZoneName: 'longOffset',
                })} `}
              </Typography>
            </DateContainer>
          }
          {...register('expiryType')}
        />
        <RadioButton
          value="custom"
          label={
            <Typography typography="Body/Bold" color="text">
              Choose an earlier date
            </Typography>
          }
          description={
            <Input
              label="custom-expiry"
              hideLabel
              type="datetime-local"
              clearable={false}
              min={min}
              max={max}
              {...register('expiryCustom')}
            />
          }
          {...register('expiryType')}
        />
      </ExpiryOptionsContainer>
    </>
  )
}
