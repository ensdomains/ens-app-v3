describe('pendingTransactionHelper', () => {
  it.todo(
    'if account nonce is greater than last mined transaction nonce by 1, should check if last mined transaction was a replacement',
  )
  it.todo('should detect out of date transaction')
  it.todo('should handle multiple pending transactions correctly')
  it.todo('should check every tranasction that is more than one away from account nonce')
  it.todo('should handle failed fetch requests gracefully')
  it.todo(
    "'if a pending transacton's transaction details request returns null, mark the transaction as dropped",
  )
})

describe('checkForReaplcementTransaction', () => {
  it.todo('should return false if there is a network failure')
})
