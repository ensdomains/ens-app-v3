import { ComponentProps, FocusEvent, forwardRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Textarea } from '@ensdomains/thorin'

import { useDefaultRef } from '@app/hooks/useDefaultRef'

import { DeleteButton } from './DeleteButton'
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

const DeleteButtonWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    width: ${theme.space[12]};
    height: ${theme.space[12]};
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
    const textareaRef = useDefaultRef<HTMLTextAreaElement>(ref)

    const [showDelete, setShowDelete] = useState(true)
    const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
      onFocus?.(e)
      setShowDelete(false)
    }
    const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
      onBlur?.(e)
      setShowDelete(true)
    }
    return (
      <Container data-testid={`profile-record-input-${recordKey}`}>
        <Field label={label} secondaryLabel={secondaryLabel} errorLabel={error}>
          <TextareaContainer>
            <Textarea
              ref={textareaRef}
              label=""
              hideLabel
              showDot={validated}
              width="full"
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            {showDelete && (
              <DeleteButtonWrapper>
                <DeleteButton
                  onClick={() => {
                    onDelete?.()
                  }}
                />
              </DeleteButtonWrapper>
            )}
          </TextareaContainer>
        </Field>
      </Container>
    )
  },
)
