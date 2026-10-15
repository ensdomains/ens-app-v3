import { getCustomAccountData } from '@app/constants/customAccountRecordKeys'

import { normaliseTwitterRecordValue } from './records/normaliseTwitterRecordValue'

type SocialDataConfig = {
  icon: string
  color: string
  label: string
  type: 'link' | 'copy'
  getValue?: (value: string) => string
  getUrl?: (value: string) => string
}

// Define base configurations
const twitterConfig: SocialDataConfig = {
  icon: 'com.twitter',
  color: '#000000',
  label: 'X',
  type: 'link',
  getValue: normaliseTwitterRecordValue,
  getUrl: (value) => `https://x.com/${value.replace(/^@/, '')}`,
}

const githubConfig: SocialDataConfig = {
  icon: 'com.github',
  color: '#000000',
  label: 'GitHub',
  type: 'link',
  getUrl: (value) => `https://github.com/${value}`,
}

const discordConfig: SocialDataConfig = {
  icon: 'com.discord',
  color: '#5A57DD',
  label: 'Discord',
  type: 'copy',
}

const telegramConfig: SocialDataConfig = {
  icon: 'org.telegram',
  color: '#2BABEE',
  label: 'Telegram',
  type: 'link',
  getUrl: (value) => `https://t.me/${value}`,
}

/* eslint-disable @typescript-eslint/naming-convention */
const socialDataMap: Record<string, SocialDataConfig> = {
  // Twitter/X aliases
  twitter: twitterConfig,
  'com.twitter': twitterConfig,
  x: twitterConfig,
  'com.x': twitterConfig,

  // GitHub aliases
  github: githubConfig,
  'com.github': githubConfig,

  // Discord aliases
  discord: discordConfig,
  'com.discord': discordConfig,

  // Telegram aliases
  telegram: telegramConfig,
  'org.telegram': telegramConfig,

  // Email
  email: {
    icon: 'email',
    color: '#000000',
    label: 'Email',
    type: 'copy',
  },
}
/* eslint-enable @typescript-eslint/naming-convention */

export function getSocialData(iconKey: string, value: string) {
  // Check custom account records first
  const customData = getCustomAccountData(iconKey, value)
  if (customData) return customData

  // Then check standard social records
  const config = socialDataMap[iconKey]
  if (!config) return null

  return {
    icon: config.icon,
    color: config.color,
    label: config.label,
    value: config.getValue?.(value) ?? value,
    type: config.type,
    urlFormatter: config.getUrl?.(value),
  }
}
