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

const ReadOnlySelect = styled.div<{ $size: string }>(
  ({ theme, $size }) => css`
    background: ${theme.colors.backgroundTertiary};
    border-color: ${theme.colors.backgroundHide};
    border-width: ${theme.space.px};
    gap: ${theme.space['2']};
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
    ${$hasError && `border: ${theme.space['0.75']} solid ${theme.colors.red};`}
    border-left: none;
    border-radius: ${theme.radii['2xLarge']};
    box-sizing: content-box;
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
  deletable?: boolean
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
      deletable = true,
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
          padding={{ outer: '3', inner: '2' }}
          rows={3}
          inputSize={{ min: 8 }}
          {...selectProps}
        />
      </SelectWrapper>
    )

    return (
      <Container>
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
        {deletable && (
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
        )}
      </Container>
    )
  },
)
