import { tokens } from '@ensdomains/thorin'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { ConditionalWrapper } from './ConditionalWrapper'

const StyledAnchor = styled.a<{ isActive: boolean; disabled?: boolean }>`
  color: ${({ theme }) => tokens.colors[theme.mode].textTertiary};
  font-weight: ${tokens.fontWeights.bold};
  font-size: ${tokens.fontSizes.large};
  cursor: pointer;
  transition: color 0.125s ease-in-out;

  &:hover {
    color: ${({ disabled, theme }) =>
      !disabled && tokens.colors[theme.mode].textSecondary};
  }

  ${({ disabled, theme }) =>
    disabled &&
    `
    color: ${tokens.colors[theme.mode].textPlaceholder};
    cursor: default;
  `}
  ${({ isActive, theme }) =>
    isActive && `color: ${tokens.colors[theme.mode].accent};`}
`

export const StyledNavLink = ({
  children,
  disabled,
  ...props
}: PropsWithChildren<LinkProps> & {
  disabled?: boolean
}) => {
  const router = useRouter()
  return (
    <ConditionalWrapper
      condition={!disabled}
      wrapper={(wrapperChildren) => (
        <Link {...props} passHref>
          {wrapperChildren}
        </Link>
      )}
    >
      <StyledAnchor disabled={disabled} isActive={router.asPath === props.href}>
        {children}
      </StyledAnchor>
    </ConditionalWrapper>
  )
}
