import { useReducer } from 'react'

// Define the types for our modal state
export type ModalScreen = {
  id: string
  data?: any
}

export type ModalState = {
  isOpen: boolean
  screenStack: ModalScreen[]
  currentScreenIndex: number
}

// Action types
type ModalAction =
  | { type: 'OPEN_MODAL'; payload: { screen: ModalScreen } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'NEXT_SCREEN'; payload: { screen: ModalScreen } }
  | { type: 'PREVIOUS_SCREEN' }
  | { type: 'GO_TO_SCREEN'; payload: { index: number } }
  | { type: 'RESET_SCREENS'; payload?: { screen?: ModalScreen } }

// Initial state
const initialState: ModalState = {
  isOpen: false,
  screenStack: [],
  currentScreenIndex: -1,
}

// Reducer function
const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        isOpen: true,
        screenStack: [action.payload.screen],
        currentScreenIndex: 0,
      }
    case 'CLOSE_MODAL':
      return {
        ...state,
        isOpen: false,
      }
    case 'NEXT_SCREEN':
      return {
        ...state,
        screenStack: [...state.screenStack, action.payload.screen],
        currentScreenIndex: state.currentScreenIndex + 1,
      }
    case 'PREVIOUS_SCREEN':
      if (state.currentScreenIndex <= 0) {
        return state
      }
      return {
        ...state,
        currentScreenIndex: state.currentScreenIndex - 1,
      }
    case 'GO_TO_SCREEN':
      if (action.payload.index < 0 || action.payload.index >= state.screenStack.length) {
        return state
      }
      return {
        ...state,
        currentScreenIndex: action.payload.index,
      }
    case 'RESET_SCREENS':
      if (action.payload?.screen) {
        return {
          ...state,
          screenStack: [action.payload.screen],
          currentScreenIndex: 0,
        }
      }
      return {
        ...state,
        screenStack: [],
        currentScreenIndex: -1,
      }
    default:
      return state
  }
}

// Hook
export const useModalState = () => {
  const [state, dispatch] = useReducer(modalReducer, initialState)

  const openModal = (screen: ModalScreen) => {
    dispatch({ type: 'OPEN_MODAL', payload: { screen } })
  }

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' })
  }

  const nextScreen = (screen: ModalScreen) => {
    dispatch({ type: 'NEXT_SCREEN', payload: { screen } })
  }

  const previousScreen = () => {
    dispatch({ type: 'PREVIOUS_SCREEN' })
  }

  const goToScreen = (index: number) => {
    dispatch({ type: 'GO_TO_SCREEN', payload: { index } })
  }

  const resetScreens = (screen?: ModalScreen) => {
    dispatch({ type: 'RESET_SCREENS', payload: screen ? { screen } : undefined })
  }

  const currentScreen = state.screenStack[state.currentScreenIndex]

  return {
    isOpen: state.isOpen,
    currentScreen,
    currentScreenIndex: state.currentScreenIndex,
    screenStack: state.screenStack,
    openModal,
    closeModal,
    nextScreen,
    previousScreen,
    goToScreen,
    resetScreens,
  }
}
