import SocialDiscord from "./SocialDiscord.svg";
import SocialDiscourse from "./SocialDiscourseColour.svg";
import SocialGithub from "./SocialGithub.svg";
import SocialMedium from "./SocialMedium.svg";
import SocialTwitter from "./SocialTwitter.svg";
import SocialYoutube from "./SocialYoutube.svg";

export const socialIconTypes = {
  discord: SocialDiscord,
  discourse: SocialDiscourse,
  github: SocialGithub,
  medium: SocialMedium,
  twitter: SocialTwitter,
  youtube: SocialYoutube,
};

export const DynamicSocialIcon = ({
  name,
  ...props
}: {
  name: keyof typeof socialIconTypes;
}) => {
  const Icon = socialIconTypes[name];
  return <Icon {...props} />;
};
