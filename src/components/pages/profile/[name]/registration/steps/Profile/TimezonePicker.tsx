import { Control, Controller } from 'react-hook-form'
import styled, { css } from 'styled-components'

import { CrossSVG, Select } from '@ensdomains/thorin'

import { timezoneOptionsWithValue } from '@app/constants/timezoneOptions'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

const Container = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    align-items: stretch;
    position: relative;
  `,
)

const SelectWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['11']};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: ${theme.space['8']};
    margin-top: -1px;
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

const InnerButtonWrapper = styled.div<{ $disabled?: boolean }>(
  ({ theme, $disabled }) => css`
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

    ${$disabled &&
    css`
      svg {
        color: ${theme.colors.border};
      }

      &:hover {
        background: none;
        transform: initial;
        cursor: not-allowed;
      }
    `}
  `,
)

type Props = {
  control: Control<ProfileEditorForm>
  index: number
  label?: string
  secondaryLabel?: string
  placeholder?: string
  error?: string
  validated?: boolean
  disabled?: boolean
  validator?: (value?: string) => string | boolean | Promise<string | boolean>
  onDelete?: () => void
}

export const TimezonePicker = ({
  control,
  index,
  label,
  secondaryLabel,
  placeholder,
  error,
  validated,
  disabled,
  validator,
  onDelete,
}: Props) => {
  return (
    <Container data-testid="profile-record-input-timezone">
      <SelectWrapper>
        <Controller
          control={control}
          name={`records.${index}.value`}
          rules={validator ? { validate: validator } : undefined}
          render={({ field }) => (
            <Select
              autocomplete
              size="medium"
              label={label ?? ''}
              labelSecondary={secondaryLabel}
              placeholder={placeholder}
              // Surface a pre-existing / non-enumerated value so it isn't shown as unset.
              options={timezoneOptionsWithValue(field.value)}
              value={field.value}
              showDot
              validated={validated}
              error={error}
              disabled={disabled}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            />
          )}
        />
      </SelectWrapper>
      <ButtonContainer>
        <DeleteButton
          type="button"
          disabled={disabled}
          data-testid="profile-record-input-timezone-delete-button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onDelete?.()}
        >
          <InnerButtonWrapper $disabled={disabled}>
            <CrossSVG />
          </InnerButtonWrapper>
        </DeleteButton>
      </ButtonContainer>
    </Container>
  )
}
