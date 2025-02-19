import { ComponentProps, FocusEvent, forwardRef, ReactNode, Ref, RefObject, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { CrossSVG, Input } from '@ensdomains/thorin'

import { DynamicIcon } from './DynamicIcon'

const Container = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    align-items: stretch;
    position: relative;
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

const IconWrapper = styled.div(
  () => css`
    svg {
      display: block;
      width: 22px;
      height: 22px;
    }
  `,
)

type ThorinInputProps = ComponentProps<typeof Input>
type Props = {
  recordKey: string
  group?: string
  validated?: boolean
  showDefaultPrefix?: boolean
  label?: string
  secondaryLabel?: string
  labelDisabled?: string
  option?: {
    value: string
    label?: string
    prefix?: ReactNode
  }
  deletable?: boolean
  onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onDelete?: () => void
} & Omit<ThorinInputProps, 'label' | 'labelSecondary' | 'onFocus' | 'onBlur'>

export const ProfileRecordInput = forwardRef(
  (
    {
      recordKey,
      group,
      readOnly,
      error,
      validated,
      label,
      secondaryLabel,
      showDot,
      prefix: prefixProp,
      label: labelProp,
      option,
      disabled,
      placeholder = 'Enter value here',
      onFocus,
      onBlur,
      onDelete,
      ...props
    }: Props,
    ref: Ref<HTMLElement>,
  ) => {
    const prefix = useMemo(() => {
      if (!group) return null
      if (['address', 'website', 'social'].includes(group))
        return (
          <IconWrapper>
            <DynamicIcon group={group} name={recordKey} />
          </IconWrapper>
        )
      return null
    }, [recordKey, group])

    const handleDelete = () => {
      if (onDelete) onDelete()
    }

    return (
      <Container data-testid={`profile-record-input-${recordKey}`}>
        <Input
          size="medium"
          label={label}
          labelSecondary={secondaryLabel}
          ref={ref as RefObject<HTMLInputElement>}
          icon={prefix}
          showDot
          error={error}
          placeholder={placeholder}
          data-testid={`profile-record-input-input-${recordKey}`}
          validated={validated}
          iconWidth="5.5"
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
        <ButtonContainer>
          <DeleteButton
            type="button"
            disabled={disabled}
            data-testid={`profile-record-input-${recordKey}-delete-button`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleDelete}
          >
            <InnerButtonWrapper $disabled={disabled}>
              <CrossSVG />
            </InnerButtonWrapper>
          </DeleteButton>
        </ButtonContainer>
      </Container>
    )
  },
)
