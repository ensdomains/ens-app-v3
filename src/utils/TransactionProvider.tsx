import { TransactionModal } from '@app/components/@molecules/TransactionModal/TransactionModal'
import { TransactionSubmission } from '@app/types'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const TransactionContext = createContext<{
  setCurrentTransaction: Dispatch<SetStateAction<TransactionSubmission | null>>
}>({
  setCurrentTransaction: () => {},
})

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionSubmission | null>(null)
  const [shouldClose, setShouldClose] = useState(false)

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
        () => ({ setCurrentTransaction }),
        [setCurrentTransaction],
      )}
    >
      {children}
      <TransactionModal
        {...{
          ...(currentTransaction as TransactionSubmission),
          onDismiss: () => {
            currentTransaction?.onDismiss?.()
            setShouldClose(true)
          },
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
