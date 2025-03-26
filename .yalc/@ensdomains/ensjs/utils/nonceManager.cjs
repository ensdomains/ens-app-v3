 /* eslint-disable import/no-extraneous-dependencies */
 const { hexToNumber, numberToHex} = require('viem')
 
 const makeNonceManager = async (href) => {
  const { getNamedAccounts, network } = href
  const names = ['owner', 'owner2', 'owner3', 'owner4']
  const allNamedAccts = await getNamedAccounts()
  const startingNonces = await Promise.all(names.map((name) => network.provider.send('eth_getTransactionCount', [allNamedAccts[name], "latest"]).then(hexToNumber)))
  const nonceMap = Object.fromEntries(names.map((name, i) => [name, startingNonces[i]]))

  console.log('Nonce manager initialized', nonceMap)
  
  return {
    getNonce: (name) => {
      const nonce = nonceMap[name]
      nonceMap[name]++
      return nonce
    }
  }


}

module.exports = {
  makeNonceManager
}