import { useRecentTransactions } from './useRecentTransactions'

const useHasPendingTransactions = () => {
  const transactions = useRecentTransactions()
  return transactions.some((transaction) => transaction.status === 'pending')
}

export default useHasPendingTransactions
