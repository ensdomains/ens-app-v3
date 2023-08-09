import { DateTime } from 'luxon'

export const getSocialData = (iconKey: string, value: string) => {
  switch (iconKey) {
    case 'twitter':
    case 'com.twitter':
      return {
        icon: 'com.twitter',
        color: '#65C5FC',
        label: 'Twitter',
        value: `@${value.replace(/^@/, '')}`,
        type: 'link',
        urlFormatter: `https://twitter.com/${value.replace(/^@/, '')}`,
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
    case 'timezone':
      return {
        icon: 'timezone',
        color: '#2BABEE',
        label: 'Timezone',
        value: (() => {
          try {
            const zone = DateTime.now().setZone(value)
            const now = DateTime.now().toLocal()

            // Number of minutes between now and the target zone
            const minutes = zone.offset - now.offset
            const absoluteMinutes = Math.abs(minutes)

            // To hour offset, 120 minutes = "+2:00", 90 minutes = "+1:30" including leading zeroes
            const offset = `${minutes < 0 ? '-' : '+'}${Math.floor(absoluteMinutes / 60)
              .toString()
              .padStart(2, '0')}:${Math.abs(absoluteMinutes % 60)
              .toString()
              .padStart(2, '0')}`

            return `${value} (${offset})`
          } catch {
            // If unable to parse offset simply return the user-set value
            return value
          }
        })(),
      }
    default:
      return null
  }
}
