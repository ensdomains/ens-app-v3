describe('SyncDroppedTransaction', () => {
  it.todo('should call findDroppedTransactions when there is a new transaction')
})

describe('findDroppedTransactions', () => {
  it.todo('should exit early if there is no connected account')
  it.todo('should mark transaction status as unknown if it can not be found in mempool')
  it.todo('should mark transaction status as dropped if it gets dropped')
  it.todo('found transaction should have its nonce added')
})
