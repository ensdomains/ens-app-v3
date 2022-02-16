import { useBreakpoint } from "@app/utils/BreakpointProvider";
import { Box, Stack, vars } from "@ensdomains/thorin";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import ENSFull from "../assets/ENSFull.svg";
import ENSWithGradient from "../assets/ENSWithGradient.svg";
import { ConditionalWrapper } from "./ConditionalWrapper";
import { HamburgerMenu } from "./HamburgerMenu";
import { HeaderConnect } from "./HeaderConnect";
import { LanugageDropdown } from "./LanguageDropdown";
import { StyledNavLink } from "./StyledNavLink";

const AlwaysShownRoutes = [
  { href: "/", label: "navigation.home" },
  { href: "/about", disabled: true, label: "navigation.about" },
  { href: "/developers", disabled: true, label: "navigation.developers" },
];

const DropdownRoutes = [
  {
    label: "navigation.community",
    href: "/community",
    disabled: true,
  },
  {
    label: "navigation.help",
    href: "/help",
    disabled: true,
  },
  {
    label: "navigation.governance",
    href: "/governance",
    disabled: true,
  },
  {
    label: "navigation.docs",
    href: "/docs",
    disabled: true,
  },
];

const HeaderWrapper = styled(Box)`
  height: ${vars.space["16"]};
`;

const LogoAnchor = styled.a`
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`;

export const Header = () => {
  const router = useRouter();
  const breakpoints = useBreakpoint();
  const { t } = useTranslation("common");

  return (
    <HeaderWrapper as="header">
      <Stack
        direction="horizontal"
        justify="center"
        align="center"
        space={{ xs: "3", sm: "6" }}
      >
        <ConditionalWrapper
          condition={router.asPath !== "/"}
          wrapper={(children) => (
            <Link passHref href="/">
              <LogoAnchor>{children}</LogoAnchor>
            </Link>
          )}
        >
          {breakpoints.sm ? (
            <ENSFull height="48" />
          ) : (
            <ENSWithGradient height="48" />
          )}
        </ConditionalWrapper>
        <LanugageDropdown />
        <Box flexGrow={1} />
        {breakpoints.lg &&
          AlwaysShownRoutes.map((route) => (
            <StyledNavLink
              disabled={route.disabled}
              key={route.href}
              href={route.href}
            >
              {t(route.label)}
            </StyledNavLink>
          ))}
        <HamburgerMenu
          dropdownItems={(!breakpoints.lg
            ? [...AlwaysShownRoutes, ...DropdownRoutes]
            : DropdownRoutes
          ).map((route) => ({ ...route, label: t(route.label) }))}
        />
        <HeaderConnect />
      </Stack>
    </HeaderWrapper>
  );
};
