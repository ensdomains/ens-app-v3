import { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { CrossSVG, Textarea } from '@ensdomains/thorin'

const Container = styled.div(
  () => css`
    position: relative;
    width: 100%;
    display: flex;
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
        <Textarea
          ref={ref}
          label={label}
          labelSecondary={secondaryLabel}
          error={error}
          showDot
          validated={validated}
          width="full"
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
        <ButtonContainer>
          <DeleteButton type="button" onClick={onDelete}>
            <InnerButtonWrapper>
              <CrossSVG />
            </InnerButtonWrapper>
          </DeleteButton>
        </ButtonContainer>
      </Container>
    )
  },
)
