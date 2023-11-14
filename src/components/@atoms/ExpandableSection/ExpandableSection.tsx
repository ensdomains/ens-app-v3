import { PropsWithChildren, useRef, useState } from 'react'
import { useTransition } from 'react-transition-state'

import { Box, BoxProps, cssVars } from '@ensdomains/thorin'
import { DownChevronSVG, Typography } from '@ensdomains/thorin2'

import { getValueForTransitionState, State } from './getValueForTransitionState'

const Body = ({ $state, $height, ...props }: { $state: State; $height: number } & BoxProps) => (
  <Box
    {...props}
    overflow="hidden"
    width="$full"
    px="$4"
    transition="all 0.5s ease-in-out"
    boxSizing="border-box"
    visibility={getValueForTransitionState($state, 'visibility')}
    opacity={getValueForTransitionState($state, 'opacity')}
    height={getValueForTransitionState($state, 'heightFunc')($height)}
  />
)

type Props = {
  title: string
}

export const ExpandableSection = ({ title, children }: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLDivElement>(null)

  const [height, setHeight] = useState(0)
  const [state, toggle] = useTransition({
    timeout: 300,
    preEnter: true,
    preExit: true,
    onChange: ({ state: _state }) => {
      if (_state === 'preEnter' || _state === 'preExit') {
        const _heigth = ref.current?.getBoundingClientRect().height || 0
        setHeight(_heigth)
      }
    },
  })

  const open = ['entered', 'entering', 'preEnter'].includes(state)

  return (
    <Box width="$full" border={`1px solid ${cssVars.color.border}`} borderRadius="$large">
      <Box
        as="button"
        type="button"
        onClick={() => toggle()}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="$4"
        width="$full"
      >
        <Typography>{title}</Typography>
        <Box
          as={<DownChevronSVG />}
          display="flex"
          color={open ? '$text' : '$grey'}
          transition="all 0.3s ease-in-out"
          transform={open ? 'rotate(180deg)' : 'rotate(0deg)'}
        />
      </Box>
      <Body $state={state as State} $height={height}>
        <Box ref={ref} py="$4" borderTop={`1px solid ${cssVars.color.border}`}>
          {children}
        </Box>
      </Body>
    </Box>
  )
}
