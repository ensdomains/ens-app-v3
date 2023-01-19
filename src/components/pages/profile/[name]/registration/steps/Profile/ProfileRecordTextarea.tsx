import { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Textarea } from '@ensdomains/thorin'

import { Field } from './Field'

const Container = styled.div(
  () => css`
    position: relative;
    width: 100%;
  `,
)

const TextareaContainer = styled.div(
  () => css`
    position: relative;
  `,
)

type Props = {
  recordKey: string
  secondaryLabel?: string
  validated: boolean
  onDelete?: () => void
} & ComponentProps<typeof Textarea>

export const ProfileRecordTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    { recordKey, label, secondaryLabel, validated, error, onDelete, onFocus, onBlur, ...props },
    ref,
  ) => {
    return (
      <Container data-testid={`profile-record-input-${recordKey}`}>
        <Field label={label} secondaryLabel={secondaryLabel} errorLabel={error}>
          <TextareaContainer>
            <Textarea
              ref={ref}
              label=""
              hideLabel
              showDot={validated}
              width="full"
              onFocus={onFocus}
              onBlur={onBlur}
              onClickAction={onDelete}
              {...props}
            />
          </TextareaContainer>
        </Field>
      </Container>
    )
  },
)
