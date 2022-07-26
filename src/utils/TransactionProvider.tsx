import { TransactionModal } from '@app/components/@molecules/TransactionDialogManager/stage/Transaction'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import {
  StepStorageItem,
  TransactionPreStepFunction,
  TransactionSubmission,
  TxStateType,
} from '@app/types'
import { JsonRpcSigner } from '@ethersproject/providers'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQueryClient } from 'react-query'
import { useAccount, useSigner } from 'wagmi'

type StepStorageItems = Record<string, StepStorageItem>

export type TxFunc = (signer: JsonRpcSigner, address: string) => Promise<TxStateType>

const TransactionContext = createContext<{
  setCurrentTransaction: (key: string, tx?: TxFunc) => void
  setCurrentStep: (func: number | ((step: number) => number)) => void
  getCurrentStep: (key: string) => number
  getResumable: (key: string) => boolean
}>({
  setCurrentTransaction: () => {},
  setCurrentStep: () => {},
  getCurrentStep: () => 0,
  getResumable: () => false,
})

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const [currentTxKey, setCurrentTxKey] = useState<string | null>(null)
  const [stepStorage, setStepStorage] = useLocalStorage<StepStorageItems>('transaction-step', {})
  const [shouldClose, setShouldClose] = useState(false)

  const { data: signerData } = useSigner()
  const { data: addressData } = useAccount()
  const setCurrentTransaction = useCallback(
    async (key: string, tx?: TxFunc) => {
      const resulted = tx
        ? await tx(signerData as JsonRpcSigner, addressData?.address as string)
        : undefined
      console.log('resulted: ', resulted)
      setCurrentTxKey(key)
      setStepStorage((prevStepStorage) => {
        let data: TransactionSubmission[]
        let preSteps: TransactionPreStepFunction | undefined
        if (!tx) {
          const fromStorage = prevStepStorage[key]
          if (!fromStorage) return prevStepStorage
          data = fromStorage.data
          preSteps = fromStorage.preSteps
        } else if (!resulted) {
          return prevStepStorage
        } else {
          data = resulted.data
          preSteps = resulted.preSteps
        }
        const { currentStep, currentStepComplete } = prevStepStorage[key] || {
          currentStep: 0,
        }
        return {
          ...prevStepStorage,
          [key]: {
            currentStep: currentStepComplete ? currentStep + 1 : currentStep,
            currentStepComplete: false,
            data,
            preSteps,
          },
        }
      })
    },
    [addressData, setStepStorage, signerData],
  )

  const setCurrentStep = useCallback(
    (func: ((step: number) => number) | number) => {
      if (!currentTxKey) return
      setStepStorage((prevStepStorage) => {
        const currentTx = prevStepStorage[currentTxKey]
        const newStep = typeof func === 'function' ? func(currentTx.currentStep || 0) : func
        return {
          ...prevStepStorage,
          [currentTxKey]: {
            ...currentTx,
            currentStep: newStep,
            currentStepComplete: false,
          },
        }
      })
    },
    [currentTxKey, setStepStorage],
  )

  const setCurrentStepComplete = useCallback(() => {
    if (!currentTxKey) return
    setStepStorage((prevStepStorage) => ({
      ...prevStepStorage,
      [currentTxKey]: {
        ...prevStepStorage[currentTxKey],
        currentStep: prevStepStorage[currentTxKey]?.currentStep || 0,
        currentStepComplete: true,
      },
    }))
  }, [currentTxKey, setStepStorage])

  const getCurrentStep = useCallback(
    (key: string) => {
      return stepStorage[key]?.currentStep || 0
    },
    [stepStorage],
  )

  const getResumable = useCallback(
    (key: string) => {
      const item = stepStorage[key]
      console.log('has item', item)
      if (!item) return false
      if (item.currentStep + 1 >= item.data.length && item.currentStepComplete) return false
      return true
    },
    [stepStorage],
  )

  const { currentTx, currentStep, currentStepData, stepCount } = useMemo(() => {
    if (!currentTxKey) return { currentTx: null, currentStep: 0, stepCount: 0 }
    const _currentTx = stepStorage[currentTxKey]
    const _currentStep = _currentTx?.currentStep || 0
    const _currentStepData = _currentTx?.data[_currentStep] || null
    const _stepCount = _currentTx?.data.length || 0
    return {
      currentTx: _currentTx,
      currentStep: _currentStep,
      currentStepData: _currentStepData,
      stepCount: _stepCount,
    }
  }, [currentTxKey, stepStorage])

  useEffect(() => {
    let timeout: any
    if (shouldClose) {
      timeout = setTimeout(() => {
        setCurrentTxKey(null)
        setShouldClose(false)
      }, 350)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [shouldClose])

  useEffect(() => {
    setStepStorage((prevStepStorage) => {
      const _prev = prevStepStorage
      Object.keys(_prev).forEach((key) => {
        const item = _prev[key]
        if (item.currentStep + 1 >= item.data.length && item.currentStepComplete) {
          delete _prev[key]
        } else if (item.currentStepComplete) {
          _prev[key] = {
            ...item,
            currentStep: item.currentStep + 1,
            currentStepComplete: false,
          }
        }
      })
      return _prev
    })
  }, [setStepStorage])

  console.log('currentStepData: ', currentStepData)

  return (
    <TransactionContext.Provider
      value={useMemo(
        () => ({
          setCurrentTransaction,
          setCurrentStep,
          getCurrentStep,
          getResumable,
        }),
        [setCurrentTransaction, setCurrentStep, getCurrentStep, getResumable],
      )}
    >
      {children}
      <TransactionModal
        {...{
          ...(currentStepData as TransactionSubmission),
          onDismiss: () => {
            currentStepData?.onDismiss?.()
            setShouldClose(true)
          },
          onSuccess: () => {
            currentStepData?.onSuccess?.()
            if (currentTx && stepCount > 1) {
              if (currentStep + 1 < stepCount) {
                setCurrentStep((step) => step + 1)
              } else {
                setStepStorage((prevStepStorage) => {
                  const newStepStorage = { ...prevStepStorage }
                  delete newStepStorage[currentTxKey!]
                  return newStepStorage
                })
              }
            }
            queryClient.invalidateQueries()
          },
          onComplete: () => {
            setCurrentStepComplete()
          },
          preSteps: currentTx?.preSteps?.(currentStep),
          currentStep,
          stepCount,
          txKey: currentTxKey,
          open: !!currentTx && !shouldClose,
        }}
      />
    </TransactionContext.Provider>
  )
}

export const useTransaction = () => {
  const context = useContext(TransactionContext)
  return context
}
