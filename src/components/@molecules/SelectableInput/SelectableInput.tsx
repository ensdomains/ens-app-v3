import { Button, Input, Select, CloseSVG } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import React, { ComponentProps, forwardRef, Ref } from 'react'

const Container = styled.div(
  () => css`
    display: flex;
    align-items: flex-start;
    gap: 5px;
    position: relative;
  `,
)

const InputContainer = styled.div<{
  $hasError?: boolean
  $hasChanges?: boolean
}>(
  ({ theme, $hasError, $hasChanges }) => css`
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
      top: 0;
      right: 0;
      transform: translate(20%, -20%) scale(0.2);
      transition: all 0.3s ease-out;
    }

    ${$hasChanges &&
    css`
      :after {
        background-color: ${theme.colors.green};
        border-color: ${theme.colors.white};
        transform: translate(20%, -20%) scale(1);
      }
    `}

    &:focus-within::after {
      background-color: ${theme.colors.blue};
      border-color: ${theme.colors.white};
      transform: translate(20%, -20%) scale(1);
    }

    ${$hasError &&
    css`
      :after,
      &:focus-within::after {
        background-color: ${theme.colors.red};
        border: 1px solid ${theme.colors.white};
        transform: translate(20%, -20%) scale(1);
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
    margin-left: -18px;
    ${$size === 'medium'
      ? css`
          border-radius: ${theme.radii.extraLarge};
          padding: ${theme.space['4']};
          height: ${theme.space['14']};
        `
      : css`
          border-radius: ${theme.radii.almostExtraLarge};
          padding: ${theme.space['2']};
          height: ${theme.space['10']};
        `}
  `,
)

const ButtonContainer = styled.div<{ $readOnly?: boolean }>(
  ({ theme, $readOnly }) => css`
    width: 33px;
    height: 33px;
    margin-top: 10px;
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
  selectValue: ThorinSelectProps['value']
  options: ThorinSelectProps['options']
  hasChanges?: boolean
  onSelectChange?: ThorinSelectProps['onChange']
  onDelete?: () => void
} & ThorinInputProps

export const SelectableInput = forwardRef(
  (
    {
      selectValue,
      onSelectChange,
      value,
      options,
      readOnly,
      error,
      hasChanges,
      ...props
    }: Props,
    ref: Ref<HTMLInputElement>,
  ) => {
    const selectedOption = options.find(
      (option) => option.value === selectValue,
    )
    const prefix = readOnly ? (
      <ReadOnlySelect $size="medium">
        <div>{selectedOption?.prefix}</div>
        <div>{selectedOption?.label}</div>
      </ReadOnlySelect>
    ) : (
      <Select
        value={selectValue}
        options={options}
        label="hello"
        size="medium"
        hideLabel
        style={{ marginLeft: '-18px' }}
        onChange={onSelectChange}
      />
    )
    return (
      <Container>
        <InputContainer $hasError={!!error} $hasChanges={hasChanges}>
          <Input
            size="medium"
            value={value}
            ref={ref}
            prefix={prefix}
            readOnly={readOnly}
            {...props}
            hideLabel
            error={error}
          />
        </InputContainer>
        <ButtonContainer $readOnly={readOnly}>
          <Button size="extraSmall" variant="transparent" shadowless>
            <CloseSVG />
          </Button>
        </ButtonContainer>
      </Container>
    )
  },
)
