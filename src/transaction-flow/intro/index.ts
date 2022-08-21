import { ComponentProps } from 'react'
import { ChangePrimaryName } from './ChangePrimaryName'
import { WrapName } from './WrapName'
import { FriendlyResolverUpgrade } from './FriendlyResolverUpgrade'

export const intros = {
  WrapName,
  FriendlyResolverUpgrade,
  ChangePrimaryName,
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
