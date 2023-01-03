import { InputHTMLAttributes, forwardRef, useRef } from 'react'
import styled, { css } from 'styled-components'

import { CheckSVG, Typography } from '@ensdomains/thorin'

type Props = {
  title: string
  description: string
} & InputHTMLAttributes<HTMLInputElement>

const Container = styled.div(
  ({ theme }) => css`
    position: relative;
    width: 100%;

    input:checked ~ label div#circle {
      background: ${theme.colors.bluePrimary};
      border-color: transparent;
    }

    input:checked ~ label {
      background: ${theme.colors.blueSurface};
      border-color: transparent;
    }
  `,
)

const RootInput = styled.input(
  () => css`
    position: absolute;
    width: 1px;
    height: 1px;
  `,
)

const Label = styled.label(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['4']};

    width: 100%;
    height: 100%;
    padding: ${theme.space['4']};

    border-radius: ${theme.space['2']};
    border: 1px solid ${theme.colors.border};

    cursor: pointer;

    transition: all 0.3s ease-in-out;
  `,
)

const Circle = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: ${theme.space['7']};
    height: ${theme.space['7']};
    border-radius: ${theme.radii.full};
    border: 1px solid ${theme.colors.border};

    transition: all 0.3s ease-in-out;

    svg {
      display: block;
      color: ${theme.colors.backgroundPrimary};
      width: ${theme.space['4']};
      height: ${theme.space['4']};
    }
  `,
)

const Content = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
  `,
)

export const PermissionsCheckbox = forwardRef<HTMLInputElement, Props>(
  ({ title, description, name, ...props }, ref) => {
    const defaultRef = useRef<HTMLInputElement>(null)
    const inputRef = ref || defaultRef
    return (
      <Container>
        <RootInput type="checkbox" id={name} name={name} {...props} ref={inputRef} />
        <Label htmlFor={name} id="permissions-label">
          <Circle id="circle">
            <CheckSVG />
          </Circle>
          <Content>
            <Typography typography="Body/Bold" color="text">
              {title}
            </Typography>
            <Typography typography="Small/Normal" color="text">
              {description}
            </Typography>
          </Content>
        </Label>
      </Container>
    )
  },
)
