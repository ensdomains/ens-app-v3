import { Button, Input, CloseSVG } from '@ensdomains/thorin'
import styled, { css, useTheme } from 'styled-components'
import React, { ComponentProps, forwardRef, Ref, ReactNode } from 'react'
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

const ButtonContainer = styled.div<{ $readOnly?: boolean }>(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    margin-bottom: ${theme.space['3']};
    svg {
      display: block;
      path {
        fill: ${theme.colors.textSecondary};
      }
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
      disabled,
      ...props
    }: Props,
    ref: Ref<HTMLInputElement>,
  ) => {
    const inputRef = useDefaultRef<HTMLInputElement>(ref)
    const theme = useTheme()

    const prefix = (() => {
      if (prefixProp) return prefixProp
      if (option?.prefix) return <IconWrapper>{option.prefix}</IconWrapper>
      if (showDefaultPrefix)
        return (
          <IconWrapper>
            <UnsupportedSVG />
          </IconWrapper>
        )
    })()

    const error = errorProp ? <ErrorWrapper>{errorProp}</ErrorWrapper> : undefined

    const labelText = labelProp || option?.label || option?.value || ''
    const label = <LabelWrapper>{labelText}</LabelWrapper>

    const labelSecondary = disabled ? <LabelSecondary>{labelDisabled}</LabelSecondary> : undefined

    const handleDelete = () => {
      if (onDelete) onDelete()
    }

    return (
      <Container data-testid={`record-input-${labelText}`}>
        <InputWrapper $error={!!error}>
          <Input
            size="medium"
            value={value}
            ref={inputRef}
            prefix={prefix}
            showDot={showDot}
            label={label}
            padding="3.5"
            error={error}
            placeholder={placeholder}
            labelPlacement={{ error: 'bottom' }}
            data-testid="record-input-input"
            validated={validated}
            labelSecondary={labelSecondary}
            parentStyles={css`
              height: ${theme.space['12']};
            `}
            disabled={disabled}
            {...props}
          />
        </InputWrapper>
        {deletable && (
          <ButtonContainer>
            <Button
              size="extraSmall"
              variant="transparent"
              shadowless
              onClick={handleDelete}
              onMouseDown={(e) => e.preventDefault()}
              data-testid="record-input-delete"
            >
              <CloseSVG />
            </Button>
          </ButtonContainer>
        )}
      </Container>
    )
  },
)
