import { ComponentProps } from 'react'
import { WrapName } from './WrapName'
import { FriendlyResolverUpgrade } from './FriendlyResolverUpgrade'

export const intros = {
  WrapName,
  FriendlyResolverUpgrade,
}

export type IntroComponent = typeof intros
export type IntroComponentName = keyof IntroComponent

export const makeIntroItem = <I extends IntroComponentName>(
  name: I,
  data: ComponentProps<IntroComponent[I]>,
) => ({
  name,
  data,
})
