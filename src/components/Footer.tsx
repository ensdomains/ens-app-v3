import { Box, Stack } from "@ensdomains/thorin";
import { useTranslation } from "next-i18next";
import SocialDiscord from "../assets/social/SocialDiscord.svg";
import SocialDiscourse from "../assets/social/SocialDiscourse.svg";
import SocialDiscourseColour from "../assets/social/SocialDiscourseColour.svg";
import SocialGithub from "../assets/social/SocialGithub.svg";
import SocialMedium from "../assets/social/SocialMedium.svg";
import SocialTwitter from "../assets/social/SocialTwitter.svg";
import SocialYoutube from "../assets/social/SocialYoutube.svg";
import { SocialIcon } from "./SocialIcon";
import { StyledNavLink } from "./StyledNavLink";

export const Footer = () => {
  const { t } = useTranslation("common");

  return (
    <Box display="flex" flexDirection="row">
      <Stack direction="horizontal">
        <StyledNavLink href="/bug-bounty">
          {t("navigation.bugBounty")}
        </StyledNavLink>
        <StyledNavLink href="/media-kit">
          {t("navigation.mediaKit")}
        </StyledNavLink>
      </Stack>
      <Box flexGrow={1} />
      <Stack direction="horizontal">
        <SocialIcon Icon={SocialTwitter} color="#5298FF" />
        <SocialIcon Icon={SocialGithub} color="#0F0F0F" />
        <SocialIcon Icon={SocialDiscord} color="#7F83FF" />
        <SocialIcon Icon={SocialMedium} color="#0F0F0F" />
        <SocialIcon
          Icon={SocialDiscourse}
          ColoredIcon={SocialDiscourseColour}
        />
        <SocialIcon Icon={SocialYoutube} color="#EE1919" />
      </Stack>
    </Box>
  );
};
