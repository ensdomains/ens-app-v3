export const getSocialData = (iconKey: string, value: string) => {
  switch (iconKey) {
    case 'email':
      return {
        icon: 'email',
        color: '#000000',
        label: 'Email',
        value,
        type: 'copy',
      }
    case 'discord':
    case 'com.discord':
      return {
        icon: 'com.discord',
        color: '#5A57DD',
        label: 'Discord',
        value,
        type: 'copy',
      }
    case 'github':
    case 'com.github':
      return {
        icon: 'com.github',
        color: '#000000',
        label: 'GitHub',
        value,
        type: 'link',
        urlFormatter: `https://github.com/${value}`,
      }
    case 'twitter':
    case 'com.x':
    case 'com.twitter': {
      const formattedValue = value.replace(/^@/, '')
      return {
        icon: 'com.twitter',
        color: '#000000',
        label: 'X',
        value: `@${formattedValue}`,
        type: 'link',
        urlFormatter: `https://x.com/${formattedValue}`,
      }
    }
    case 'eth.farcaster': {
      const formattedValue = value.toLowerCase()
      return {
        icon: 'eth.farcaster',
        color: '#8A63D2',
        label: 'Farcaster',
        value: formattedValue,
        type: 'link',
        urlFormatter: `https://warpcast.com/${formattedValue}`,
      }
    }
    case 'telegram':
    case 'org.telegram':
      return {
        icon: 'org.telegram',
        color: '#2BABEE',
        label: 'Telegram',
        value,
        type: 'link',
        urlFormatter: `https://t.me/${value}`,
      }
    default:
      return null
  }
}
