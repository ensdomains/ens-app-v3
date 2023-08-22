import { formatRecord } from 'ens-tools/dist/format'

export const getSocialData = (iconKey: string, value: string) => {
  const formatted = formatRecord(iconKey as any, value) || value

  switch (iconKey) {
    case 'twitter':
    case 'com.twitter':
      return {
        icon: 'com.twitter',
        color: '#65C5FC',
        label: 'Twitter',
        value: formatted,
        type: 'link',
        urlFormatter: `https://twitter.com/${formatted}`,
      }
    case 'github':
    case 'com.github':
      return {
        icon: 'com.github',
        color: '#000000',
        label: 'GitHub',
        value: formatted,
        type: 'link',
        urlFormatter: `https://github.com/${formatted}`,
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
    case 'telegram':
    case 'org.telegram':
      return {
        icon: 'org.telegram',
        color: '#2BABEE',
        label: 'Telegram',
        value: formatted,
        type: 'link',
        urlFormatter: `https://t.me/${formatted.replace(/^@/, '')}`,
      }
    case 'email':
      return {
        icon: 'email',
        color: '#000000',
        label: 'Email',
        value: formatted,
        type: 'link',
        urlFormatter: `mailto:${formatted}`,
      }
    default:
      return null
  }
}
