import {
  Box,
  Button,
  IconEthTransparentInverted,
  Stack,
  vars,
} from "@ensdomains/thorin";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import ENSFull from "../assets/ENSFull.svg";
import { HamburgerMenu } from "./HamburgerMenu";
import { LanugageDropdown } from "./LanguageDropdown";
import { StyledNavLink } from "./StyledNavLink";

const StyledIconEthTransparentInverted = styled(IconEthTransparentInverted)`
  margin-right: calc(${vars.space["2"]} * -1);
  margin-left: calc(${vars.space["2"]} * -1);
`;

export const Header = () => {
  const { t } = useTranslation("common");

  return (
    <Box as="header">
      <Stack direction="horizontal" justify="center" align="center" space="6">
        <ENSFull height="48" />
        <LanugageDropdown />
        <Box flexGrow={1} />
        <StyledNavLink href="/">{t("navigation.home")}</StyledNavLink>
        <StyledNavLink href="/about">{t("navigation.about")}</StyledNavLink>
        <StyledNavLink href="/developers">
          {t("navigation.developers")}
        </StyledNavLink>
        <HamburgerMenu
          dropdownItems={[
            {
              label: t("navigation.community"),
              href: "/community",
            },
            {
              label: t("navigation.help"),
              href: "/help",
            },
            {
              label: t("navigation.governance"),
              href: "/governance",
            },
            {
              label: t("navigation.docs"),
              href: "/docs",
            },
            {
              label: t("navigation.bugBounty"),
              href: "/bug-bounty",
            },
            {
              label: t("navigation.mediaKit"),
              href: "/media-kit",
            },
          ]}
        />
        <Button
          prefix={<StyledIconEthTransparentInverted size="6" />}
          variant="action"
          size="medium"
        >
          Connect
        </Button>
      </Stack>
    </Box>
  );
};
