import { vars } from "@ensdomains/thorin";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { ConditionalWrapper } from "./ConditionalWrapper";

const StyledAnchor = styled.a<{ isActive: boolean; disabled?: boolean }>`
  color: ${vars.colors.textTertiary};
  font-weight: ${vars.fontWeights.bold};
  font-size: ${vars.fontSizes.large};
  cursor: pointer;
  transition: color 0.125s ease-in-out;

  &:hover {
    color: ${({ disabled }) => !disabled && vars.colors.textSecondary};
  }

  ${({ disabled }) =>
    disabled &&
    `
    color: ${vars.colors.textPlaceholder};
    cursor: default;
  `}
  ${({ isActive }) => isActive && `color: ${vars.colors.accent};`}
`;

export const StyledNavLink = ({
  children,
  disabled,
  ...props
}: PropsWithChildren<LinkProps> & {
  disabled?: boolean;
}) => {
  const router = useRouter();
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
  );
};
