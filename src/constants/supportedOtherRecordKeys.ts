export const supportedOtherRecordKeys = ['abi'] as const

export const getSupportedOtherRecordKeysForInterfaces = (interfaces?: { abiResolver: boolean }) => {
  const { abiResolver = true } = interfaces || {}
  return abiResolver ? supportedOtherRecordKeys : []
}
