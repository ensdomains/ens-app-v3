import { ENS } from '@ensdomains/ensjs'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useProvider } from 'wagmi'

const defaultValue: ENS = process.env.NEXT_PUBLIC_GRAPH_URI
  ? new ENS({
      graphURI: process.env.NEXT_PUBLIC_GRAPH_URI,
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
