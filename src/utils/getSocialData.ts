export const getSocialData = (iconKey: string, value: string) => {
  switch (iconKey) {
    case "com.twitter":
      return {
        icon: "twitter",
        color: "#65C5FC",
        value: `@${value}`,
        type: "link",
        urlFormatter: `https://twitter.com/${value}`,
      };
    case "com.github":
      return {
        icon: "github",
        color: "#000000",
        value,
        type: "link",
        urlFormatter: `https://github.com/${value}`,
      };
    case "com.discord":
      return {
        icon: "discord",
        color: "#5A57DD",
        value,
        type: "copy",
      };
    default:
      return null;
  }
};
