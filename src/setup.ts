import { connect } from '@app/api/web3modal'
import { setup } from '@app/apollo/mutations/ens'
import {
  accountsReactive,
  favouritesReactive,
  globalErrorReactive,
  isAppReadyReactive,
  isENSReadyReactive,
  isReadOnlyReactive,
  networkIdReactive,
  networkReactive,
  subDomainFavouritesReactive,
  web3ProviderReactive,
} from '@app/apollo/reactiveVars'
import { getAccounts, getNetwork, getNetworkId } from '@ensdomains/ui'
import { isReadOnly } from '@ensdomains/ui/web3'
import { isEmpty, isNaN, negate, toNumber } from 'lodash'

export const setFavourites = () => {
  favouritesReactive(
    JSON.parse(window.localStorage.getItem('ensFavourites') as string) || [],
  )
}

export const setSubDomainFavourites = () => {
  subDomainFavouritesReactive(
    JSON.parse(
      window.localStorage.getItem('ensSubDomainFavourites') as string,
    ) || [],
  )
}

export const isSupportedNetwork = (networkId: number) => {
  switch (networkId) {
    case 1:
    case 3:
    case 4:
    case 5:
    case 1337:
      return true
    default:
      return false
  }
}

export const getAcceptedNetworkIds = (): number[] => {
  const acceptedNetworkIds =
    process.env.NEXT_PUBLIC_ACCEPTED_ETHEREUM_NETWORK_IDS
  if (acceptedNetworkIds) {
    return acceptedNetworkIds
      .split(',')
      .filter(negate(isEmpty))
      .map(toNumber)
      .filter(negate(isNaN))
  }
  return []
}

export const isAcceptedNetwork = (networkId: number): boolean => {
  return getAcceptedNetworkIds().includes(networkId)
}

export const getProvider = async (reconnect?: boolean) => {
  let provider
  try {
    // For local testing
    if (
      process.env.REACT_APP_STAGE === 'local' &&
      process.env.REACT_APP_ENS_ADDRESS
    ) {
      const { providerObject } = await setup({
        reloadOnAccountsChange: false,
        customProvider: 'http://localhost:8545',
        ensAddress: process.env.REACT_APP_ENS_ADDRESS,
      })
      provider = providerObject
      const labels = window.localStorage.labels
        ? JSON.parse(window.localStorage.labels)
        : {}
      window.localStorage.setItem(
        'labels',
        JSON.stringify({
          ...labels,
          ...JSON.parse(process.env.REACT_APP_LABELS || '{}'),
        }),
      )
      return provider
    }

    // TEMPORARILY REMOVED
    // const safe = await safeInfo();
    // if (safe) {
    //   provider = await setupSafeApp(safe);
    //   return provider;
    // }

    if (
      window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER') ||
      reconnect
    ) {
      provider = await connect()
      return provider
    }

    // Default readonly provider
    const { providerObject } = await setup({
      reloadOnAccountsChange: false,
      enforceReadOnly: true,
      enforceReload: false,
    })
    provider = providerObject
    return provider
  } catch (e: any) {
    console.error(e)
    if (e.message.match(/Unsupported network/)) {
      globalErrorReactive({
        ...globalErrorReactive(),
        network: 'Unsupported Network',
      })
      return
    }
  }

  try {
    const { providerObject } = await setup({
      reloadOnAccountsChange: false,
      enforceReadOnly: true,
      enforceReload: false,
    })
    provider = providerObject
    return provider
  } catch (e) {
    console.error('getProvider readOnly error: ', e)
  }
}

export const setupNetworkReactiveVariables = async () => {
  const networkId = await getNetworkId()
  const network = await getNetwork()

  if (!isAcceptedNetwork(networkId) || !isSupportedNetwork(networkId)) {
    networkIdReactive(networkId)
    networkReactive(network)
    globalErrorReactive({
      ...globalErrorReactive(),
      network: 'Unsupported Network',
    })
    return
  }

  networkIdReactive(await getNetworkId())
  networkReactive(await getNetwork())
  globalErrorReactive({
    ...globalErrorReactive(),
    network: undefined,
  })
}

export const setWeb3Provider = async (provider: any) => {
  web3ProviderReactive(provider)

  if (provider) {
    provider.removeAllListeners()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider?.on('chainChanged', async (_: any) => {
    isAppReadyReactive(false)

    await setupNetworkReactiveVariables()

    await setup({
      customProvider: provider,
      reloadOnAccountsChange: false,
      enforceReload: true,
    })

    isAppReadyReactive(true)
  })

  provider?.on('accountsChanged', async (_accounts: any[]) => {
    accountsReactive(_accounts)
  })

  return provider
}

const setErrorReactiveState = (error: string) => {
  web3ProviderReactive(null)
  networkIdReactive(null)
  networkReactive(null)
  accountsReactive([])
  isReadOnlyReactive(true)
  isENSReadyReactive(false)
  isAppReadyReactive(true)
  globalErrorReactive({
    ...globalErrorReactive(),
    network: error,
  })
}

/**
 * Runs the setup process get the right provider and set global state
 *
 * @param reconnect forces the provider to be acquired through web3modal.
 * Set to false on initial execution and true thereafter
 *
 * @mutation favoritesReactive
 * @mutation subDomainFavoritesReactive
 * @mutation web3ProviderReactive
 * @mutation networkIdReactive network number
 * @mutation networkReactive network name
 * @mutation accountsReactive the account associated with the provider
 * @mutation isReadOnlyReactive
 * @mutation isENSReadyReactive if ens registrar and contracts where successfully set up. Set in setup()
 * @mutation isAppReadyReactive if the app has finished loading scripts
 * @mutation globalErrorReactive
 *
 * * */
export default async (reconnect: boolean) => {
  try {
    isAppReadyReactive(false)

    const provider = await getProvider(reconnect)
    if (!provider) {
      setErrorReactiveState('provider unavailable')
      return
    }

    setFavourites()
    setSubDomainFavourites()

    const accounts = isReadOnly() ? [] : await getAccounts()
    accountsReactive(accounts)

    isReadOnlyReactive(isReadOnly())

    await setupNetworkReactiveVariables()

    await setWeb3Provider(provider)

    // add back for normal prod
    // setupAnalytics();

    isAppReadyReactive(true)
  } catch (e) {
    console.error('setup error: ', e)
    setErrorReactiveState('setup error')
  }
}
