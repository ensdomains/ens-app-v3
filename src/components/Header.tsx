import mq from "@app/mediaQuery";
import { useBreakpoint } from "@app/utils/BreakpointProvider";
import { Box, Stack, vars } from "@ensdomains/thorin";
import { isReadOnly } from "@ensdomains/ui";
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
import { SearchInput } from "./SearchInput";
import { StyledNavLink } from "./StyledNavLink";
import { VerticalLine } from "./VerticalLine";

const alwaysRoutes = [
  { href: "/", disabled: false, label: "navigation.home" },
  { href: "/about", disabled: true, label: "navigation.about" },
  { href: "/developers", disabled: true, label: "navigation.developers" },
  {
    label: "navigation.community",
    disabled: true,
    href: "/community",
  },
  {
    label: "navigation.help",
    disabled: true,
    href: "/help",
  },
  {
    label: "navigation.governance",
    disabled: true,
    href: "/governance",
  },
  {
    label: "navigation.docs",
    disabled: true,
    href: "/docs",
  },
];
const connectedRoutes = [
  {
    label: "navigation.connected.favourites",
    disabled: true,
    href: "/favourites",
  },
  { label: "navigation.connected.myNames", disabled: false, href: "/my-names" },
];

const HeaderWrapper = styled(Box)<{ $isHome: boolean }>`
  height: ${vars.space["16"]};
  ${({ $isHome }) =>
    !$isHome &&
    mq.medium.min`
    margin-bottom:  ${vars.space["12"]};
  `}
`;

const LogoAnchor = styled.a`
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  & > svg {
    vertical-align: bottom;
  }

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`;

export const Header = () => {
  const router = useRouter();
  const breakpoints = useBreakpoint();
  const connected = !isReadOnly();
  const { t } = useTranslation("common");

  const dropdownRoutes: typeof alwaysRoutes = [
    alwaysRoutes[0],
    ...(connected ? connectedRoutes : []),
    ...alwaysRoutes.slice(1),
  ];

  return (
    <HeaderWrapper $isHome={router.asPath === "/"} as="header">
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
          {breakpoints.sm && router.asPath === "/" ? (
            <ENSFull height="48" />
          ) : (
            <ENSWithGradient height="48" />
          )}
        </ConditionalWrapper>
        <LanugageDropdown />
        {router.asPath !== "/" && breakpoints.md && (
          <>
            <VerticalLine height="14" />
            <SearchInput size="large" />
          </>
        )}
        <Box flexGrow={1} />
        {breakpoints.lg &&
          dropdownRoutes.slice(0, 3).map((route) => (
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
            ? dropdownRoutes
            : dropdownRoutes.slice(3)
          ).map((route) => ({ ...route, label: t(route.label) }))}
        />
        <HeaderConnect />
      </Stack>
    </HeaderWrapper>
  );
};
