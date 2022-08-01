export const getSocialData = (iconKey: string, value: string) => {
  switch (iconKey) {
    case 'com.twitter':
      return {
        icon: 'twitter',
        color: '#65C5FC',
        label: 'Twitter',
        value: `@${value.replace(/^@/, '')}`,
        type: 'link',
        urlFormatter: `https://twitter.com/${value.replace(/^@/, '')}`,
      }
    case 'com.github':
      return {
        icon: 'github',
        color: '#000000',
        label: 'GitHub',
        value,
        type: 'link',
        urlFormatter: `https://github.com/${value}`,
      }
    case 'com.discord':
      return {
        icon: 'discord',
        color: '#5A57DD',
        label: 'Discord',
        value,
        type: 'copy',
      }
    default:
      return null
  }
}
