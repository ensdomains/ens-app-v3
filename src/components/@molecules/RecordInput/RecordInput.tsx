import { ComponentProps, ReactNode, Ref, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Input } from '@ensdomains/thorin'

import UnsupportedSVG from '@app/assets/Unsupported.svg'

import { useDefaultRef } from '../../../hooks/useDefaultRef'

const Container = styled.div(
  () => css`
    display: flex;
    align-items: flex-end;
    gap: 5px;
    position: relative;
  `,
)

const InputWrapper = styled.div<{ $error: boolean }>(
  ({ theme, $error }) => css`
    flex: 1;
    position: relative;
    ${$error && `margin-bottom: -${theme.space['2']};`}
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
    color: ${theme.colors.textTertiary};
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
      if (showDefaultPrefix) return <UnsupportedSVG />
    })()

    const error = errorProp ? <ErrorWrapper>{errorProp}</ErrorWrapper> : undefined

    const labelText = labelProp || option?.label || option?.value || ''
    const label = <LabelWrapper>{labelText}</LabelWrapper>

    const labelSecondary = disabled ? <LabelSecondary>{labelDisabled}</LabelSecondary> : undefined

    const handleClickAction = () => {
      if (deletable) return onDelete?.()
      return onClear?.()
    }

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
            clearable={!deletable}
            onClickAction={handleClickAction}
            {...props}
          />
        </InputWrapper>
      </Container>
    )
  },
)
