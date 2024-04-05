/* eslint-disable @typescript-eslint/naming-convention */
import dynamic from 'next/dynamic'

import { QuestionCircleSVG } from '@ensdomains/thorin'

export const socialIconTypes = {
  email: dynamic(() => import('@ensdomains/thorin').then((m) => m.EnvelopeSVG)),
  'com.discord': dynamic(() => import('./SocialDiscord.svg')),
  'com.discourse': dynamic(() => import('./SocialDiscourseColour.svg')),
  'com.github': dynamic(() => import('./SocialGithub.svg')),
  'com.medium': dynamic(() => import('./SocialMedium.svg')),
  'com.twitter': dynamic(() => import('./SocialX.svg')),
  'com.youtube': dynamic(() => import('./SocialYoutube.svg')),
  'eth.farcaster': dynamic(() => import('./SocialFarcaster.svg')),
  'org.telegram': dynamic(() => import('./SocialTelegram.svg')),
  'xyz.mirror': dynamic(() => import('./SocialMirrorColour.svg')),
}

export const socialIconColors = {
  email: '#000000',
  'com.discord': '#5A57DD',
  'com.discourse': undefined,
  'com.github': '#000000',
  'com.medium': '#000000',
  'com.twitter': '#000000',
  'com.youtube': '#FF0000',
  'eth.farcaster': '#8A63D2',
  'org.telegram': '#2BABEE',
  'xyz.mirror': undefined,
}

export const DynamicSocialIcon = ({
  name,
  showDefault = true,
  ...props
}: {
  name: keyof typeof socialIconTypes | string
  showDefault?: boolean
  fill?: string
}) => {
  if (name in socialIconTypes) {
    const key = name as keyof typeof socialIconTypes
    const Icon = socialIconTypes[key] as any
    const fill = socialIconColors[key]
    return <Icon {...props} fill={fill} />
  }
  if (showDefault) {
    return <QuestionCircleSVG {...props} />
  }
  return null
}
