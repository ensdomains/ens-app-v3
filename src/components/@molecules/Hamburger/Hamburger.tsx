import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { CrossSVG, DynamicPopover, MenuSVG, Modal } from '@ensdomains/thorin'

import { useInitial } from '@app/hooks/useInitial'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import LanguageMenu from './LanguageMenu'
import MainMenu from './MainMenu'

const Button = styled.button<{ $active: boolean }>(
  ({ theme, $active }) => css`
    padding: ${theme.space['2']};
    border-radius: ${theme.radii.full};

    transition: all 0.15s ease-in-out;

    cursor: pointer;
    color: ${theme.colors.grey};

    & > svg {
      display: block;
      width: ${theme.space['4']};
      height: ${theme.space['4']};
    }

    &:hover {
      background-color: ${theme.colors.greyLight};
    }

    ${$active &&
    css`
      background-color: ${theme.colors.greyLight};
      color: ${theme.colors.textPrimary};
    `}
  `,
)

const MobileCard = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;

    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.background};

    transition: all 0.2s ease-out;

    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `,
)

const CloseButton = styled.button(
  ({ theme }) => css`
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.background};

    position: absolute;
    bottom: -${theme.space['4']};
    left: 50%;
    transform: translate(-50%, 100%);

    display: flex;
    align-items: center;
    justify-content: center;

    padding: ${theme.space['2']};

    svg {
      display: block;
      width: ${theme.space['4']};
      height: ${theme.space['4']};
    }
  `,
)

const DesktopDropdownCard = styled.div(
  ({ theme }) => css`
    overflow: hidden;
    position: relative;
    background-color: ${theme.colors.background};
    border-radius: ${theme.radii['2xLarge']};
    border: 1px solid ${theme.colors.border};
    transition: all 0.2s ease-out;
  `,
)

const backwardsSlide = keyframes`
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(100%);
  }
`

const SlideContainer = styled.div<{ $direction: 'backwards' | 'forwards' }>(
  ({ theme, $direction }) => css`
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: ${theme.colors.background};
    position: absolute;
    animation: ${backwardsSlide} 0.2s ease-in-out
      ${$direction === 'backwards' ? 'forwards' : 'reverse'};
  `,
)

type View = 'main' | 'language'

const Hamburger = () => {
  const breakpoints = useBreakpoint()

  const containerRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const isInitial = useInitial()

  const defaultHeight = useRef<number>(464)

  const [height, setHeight] = useState(defaultHeight.current)
  const [animation, setAnimation] = useState<{
    component: ReactNode
    direction: 'backwards' | 'forwards'
  } | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, _setCurrentView] = useState<View>('main')

  const setCurrentView = useCallback((view: View) => {
    _setCurrentView((prev) => {
      if (prev === view) return prev
      if (view === 'main') {
        setAnimation({
          component: <LanguageMenu setCurrentView={setCurrentView} />,
          direction: 'backwards',
        })
      } else {
        setAnimation({
          component: <MainMenu setCurrentView={setCurrentView} />,
          direction: 'forwards',
        })
      }
      return view
    })
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setCurrentView('main')
    }
  }, [isOpen, setCurrentView])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !containerRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node) &&
        (e.target as Node).isConnected
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      window.addEventListener('click', handleClick)
    } else {
      window.removeEventListener('click', handleClick)
    }

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [isOpen])

  useEffect(() => {
    if (!animation) return
    if (animation.direction === 'backwards') {
      setHeight(defaultHeight.current)
    } else {
      setHeight(
        slideRef.current?.children[0].getBoundingClientRect().height ?? defaultHeight.current,
      )
    }
    const timeout = setTimeout(() => {
      setAnimation(null)
    }, 200)
    return () => clearTimeout(timeout)
  }, [animation])

  useEffect(() => {
    const initialHeight = defaultHeight.current
    if (breakpoints.md) {
      defaultHeight.current = 427
    } else {
      defaultHeight.current = 464
    }
    setHeight((prev) => {
      if (prev === initialHeight && initialHeight !== defaultHeight.current) {
        return defaultHeight.current
      }
      return prev
    })
  }, [breakpoints.md])

  const currentComponent = {
    main: <MainMenu setCurrentView={setCurrentView} />,
    language: <LanguageMenu setCurrentView={setCurrentView} />,
  }[currentView]

  const componentWithAnimation = (
    <>
      {animation && (
        <SlideContainer ref={slideRef} $direction={animation.direction}>
          {animation.direction === 'forwards' ? currentComponent : animation.component}
        </SlideContainer>
      )}
      {animation?.direction === 'forwards' ? animation.component : currentComponent}
    </>
  )

  return (
    <>
      <Button ref={btnRef} $active={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
        <MenuSVG />
      </Button>
      {!isInitial && breakpoints.md ? (
        <DynamicPopover
          isOpen={isOpen}
          anchorRef={btnRef}
          popover={
            <DesktopDropdownCard ref={containerRef} style={{ height }}>
              {componentWithAnimation}
            </DesktopDropdownCard>
          }
          placement="bottom"
          width={320}
          transitionDuration={150}
          align="end"
        />
      ) : (
        <Modal open={isOpen} onDismiss={() => setIsOpen(false)} alignTop>
          <MobileCard ref={containerRef} style={{ height }}>
            {componentWithAnimation}
          </MobileCard>
          <CloseButton onClick={() => setIsOpen(false)}>
            <CrossSVG />
          </CloseButton>
        </Modal>
      )}
    </>
  )
}

export default Hamburger
