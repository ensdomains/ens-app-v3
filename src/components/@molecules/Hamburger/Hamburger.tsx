import { forwardRef, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import {
  Box,
  BoxProps,
  CrossSVG,
  DynamicPopover,
  MenuSVG,
  Modal,
  Spinner,
} from '@ensdomains/thorin'
import { PopoverProps } from '@ensdomains/thorin/dist/types/components/atoms/DynamicPopover'

import { useInitial } from '@app/hooks/useInitial'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useGraphOutOfSync } from '@app/utils/SyncProvider/SyncProvider'

import LanguageMenu from './LanguageMenu'
import MainMenu from './MainMenu'
import { slideContainer } from './styles.css'

const Button = forwardRef<HTMLElement, BoxProps & { $active: boolean }>(
  ({ $active, ...props }, ref) => {
    return (
      <Box
        {...props}
        as="button"
        ref={ref}
        position="relative"
        padding="$2"
        flex="0 0 auto"
        wh="$8"
        borderRadius="$full"
        transition="all 0.15s ease-in-out"
        cursor="pointer"
        color={$active ? '$textPrimary' : '$grey'}
        backgroundColor={{ base: $active ? '$greyLight' : 'transparent', hover: '$greyLight' }}
      />
    )
  },
)

const StyledSpinner = () => (
  <Box position="absolute" wh="$9" color="$accent" top="-0.125rem" left="-0.125rem">
    <Box as={<Spinner />} wh="$9" strokeWidth="$0.5" />
  </Box>
)

const MobileCard = forwardRef<HTMLElement, BoxProps>((props, ref) => (
  <Box
    {...props}
    width="$full"
    ref={ref}
    display="flex"
    flexDirection="column"
    overflow="hidden"
    position="relative"
    borderRadius="$2xLarge"
    backgroundColor="$background"
    transition="all 0.2s ease-out"
    borderTopLeftRadius="$0"
    borderTopRightRadius="$0"
  />
))

const CloseButton = (props: BoxProps) => (
  <Box
    {...props}
    borderRadius="$full"
    backgroundColor="$background"
    position="absolute"
    bottom="$-4"
    left="50%"
    transform="translate(-50%, 100%)"
    display="flex"
    alignItems="center"
    justifyContent="center"
    padding="$2"
  >
    <Box as={<CrossSVG />} display="block" wh="$4" />
  </Box>
)

const DesktopDropdownCard = forwardRef<HTMLElement, BoxProps & PopoverProps>(
  ({ mobilePlacement: _mp, placement: _p, ...props }, ref) => (
    <Box
      {...props}
      ref={ref}
      overflow="hidden"
      position="relative"
      borderRadius="$2xLarge"
      backgroundColor="$background"
      transition="all 0.2s ease-out"
      borderWidth="$1x"
      borderStyle="solid"
      borderColor="$border"
    />
  ),
)

const SlideContainer = forwardRef<HTMLElement, BoxProps & { $direction: 'backwards' | 'forwards' }>(
  ({ $direction, ...props }, ref) => (
    <Box
      {...props}
      ref={ref}
      className={slideContainer[$direction]}
      position="absolute"
      wh="$full"
      zIndex="1"
      backgroundColor="$background"
    />
  ),
)

type View = 'main' | 'language'

const Hamburger = () => {
  const breakpoints = useBreakpoint()

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
          component: <MainMenu {...{ setCurrentView }} />,
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
      <MenuSVG />
      {graphOutOfSync ? <StyledSpinner /> : null}
    </Button>
  )

  if (isInitial) return null

  const currentComponent = {
    main: <MainMenu {...{ setCurrentView }} />,
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
          mobilePlacement="bottom"
          width="320px"
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
          <CloseButton onClick={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  )
}

export default Hamburger
