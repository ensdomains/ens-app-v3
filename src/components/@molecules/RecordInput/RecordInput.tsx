import { ComponentProps, forwardRef, ReactNode, Ref } from 'react'
import styled, { css } from 'styled-components'

import { CrossSVG, Input } from '@ensdomains/thorin'

import UnsupportedSVG from '@app/assets/Unsupported.svg'

import { useDefaultRef } from '../../../hooks/useDefaultRef'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: flex-end;
    position: relative;
    width: ${theme.space.full};
  `,
)

const InputWrapper = styled.div<{ $error: boolean }>(
  ({ theme, $error }) => css`
    flex: 1;
    position: relative;
    ${$error && `margin-bottom: -${theme.space['2']};`}
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['11']};
    margin-right: -${theme.space['1']};
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: ${theme.space.px};
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

const LabelWrapper = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['3.5']};
    line-height: 1.2;
  `,
)

const LabelSecondary = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['3.5']};
    line-height: 1.2;
    color: ${theme.colors.grey};
  `,
)

const ErrorWrapper = styled.div(
  ({ theme }) => css`
    position: absolute;
    right: ${theme.space['4']};
    top: 0;
    font-size: ${theme.space['3.5']};
    white-space: nowrap;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
    line-height: 1.2;
  `,
)

type ThorinInputProps = ComponentProps<typeof Input>
type Props = {
  validated?: boolean
  showDefaultPrefix?: boolean
  label?: string
  labelDisabled?: string
  option?: {
    value: string
    label?: string
    prefix?: ReactNode
  }
  deletable?: boolean
  onDelete?: () => void
  onClear?: () => void
} & Omit<ThorinInputProps, 'label' | 'labelSecondary'>

export const RecordInput = forwardRef(
  (
    {
      value,
      readOnly,
      error: errorProp,
      validated,
      showDefaultPrefix = false,
      showDot,
      deletable = true,
      showDot: showDotProp,
      prefix: prefixProp,
      label: labelProp,
      labelDisabled = 'Input is disabled',
      option,
      placeholder = 'Enter value here',
      onDelete,
      onClear,
      disabled,
      ...props
    }: Props,
    ref: Ref<HTMLInputElement>,
  ) => {
    const inputRef = useDefaultRef<HTMLInputElement>(ref)

    const prefix = (() => {
      if (prefixProp) return prefixProp
      if (option?.prefix) return option.prefix
      if (showDefaultPrefix) return <UnsupportedSVG width={22} height={23} viewBox="0 0 22 23" />
    })()

    const error = errorProp ? <ErrorWrapper>{errorProp}</ErrorWrapper> : undefined

    const labelText = labelProp || option?.label || option?.value || ''
    const label = <LabelWrapper>{labelText}</LabelWrapper>

    const labelSecondary = disabled ? <LabelSecondary>{labelDisabled}</LabelSecondary> : undefined

    return (
      <Container data-testid={`record-input-${labelText}`}>
        <InputWrapper $error={!!error}>
          <Input
            size="medium"
            value={value}
            ref={inputRef}
            icon={prefix}
            showDot={showDot}
            label={label}
            error={error}
            placeholder={placeholder}
            data-testid="record-input-input"
            validated={validated}
            labelSecondary={labelSecondary}
            disabled={disabled}
            {...props}
          />
        </InputWrapper>
        {deletable && (
          <ButtonContainer>
            <DeleteButton
              data-testid="record-input-delete-button"
              onClick={onDelete}
              onMouseDown={(e) => e.preventDefault()}
              type="button"
            >
              <InnerButtonWrapper>
                <CrossSVG />
              </InnerButtonWrapper>
            </DeleteButton>
          </ButtonContainer>
        )}
      </Container>
    )
  },
)
