import { UseFormRegister, UseFormTrigger } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css, useTheme } from 'styled-components'

import { Input } from '@ensdomains/thorin'

import { RegistrationForm } from '@app/hooks/useRegistrationForm'
import mq from '@app/mediaQuery'

import { Field } from './Field'

const ResponsiveContainer = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
  `,
  mq.md.min(css`
    flex-direction: row;
  `),
])

const LabelWrapper = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.md.min(css`
    flex: 0 0 25%;
  `),
])

const ValueWrapper = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.md.min(css`
    flex: 1;
  `),
])

type Props = {
  error?: string
  register: UseFormRegister<RegistrationForm>
  trigger: UseFormTrigger<RegistrationForm>
  index: number
  validator?: (value: string) => boolean | string | Promise<boolean | string>
  validated?: boolean
  onDelete?: () => void
}

export const CustomProfileRecordInput = ({
  register,
  trigger,
  index,
  validator,
  validated,
  error,
  onDelete,
}: Props) => {
  const theme = useTheme()
  const { t } = useTranslation('register')
  return (
    <Field label={t('steps.profile.options.groups.other.items.custom')} errorLabel={error}>
      <ResponsiveContainer>
        <LabelWrapper>
          <Input
            label=""
            hideLabel
            error={!!error}
            parentStyles={css`
              height: ${theme.space[12]};
            `}
            placeholder={t('steps.profile.options.groups.custom.key')}
            {...register(`records.${index}.key`, {
              required: t('steps.profile.errors.labelRequired'),
              validate: validator,
              onChange: () => {
                trigger()
              },
            })}
            data-testid="custom-profile-record-input-key"
          />
        </LabelWrapper>
        <ValueWrapper>
          <Input
            label=""
            hideLabel
            placeholder={t('steps.profile.options.groups.custom.value')}
            showDot
            validated={validated}
            error={!!error}
            onClickAction={onDelete}
            {...register(`records.${index}.value`)}
            data-testid="custom-profile-record-input-value"
          />
        </ValueWrapper>
      </ResponsiveContainer>
    </Field>
  )
}
