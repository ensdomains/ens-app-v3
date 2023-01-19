import { ComponentProps, FocusEvent, ReactNode, Ref, RefObject, forwardRef, useMemo } from 'react'
import styled, { css, useTheme } from 'styled-components'

import { Input } from '@ensdomains/thorin'

import { DynamicIcon } from './DynamicIcon'
import { Field } from './Field'

const Container = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    align-items: flex-end;
    gap: 5px;
    position: relative;
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
      placeholder = 'Enter value here',
      onFocus,
      onBlur,
      onDelete,
      ...props
    }: Props,
    ref: Ref<HTMLElement>,
  ) => {
    const theme = useTheme()

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
        <Field label={label} secondaryLabel={secondaryLabel} errorLabel={error}>
          <Input
            size="medium"
            label=""
            hideLabel
            ref={ref as RefObject<HTMLInputElement>}
            icon={prefix}
            showDot
            error={!!error}
            placeholder={placeholder}
            data-testid={`profile-record-input-input-${recordKey}`}
            validated={validated}
            parentStyles={css`
              height: ${theme.space['12']};
            `}
            iconWidth="5.5"
            onFocus={onFocus}
            onBlur={onBlur}
            clearable
            onClickAction={() => {
              handleDelete()
            }}
            {...props}
            // suffix={
            //   showDelete && (
            //     <DeleteButtonWrapper>
            //       <DeleteButton
            //         type="button"
            //         onClick={handleDelete}
            //         onMouseDown={(e) => e.preventDefault()}
            //         data-testid={`profile-record-input-delete-button-${recordKey}`}
            //       />
            //     </DeleteButtonWrapper>
            //   )
            // }
          />
        </Field>
      </Container>
    )
  },
)
