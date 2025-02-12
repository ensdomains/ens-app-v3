# makeName 

## Known issues and development notes

- Nonce management is controlled by the default **nonceManager** when the accounts are created. This is required in order to make parallel transactions work correctly.
- When sending transaction, you will need to use the lower level **viem** functions **walletClient.prepareTransactionRequest** and **walletClient.senTransaction** so that the nonceManager will work correctly.
- When using prepareTransactionRequest, you will need to add a custom **gas** value. Without it, the function will throw an error because it will not be able to estimate the gas for a transaction where the nonce value is not sequential to the last transaction mined.
