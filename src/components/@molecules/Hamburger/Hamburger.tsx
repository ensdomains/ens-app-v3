import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { DynamicPopover, MenuSVG } from '@ensdomains/thorin'

import { useInitial } from '@app/hooks/useInitial'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const isInitial = useInitial()

  const [height, setHeight] = useState(435)
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
      setHeight(435)
    } else {
      setHeight(slideRef.current?.children[0].getBoundingClientRect().height ?? 435)
    }
    const timeout = setTimeout(() => {
      setAnimation(null)
    }, 200)
    return () => clearTimeout(timeout)
  }, [animation])

  const currentComponent = {
    main: <MainMenu setCurrentView={setCurrentView} />,
    language: <LanguageMenu setCurrentView={setCurrentView} />,
  }[currentView]

  return (
    <>
      <Button ref={btnRef} $active={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
        <MenuSVG />
      </Button>
      {!isInitial && (
        <DynamicPopover
          isOpen={isOpen}
          anchorRef={btnRef}
          popover={
            <DesktopDropdownCard ref={containerRef} style={{ height }}>
              {animation && (
                <SlideContainer ref={slideRef} $direction={animation.direction}>
                  {animation.direction === 'forwards' ? currentComponent : animation.component}
                </SlideContainer>
              )}
              {animation?.direction === 'forwards' ? animation.component : currentComponent}
            </DesktopDropdownCard>
          }
          placement="bottom"
          width={320}
          transitionDuration={150}
          align="end"
        />
      )}
    </>
  )
}

export default Hamburger
