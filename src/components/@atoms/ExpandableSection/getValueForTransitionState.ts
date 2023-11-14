import { TransitionState } from 'react-transition-state'

import { BoxProps } from '@ensdomains/thorin'

export type State = Exclude<TransitionState, 'unmounted'>

type Fields = {
  visibility: BoxProps['visibility']
  opacity: BoxProps['opacity']
  heightFunc: (height: number) => BoxProps['height']
}

const values: { [key in State]: Fields } = {
  preEnter: {
    visibility: 'visible',
    opacity: 0,
    heightFunc: () => '0px',
  },
  entering: {
    visibility: 'visible',
    opacity: 1,
    heightFunc: (height: number) => `${height}px`,
  },
  entered: {
    visibility: 'visible',
    opacity: 1,
    heightFunc: () => 'initial',
  },
  preExit: {
    visibility: 'visible',
    opacity: 1,
    heightFunc: (height: number) => `${height}px`,
  },
  exiting: {
    visibility: 'visible',
    opacity: 0,
    heightFunc: () => '0px',
  },
  exited: {
    visibility: 'hidden',
    opacity: 0,
    heightFunc: () => `0px`,
  },
} as const

export const getValueForTransitionState = <S extends State, F extends keyof Fields>(
  state: S,
  field: F,
): (typeof values)[S][F] => {
  return values[state][field]
}
