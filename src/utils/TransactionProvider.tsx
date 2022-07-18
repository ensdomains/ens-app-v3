import { TransactionModal } from '@app/components/@molecules/TransactionModal/TransactionModal'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { TransactionPreStepFunction, TransactionSubmission } from '@app/types'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQueryClient } from 'react-query'

export type TxStateType = {
  data: TransactionSubmission[]
  key: string
  preSteps?: TransactionPreStepFunction
} | null

const TransactionContext = createContext<{
  setCurrentTransaction: Dispatch<SetStateAction<TxStateType>>
  setCurrentStep: (func: number | ((step: number) => number)) => void
  getCurrentStep: (key: string) => number
}>({
  setCurrentTransaction: () => {},
  setCurrentStep: () => {},
  getCurrentStep: () => 0,
})

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const [currentTransaction, setCurrentTransaction] =
    useState<TxStateType>(null)
  const [stepStorage, setStepStorage] = useLocalStorage<Record<string, number>>(
    'transaction-step',
    {},
  )
  const [shouldClose, setShouldClose] = useState(false)

  const setCurrentStep = useCallback(
    (func: ((step: number) => number) | number) => {
      if (!currentTransaction) return
      const prev = stepStorage[currentTransaction.key]
      const newStep = typeof func === 'number' ? func : func(prev || 0)
      setStepStorage((prevStepStorage) => ({
        ...prevStepStorage,
        [currentTransaction.key]: newStep,
      }))
    },
    [currentTransaction, stepStorage, setStepStorage],
  )

  const getCurrentStep = useCallback(
    (key: string) => {
      return stepStorage[key] || 0
    },
    [stepStorage],
  )

  const currentStep = useMemo(() => {
    if (!currentTransaction) return 0
    return stepStorage[currentTransaction.key] || 0
  }, [currentTransaction, stepStorage])

  useEffect(() => {
    let timeout: any
    if (shouldClose) {
      timeout = setTimeout(() => {
        setCurrentTransaction(null)
        setShouldClose(false)
      }, 350)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [shouldClose])

  return (
    <TransactionContext.Provider
      value={useMemo(
        () => ({ setCurrentTransaction, setCurrentStep, getCurrentStep }),
        [setCurrentTransaction, setCurrentStep, getCurrentStep],
      )}
    >
      {children}
      <TransactionModal
        {...{
          ...(currentTransaction?.data[currentStep] as TransactionSubmission),
          onDismiss: () => {
            console.log('onDismiss inside')
            currentTransaction?.data[currentStep].onDismiss?.()
            setShouldClose(true)
          },
          onSuccess: () => {
            console.log('onSucess inside')
            currentTransaction?.data[currentStep].onSuccess?.()
            if (currentTransaction && currentTransaction.data.length > 1) {
              if (currentStep + 1 < currentTransaction.data.length) {
                setCurrentStep((step) => step + 1)
              } else {
                setStepStorage((prevStepStorage) => {
                  const newStepStorage = { ...prevStepStorage }
                  delete newStepStorage[currentTransaction!.key]
                  return newStepStorage
                })
              }
            }
            queryClient.invalidateQueries()
          },
          preSteps: currentTransaction?.preSteps?.(currentStep),
          currentStep,
          stepCount: currentTransaction?.data.length || 0,
          open: !!currentTransaction && !shouldClose,
        }}
      />
    </TransactionContext.Provider>
  )
}

export const useTransaction = () => {
  const context = useContext(TransactionContext)
  return context
}
