import { useEffect } from 'react'
import styled from 'styled-components'

import { Button, Modal } from '@ensdomains/thorin'

import { useModalState } from '@app/hooks/useModalState'

// Define media queries manually
const mq = {
  xs: {
    max: (theme: any) => `@media (max-width: ${theme.breakpoints.sm}px)`,
  },
  sm: {
    min: (theme: any) => `@media (min-width: ${theme.breakpoints.sm}px)`,
  },
}

const ModalContainer = styled.div(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 300px;
    gap: ${theme.space['4']};
  `,
)

const ModalContent = styled.div(
  ({ theme }) => `
    flex: 1;
    overflow-y: auto;
    padding: ${theme.space['2']};
  `,
)

const ModalFooter = styled.div(
  ({ theme }) => `
    display: flex;
    justify-content: space-between;
    padding: ${theme.space['4']};
    
    ${mq.sm.min(theme)} {
      flex-direction: row;
    }
    
    ${mq.xs.max(theme)} {
      flex-direction: column;
      gap: ${theme.space['2']};
    }
  `,
)

export type ScreenProps = {
  onNext?: (data?: any) => void
  onBack?: () => void
}

export type ScreenComponent = React.ComponentType<ScreenProps>

export type ScreenConfig = {
  id: string
  component: ScreenComponent
  data?: any
}

type MultiScreenModalProps = {
  screens: ScreenConfig[]
  isOpen?: boolean
  onClose?: () => void
  onComplete?: (data: any[]) => void
  initialScreen?: string
}

export const MultiScreenModal = ({
  screens,
  isOpen: externalIsOpen,
  onClose,
  onComplete,
  initialScreen,
}: MultiScreenModalProps) => {
  const {
    isOpen,
    openModal,
    closeModal,
    nextScreen,
    previousScreen,
    currentScreen,
    screenStack,
    resetScreens,
  } = useModalState()

  // Handle external open/close control
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      if (externalIsOpen && !isOpen) {
        // Find initial screen if provided
        const initialScreenObj = initialScreen
          ? screens.find((screen) => screen.id === initialScreen)
          : screens[0]

        if (initialScreenObj) {
          openModal({
            id: initialScreenObj.id,
            data: initialScreenObj.data,
          })
        }
      } else if (!externalIsOpen && isOpen) {
        closeModal()
      }
    }
  }, [externalIsOpen, isOpen])

  // Find the current screen component
  const currentScreenConfig = currentScreen
    ? screens.find((screen) => screen.id === currentScreen.id)
    : null

  const handleModalClose = () => {
    closeModal()
    resetScreens()
    if (onClose) onClose()
  }

  const handleBack = () => {
    previousScreen()
  }

  const handleNext = (data?: any) => {
    const currentIndex = screens.findIndex((screen) => screen.id === currentScreen?.id)

    if (currentIndex >= 0 && currentIndex < screens.length - 1) {
      const nextScreenConfig = screens[currentIndex + 1]
      nextScreen({
        id: nextScreenConfig.id,
        data: {
          ...nextScreenConfig.data,
          ...data,
        },
      })
    } else if (onComplete) {
      // Extract data from all screens in the stack
      const allData = screenStack.map((screen) => screen.data)
      onComplete(allData)
      handleModalClose()
    }
  }

  const ScreenComponent = currentScreenConfig?.component

  return (
    <Modal open={isOpen} onDismiss={handleModalClose}>
      <ModalContainer>
        {ScreenComponent && (
          <ModalContent>
            <ScreenComponent onNext={handleNext} onBack={handleBack} />
          </ModalContent>
        )}
        <ModalFooter>
          <Button
            colorStyle="accentSecondary"
            onClick={handleBack}
            disabled={screenStack.length <= 1}
          >
            Back
          </Button>
          <Button onClick={() => handleNext()}>
            {screens.findIndex((screen) => screen.id === currentScreen?.id) === screens.length - 1
              ? 'Complete'
              : 'Next'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </Modal>
  )
}
