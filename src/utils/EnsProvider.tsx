import { ENS } from '@ensdomains/ensjs'
import { ContractName } from '@ensdomains/ensjs/dist/cjs/contracts/types'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useProvider } from 'wagmi'

const opts: ConstructorParameters<typeof ENS>[0] = {}

if (
  process.env.NEXT_PUBLIC_PROVIDER &&
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES
) {
  const deploymentAddresses = JSON.parse(
    process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES!,
  ) as Record<ContractName | 'ENSRegistry', string>
  opts.getContractAddress = () => (contractName) =>
    deploymentAddresses[
      contractName === 'ENSRegistryWithFallback' ? 'ENSRegistry' : contractName
    ]
}

if (process.env.NEXT_PUBLIC_GRAPH_URI) {
  opts.graphURI = process.env.NEXT_PUBLIC_GRAPH_URI
}

const defaultValue: ENS = new ENS(opts)

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
