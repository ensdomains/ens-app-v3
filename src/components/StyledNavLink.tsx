import { vars } from "@ensdomains/thorin";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledAnchor = styled.a<{ isActive: boolean }>`
  color: ${vars.colors.textTertiary};
  font-weight: ${vars.fontWeights.bold};
  font-size: ${vars.fontSizes.large};
  cursor: pointer;
  transition: color 0.125s ease-in-out;

  &:hover {
    color: ${vars.colors.textSecondary};
  }

  ${({ isActive }) => isActive && `color: ${vars.colors.accent};`}
`;

export const StyledNavLink = ({
  children,
  ...props
}: PropsWithChildren<LinkProps>) => {
  const router = useRouter();
  return (
    <Link {...props} passHref>
      <StyledAnchor isActive={router.asPath === props.href}>
        {children}
      </StyledAnchor>
    </Link>
  );
};
