import { parseSimplexUrls } from './parseSimplexUrls'
import { normaliseTwitterRecordValue } from './records/normaliseTwitterRecordValue'

export const getSocialData = (iconKey: string, value: string) => {
  switch (iconKey) {
    case 'simplex.contact':
      return {
        icon: 'simplex.contact',
        color: '#0080BC',
        label: 'SimpleX contact',
        value: 'SimpleX contact',
        type: 'link',
        urlFormatter: parseSimplexUrls(value)[0] ?? value,
        urls: parseSimplexUrls(value),
      }
    case 'simplex.channel':
      return {
        icon: 'simplex.channel',
        color: '#0080BC',
        label: 'SimpleX channel',
        value: 'SimpleX channel',
        type: 'link',
        urlFormatter: parseSimplexUrls(value)[0] ?? value,
        urls: parseSimplexUrls(value),
      }
    case 'twitter':
    case 'com.twitter':
    case 'x':
    case 'com.x':
      return {
        icon: 'com.twitter',
        color: '#000000',
        label: 'X',
        value: normaliseTwitterRecordValue(value),
        type: 'link',
        urlFormatter: `https://x.com/${value.replace(/^@/, '')}`,
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
        value,
        type: 'link',
        urlFormatter: `https://t.me/${value}`,
      }
    case 'email':
      return {
        icon: 'email',
        color: '#000000',
        label: 'Email',
        value,
        type: 'copy',
      }
    default:
      return null
  }
}
