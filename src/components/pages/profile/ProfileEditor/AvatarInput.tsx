import { Avatar, VisuallyHidden } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import React, { InputHTMLAttributes, useRef, RefObject, Ref } from 'react'

const Container = styled.button(
  ({ theme }) => css`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid ${theme.colors.borderSecondary};
    box-sizing: border-box;
    background-color: ${theme.colors.white};
  `,
)

type Props = {
  hasChanged?: boolean
  value?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'>

const AvatarInput = React.forwardRef(
  (
    { hasChanged, value, defaultValue, ...props }: Props,
    ref: Ref<HTMLInputElement>,
  ) => {
    const defaultRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as RefObject<HTMLInputElement>) || defaultRef
    console.log(value)

    return (
      <Container>
        {value}
        <Avatar label="profile-avatar" src={value} noBorder />
        <VisuallyHidden>
          <input ref={inputRef} type="text" tabIndex={-1} {...props} />
        </VisuallyHidden>
      </Container>
    )
  },
)

export default AvatarInput
