import { UseFormRegister, UseFormTrigger } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CrossSVG, Input } from '@ensdomains/thorin'

import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

import { Field } from './Field'

const Container = styled.div(
  () => css`
    display: flex;
    width: 100%;
  `,
)

const InnerResponsiveContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
    }
  `,
)

const LabelWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;
    @media (min-width: ${theme.breakpoints.sm}px) {
      flex: 0 0 25%;
    }
  `,
)

const ValueWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;
    @media (min-width: ${theme.breakpoints.sm}px) {
      flex: 1;
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['11']};
    margin-right: -${theme.space['1']};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: calc(${theme.space['8']} + ${theme.space['12']} + ${theme.space['2']});
    margin-top: -1px;
    @media (min-width: ${theme.breakpoints.sm}px) {
      padding-top: ${theme.space['8']};
    }
  `,
)

const DeleteButton = styled.button(
  ({ theme }) => css`
    width: ${theme.space['11']};
    height: ${theme.space['11']};

    display: flex;
    justify-content: center;
    align-items: center;
  `,
)

const InnerButtonWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 150ms ease-in-out;
    cursor: pointer;

    svg {
      color: ${theme.colors.greyPrimary};
      width: ${theme.space[4]};
      height: ${theme.space[4]};
    }

    &:hover {
      background: ${theme.colors.greySurface};
      transform: translateY(-1px);
    }
  `,
)

type Props = {
  error?: string
  register: UseFormRegister<ProfileEditorForm>
  trigger: UseFormTrigger<ProfileEditorForm>
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
  const { t } = useTranslation('register')
  return (
    <Container>
      <Field label={t('steps.profile.options.groups.other.items.custom')} errorLabel={error}>
        <InnerResponsiveContainer>
          <LabelWrapper>
            <Input
              label=""
              hideLabel
              error={!!error}
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
              {...register(`records.${index}.value`)}
              data-testid="custom-profile-record-input-value"
            />
          </ValueWrapper>
        </InnerResponsiveContainer>
      </Field>
      <ButtonContainer>
        <DeleteButton onClick={onDelete}>
          <InnerButtonWrapper>
            <CrossSVG />
          </InnerButtonWrapper>
        </DeleteButton>
      </ButtonContainer>
    </Container>
  )
}
