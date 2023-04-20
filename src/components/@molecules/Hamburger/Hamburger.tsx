import { useRouter } from 'next/router'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { CrossSVG, Dialog, DynamicPopover, MenuSVG, Modal, Spinner, mq } from '@ensdomains/thorin'

import { useInitial } from '@app/hooks/useInitial'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useGraphOutOfSync } from '@app/utils/SyncProvider'

import LanguageMenu from './LanguageMenu'
import MainMenu from './MainMenu'

const Button = styled.button<{ $active: boolean }>(
  ({ theme, $active }) => css`
    position: relative;
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

const StyledSpinner = styled(Spinner)(
  ({ theme }) => css`
    position: absolute;
    height: ${theme.space['9']};
    width: ${theme.space['9']};
    top: -${theme.space['0.5']};
    left: -${theme.space['0.5']};
    stroke-width: ${theme.space['0.5']};
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

const StyledDialog = styled(Dialog)(
  ({ theme }) => css`
    z-index: 10001;
    height: 70vh;

    & > div {
      padding: 0;
      gap: 0;
    }

    & > div > div {
      gap: 0;
    }

    ${mq.sm.min(css`
      width: calc(80vw - 2 * ${theme.space['6']});
      max-width: ${theme.space['128']};
      height: 60vh;
    `)}
  `,
)

type View = 'main' | 'language'

const Hamburger = () => {
  const breakpoints = useBreakpoint()
  const [hasFeedbackForm, setHasFeedbackForm] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const isInitial = useInitial()

  const graphOutOfSync = useGraphOutOfSync()

  const [height, setHeight] = useState<number | null>(null)
  const [animation, setAnimation] = useState<{
    component: ReactNode
    direction: 'backwards' | 'forwards'
  } | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, _setCurrentView] = useState<View>('main')
  const router = useRouter()

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
          component: <MainMenu {...{ setCurrentView, setIsOpen, setHasFeedbackForm }} />,
          direction: 'forwards',
        })
      }
      return view
    })
  }, [])

  // set the view back to main when the menu is closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('main')
    }
  }, [isOpen, setCurrentView])

  // close the menu when the user clicks outside of the menu
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

  // set the height of the menu based on the finished animation view
  useEffect(() => {
    if (!animation) return
    if (animation.direction === 'backwards') {
      setHeight(containerRef.current?.children[1].getBoundingClientRect().height ?? null)
    } else {
      setHeight(slideRef.current?.children[0].getBoundingClientRect().height ?? null)
    }
    const timeout = setTimeout(() => {
      setAnimation(null)
    }, 200)
    return () => clearTimeout(timeout)
  }, [animation])

  const renderCallback = useCallback(() => {
    const el = containerRef.current!
    const getChildHeight = (n: number) => el.children[n]?.getBoundingClientRect().height
    const child0Height = getChildHeight(0)
    if (child0Height === 0) setHeight(getChildHeight(1))
    else setHeight(child0Height)
  }, [])

  const button = (
    <Button ref={btnRef} $active={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
      {graphOutOfSync && <StyledSpinner color="accent" />}
      <MenuSVG />
    </Button>
  )

  if (isInitial) return button

  const currentComponent = {
    main: <MainMenu {...{ setCurrentView, setIsOpen, hasFeedbackForm, setHasFeedbackForm }} />,
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
      <StyledDialog
        open={hasFeedbackForm}
        variant="actionable"
        onDismiss={() => setHasFeedbackForm(false)}
      >
        <iframe
          title="Feedback"
          width="100%"
          height="100%"
          style={{ borderRadius: 25 }}
          src={`https://docs.google.com/forms/d/e/1FAIpQLSfAVFlV7LC2oCEBtZEK0uKpAU32-eYyY307Ji07wyGSFaZU8Q/viewform?usp=pp_url&entry.435573398=${router.asPath}`}
        />
      </StyledDialog>
      {button}
      {breakpoints.sm ? (
        <DynamicPopover
          isOpen={isOpen}
          anchorRef={btnRef}
          popover={
            <DesktopDropdownCard ref={containerRef} style={{ height: height || undefined }}>
              {componentWithAnimation}
            </DesktopDropdownCard>
          }
          onShowCallback={renderCallback}
          placement="bottom"
          width={320}
          transitionDuration={150}
          align="end"
        />
      ) : (
        <Modal
          renderCallback={renderCallback}
          open={isOpen}
          onDismiss={() => setIsOpen(false)}
          alignTop
        >
          <MobileCard ref={containerRef} style={{ height: height || undefined }}>
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
