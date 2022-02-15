import { useBreakpoint } from "@app/utils/BreakpointProvider";
import { Box, Stack, vars } from "@ensdomains/thorin";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import ENSFull from "../assets/ENSFull.svg";
import ENSWithGradient from "../assets/ENSWithGradient.svg";
import { HamburgerMenu } from "./HamburgerMenu";
import { HeaderConnect } from "./HeaderConnect";
import { LanugageDropdown } from "./LanguageDropdown";
import { StyledNavLink } from "./StyledNavLink";

const AlwaysShownRoutes = [
  { href: "/", label: "navigation.home" },
  { href: "/about", label: "navigation.about" },
  { href: "/developers", label: "navigation.developers" },
];

const DropdownRoutes = [
  {
    label: "navigation.community",
    href: "/community",
  },
  {
    label: "navigation.help",
    href: "/help",
  },
  {
    label: "navigation.governance",
    href: "/governance",
  },
  {
    label: "navigation.docs",
    href: "/docs",
  },
];

const HeaderWrapper = styled(Box)`
  height: ${vars.space["16"]};
`;

export const Header = () => {
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
        {breakpoints.sm ? (
          <ENSFull height="48" />
        ) : (
          <ENSWithGradient height="48" />
        )}
        <LanugageDropdown />
        <Box flexGrow={1} />
        {breakpoints.lg && (
          <>
            <StyledNavLink href="/">{t("navigation.home")}</StyledNavLink>
            <StyledNavLink href="/about">{t("navigation.about")}</StyledNavLink>
            <StyledNavLink href="/developers">
              {t("navigation.developers")}
            </StyledNavLink>
          </>
        )}
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
