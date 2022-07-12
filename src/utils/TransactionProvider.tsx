import { TransactionModal } from '@app/components/@molecules/TransactionModal/TransactionModal'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { TransactionSubmission } from '@app/types'
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

type StateType = { data: TransactionSubmission[]; key: string } | null

const TransactionContext = createContext<{
  setCurrentTransaction: Dispatch<SetStateAction<StateType>>
  getCurrentStep: (key: string) => number
}>({
  setCurrentTransaction: () => {},
  getCurrentStep: () => 0,
})

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const [currentTransaction, setCurrentTransaction] = useState<StateType>(null)
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
            currentTransaction?.data[currentStep].onDismiss?.()
            setShouldClose(true)
          },
          onSuccess: () => {
            setStepStorage((prevStepStorage) => {
              const newStepStorage = { ...prevStepStorage }
              delete newStepStorage[currentTransaction!.key]
              return newStepStorage
            })
            currentTransaction?.data[currentStep].onSuccess?.()
            if (
              currentTransaction &&
              currentTransaction.data.length > currentStep + 1
            ) {
              setCurrentStep((step) => step + 1)
            }
            queryClient.invalidateQueries()
          },
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
