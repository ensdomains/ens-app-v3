import { ENS } from '@ensdomains/ensjs'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useProvider } from 'wagmi'

const addresses = {
  BaseRegistrarImplementation: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
  Multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  NameWrapper: '0xD7D9C568Bc4C2343ab286096e1F851D33eEf49Af',
  PublicResolver: '0x3bAa5F3ea7bFCC8948c4140f233d72c11eBF0bdB',
  ENSRegistryWithFallback: '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
  ReverseRegistrar: '0x4696E2f7D9f4CA187155ff50D93C00172181ddd5',
  UniversalResolver: '0xAbCd01ddDa102B0C32e8C5a371D7480dFA559DC3',
}

const defaultValue: ENS = process.env.NEXT_PUBLIC_GRAPH_URI
  ? new ENS({
      graphURI: process.env.NEXT_PUBLIC_GRAPH_URI,
      getContractAddress: () => (name: string) =>
        addresses[name as keyof typeof addresses],
    })
  : new ENS()

const EnsContext = createContext({ ...defaultValue, ready: false })

const EnsProvider = ({ children }: { children: React.ReactNode }) => {
  const provider = useProvider()
  const ensWithCurrentProvider = useMemo(() => defaultValue, [])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
    ensWithCurrentProvider
      .setProvider(provider as any)
      .then(() => setReady(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  return (
    <EnsContext.Provider
      value={useMemo(
        () => ({ ...ensWithCurrentProvider, ready }),
        [ensWithCurrentProvider, ready],
      )}
    >
      {children}
    </EnsContext.Provider>
  )
}

function useEns() {
  const context = useContext(EnsContext)
  return context
}
export { useEns, EnsProvider }
