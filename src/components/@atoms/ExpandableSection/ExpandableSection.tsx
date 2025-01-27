import { PropsWithChildren, useRef, useState } from 'react'
import { TransitionState, useTransition } from 'react-transition-state'
import styled, { css } from 'styled-components'

import { DownChevronSVG, Typography } from '@ensdomains/thorin'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
  `,
)

const Header = styled.button(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.space['4']};
    width: 100%;
  `,
)

const IconWrapper = styled.div<{ $open: boolean }>(
  ({ theme, $open }) => css`
    display: flex;
    color: ${theme.colors.grey};
    width: ${theme.space['4']};
    height: ${theme.space['4']};
    transition:
      transform 0.3s ease-in-out,
      color 0.3s ease-in-out;

    ${$open &&
    css`
      transform: rotate(180deg);
      color: ${theme.colors.text};
    `}
  `,
)

const Body = styled.div<{ $state: TransitionState; $height: number }>(
  ({ theme, $state, $height }) => css`
    overflow: hidden;
    width: 100%;
    padding: 0 ${theme.space['4']};
    transition:
      opacity 0.5s ease-in-out,
      height 0.5s ease-in-out;
    box-sizing: border-box;

    ${$state === 'exited' &&
    css`
      visibility: hidden;
      height: 0;
      opacity: 0;
    `}
    ${($state === 'preEnter' || $state === 'exiting') &&
    css`
      visibility: visible;
      opacity: 0;
      height: 0;
    `}
    ${($state === 'entering' || $state === 'preExit') &&
    css`
      visibility: visible;
      opacity: 1;
      height: ${$height}px;
    `}
    ${$state === 'entered' &&
    css`
      visibility: visible;
      opacity: 1;
      height: initial;
    `}
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']} 0;
    border-top: 1px solid ${theme.colors.border};
  `,
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
    <Container>
      <Header type="button" onClick={() => toggle()}>
        <Typography>{title}</Typography>
        <IconWrapper $open={open}>
          <DownChevronSVG />
        </IconWrapper>
      </Header>
      <Body $state={state} $height={height}>
        <Content ref={ref}>{children}</Content>
      </Body>
    </Container>
  )
}
