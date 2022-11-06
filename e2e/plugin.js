module.exports = function (on, config) {
  on('before:browser:launch', async (browser = {}, arguments_) => {
    if (browser.name === 'chrome') {
      arguments_.args.push('--max_old_space_size=4096')
    }

    return arguments_
  })

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
