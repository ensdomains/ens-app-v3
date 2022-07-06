import { Button, Input, Select, CloseSVG } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import React, { ComponentProps, forwardRef, Ref } from 'react'

const Container = styled.div(
  () => css`
    display: flex;
    align-items: flex-end;
    gap: 5px;
    position: relative;
  `,
)

const InputContainer = styled.div<{
  $hasError?: boolean
  $hasChanges?: boolean
  $size?: 'medium' | 'large' | 'extraLarge'
}>(
  ({ theme, $hasError, $hasChanges, $size }) => css`
    position: relative;
    flex: 1;
    :after {
      content: '';
      position: absolute;
      background-color: transparent;
      width: 12px;
      height: 12px;
      border: 1px solid transparent;
      box-sizing: border-box;
      border-radius: 50%;
      right: 0;
      transform: translate(20%, 45%) scale(0.2);
      transition: all 0.3s ease-out;

      ${() => {
        switch ($size) {
          case 'medium':
            return css`
              bottom: ${theme.space['14']};
            `
          case 'large':
            return css`
              bottom: ${theme.space['16']};
            `
          case 'extraLarge':
            return css`
              bottom: ${theme.space['18']};
            `
          default:
            return ``
        }
      }}
    }

    ${$hasChanges &&
    css`
      :after {
        background-color: ${theme.colors.green};
        border-color: ${theme.colors.white};
        transform: translate(20%, 45%) scale(1);
      }
    `}

    &:focus-within::after {
      background-color: ${theme.colors.blue};
      border-color: ${theme.colors.white};
      transform: translate(20%, 45%) scale(1);
    }

    ${$hasError &&
    css`
      :after,
      &:focus-within::after {
        background-color: ${theme.colors.red};
        border: 1px solid ${theme.colors.white};
        transform: translate(20%, 45%) scale(1);
      }
    `}
  `,
)

const ReadOnlySelect = styled.div<{ $size: string }>(
  ({ theme, $size }) => css`
    background: ${theme.colors.backgroundTertiary};
    border-color: ${theme.colors.backgroundHide};
    border-width: ${theme.space.px};
    gap: ${theme.space['4']};
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    z-index: 10;
    white-space: nowrap;
    ${$size === 'medium'
      ? css`
          border-radius: ${theme.radii.extraLarge};
          padding: ${theme.space['3']};
          height: ${theme.space['14']};
        `
      : css`
          border-radius: ${theme.radii.almostExtraLarge};
          padding: ${theme.space['2']};
          height: ${theme.space['10']};
        `}
  `,
)

const SelectWrapper = styled.div<{ $hasError: boolean }>(
  ({ theme, $hasError }) => css`
    ${$hasError && `border-right: 1px solid ${theme.colors.red};`}
    border-radius: ${theme.radii['2xLarge']};
  `,
)

const ButtonContainer = styled.div<{ $readOnly?: boolean }>(
  ({ theme, $readOnly }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    margin-bottom: ${theme.space['3.5']};
    margin-right: -10px;
    svg {
      display: block;
      path {
        fill: ${$readOnly
          ? theme.colors.textTertiary
          : theme.colors.textSecondary};
      }
    }
  `,
)

type ThorinInputProps = ComponentProps<typeof Input>
type ThorinSelectProps = ComponentProps<typeof Select>
type Props = {
  selectProps: Omit<ThorinSelectProps, 'label'>
  hasChanges?: boolean
  onDelete?: () => void
} & ThorinInputProps

export const SelectableInput = forwardRef(
  (
    {
      selectProps,
      value,
      readOnly,
      error,
      hasChanges,
      onDelete,
      ...props
    }: Props,
    ref: Ref<HTMLInputElement>,
  ) => {
    const selectedOption = selectProps?.options.find(
      (option) => option.value === selectProps.value,
    )

    const prefix = readOnly ? (
      <ReadOnlySelect $size="medium">
        {selectedOption?.prefix && <div>{selectedOption?.prefix}</div>}
        <div>{selectedOption?.node || selectedOption?.label}</div>
      </ReadOnlySelect>
    ) : (
      <SelectWrapper $hasError={!!error}>
        <Select
          label={props.label}
          size="medium"
          hideLabel
          padding="3"
          rows={5}
          {...selectProps}
        />
      </SelectWrapper>
    )
    return (
      <Container>
        <InputContainer
          $hasError={!!error}
          $hasChanges={hasChanges}
          $size="medium"
        >
          <Input
            size="medium"
            value={value}
            ref={ref}
            prefix={prefix}
            readOnly={readOnly}
            {...props}
            hideLabel
            padding={{ prefix: '0' }}
            error={error}
            labelPlacement={{ error: 'top' }}
          />
        </InputContainer>
        <ButtonContainer $readOnly={readOnly}>
          <Button
            size="extraSmall"
            variant="transparent"
            shadowless
            onClick={onDelete}
          >
            <CloseSVG />
          </Button>
        </ButtonContainer>
      </Container>
    )
  },
)
