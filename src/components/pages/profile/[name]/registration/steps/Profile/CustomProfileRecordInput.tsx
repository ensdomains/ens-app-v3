import { UseFormRegister, UseFormTrigger } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css, useTheme } from 'styled-components'

import { Input } from '@ensdomains/thorin'

import { RegistrationForm } from '@app/hooks/useRegistrationForm'
import mq from '@app/mediaQuery'

import { DeleteButton } from './DeleteButton'
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

const DeleteButtonWrapper = styled.div(
  ({ theme }) => css`
    margin-right: -${theme.space[2]};
  `,
)

type Props = {
  error?: string
  register: UseFormRegister<RegistrationForm>
  trigger: UseFormTrigger<RegistrationForm>
  index: number
  validator?: (value: string) => boolean | string | Promise<boolean | string>
  showDelete?: boolean
  onDelete?: () => void
}

export const CustomProfileRecordInput = ({
  register,
  trigger,
  index,
  validator,
  error,
  showDelete = true,
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
            {...register(`records.${index}.key`, {
              required: t('steps.profile.errors.labelRequired'),
              validate: validator,
              onChange: () => {
                trigger()
              },
            })}
          />
        </LabelWrapper>
        <ValueWrapper>
          <Input
            label=""
            hideLabel
            showDot
            error={!!error}
            suffix={
              showDelete && (
                <DeleteButtonWrapper>
                  <DeleteButton size="medium" onClick={() => onDelete?.()} />
                </DeleteButtonWrapper>
              )
            }
            parentStyles={css`
              height: ${theme.space[12]};
            `}
            {...register(`records.${index}.value`)}
          />
        </ValueWrapper>
      </ResponsiveContainer>
    </Field>
  )
}
