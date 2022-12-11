/* eslint-disable @typescript-eslint/naming-convention */
import dynamic from 'next/dynamic'

export const socialIconTypes = {
  'com.discord': dynamic(() => import('./SocialDiscord.svg')),
  'com.discourse': dynamic(() => import('./SocialDiscourseColour.svg')),
  'com.github': dynamic(() => import('./SocialGithub.svg')),
  'com.medium': dynamic(() => import('./SocialMedium.svg')),
  'com.twitter': dynamic(() => import('./SocialTwitter.svg')),
  'com.youtube': dynamic(() => import('./SocialYoutube.svg')),
}

export const socialIconColors = {
  'com.discord': '#5A57DD',
  'com.discourse': undefined,
  'com.github': '#000000',
  'com.medium': '#000000',
  'com.twitter': '#65C5FC',
  'com.youtube': '#FF0000',
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
    const Icon = dynamic(() => import('../Question.svg')) as any
    return <Icon {...props} />
  }
  return null
}
