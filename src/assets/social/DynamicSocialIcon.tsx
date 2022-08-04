import dynamic from 'next/dynamic'

export const socialIconTypes = {
  discord: dynamic(() => import('./SocialDiscord.svg')),
  discourse: dynamic(() => import('./SocialDiscourseColour.svg')),
  github: dynamic(() => import('./SocialGithub.svg')),
  medium: dynamic(() => import('./SocialMedium.svg')),
  twitter: dynamic(() => import('./SocialTwitter.svg')),
  youtube: dynamic(() => import('./SocialYoutube.svg')),
}

export const DynamicSocialIcon = ({ name, ...props }: { name: keyof typeof socialIconTypes; fill?: string }) => {
  const Icon = socialIconTypes[name] as any
  return <Icon {...props} />
}
