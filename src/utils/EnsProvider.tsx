import { ENS } from '@ensdomains/ensjs'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useProvider } from 'wagmi'

// local addresses for test env
const testAddresses = {
  BaseRegistrarImplementation: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
  Multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  NameWrapper: '0xD678D5259862431F17a556515948D450B5934773',
  PublicResolver: '0x9e6c745CAEdA0AB8a7AD0f393ef90dcb7C70074A',
  ENSRegistryWithFallback: '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
  ReverseRegistrar: '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC',
  UniversalResolver: '0x454b1F7d4C741A2f86AF7eF19b44B2A6EE179443',
}

const defaultValue: ENS = process.env.NEXT_PUBLIC_GRAPH_URI
  ? new ENS({
      graphURI: process.env.NEXT_PUBLIC_GRAPH_URI,
      getContractAddress: () => (name: string) =>
        testAddresses[name as keyof typeof testAddresses],
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
