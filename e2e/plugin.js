module.exports = function (on, config) {
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
    setTransactionWaitTime(waitTime) {
      process.env.TRANSACTION_WAIT_TIME = String(waitTime)
      return null
    },
  })
}
