import type { connect as Connect } from '@app/api/web3modal'
import type { setup as Setup } from '@app/apollo/mutations/ens'
import type {
  accountsReactive as AccountsReactive,
  globalErrorReactive as GlobalErrorReactive,
  isAppReadyReactive as IsAppReadyReactive,
  networkIdReactive as NetworkIdReactive,
  networkReactive as NetworkReactive,
} from '@app/apollo/reactiveVars'
import type {
  getNetwork as GetNetwork,
  getNetworkId as GetNetworkId,
} from '@ensdomains/ui'
import { asMock } from '__tests__/helpers'

jest.mock('@app/api/web3modal', () => ({
  connect: jest.fn(),
}))

jest.mock('@app/apollo/mutations/ens', () => ({
  setup: jest.fn(),
}))

jest.mock('@app/apollo/reactiveVars', () => ({
  ...jest.requireActual('@app/apollo/reactiveVars'),
  networkIdReactive: jest.fn(),
  networkReactive: jest.fn(),
  accountsReactive: jest.fn(),
  globalErrorReactive: jest.fn(),
  isAppReadyReactive: jest.fn(),
}))

jest.mock('@ensdomains/ui', () => ({
  ...jest.requireActual('@ensdomains/ui'),
  getNetworkId: jest.fn(),
  getNetwork: jest.fn(),
}))

jest.mock('@app/apollo/sideEffects', () => ({
  ...jest.requireActual('@app/apollo/sideEffects'),
  getReverseRecord: jest.fn(),
}))

jest.mock('@app/utils/analytics', () => ({
  ...jest.requireActual('@app/utils/analytics'),
  setupAnalytics: jest.fn(),
}))

const {
  getNetwork: _getNetwork,
  getNetworkId: _getNetworkId,
} = require('@ensdomains/ui')
const {
  isSupportedNetwork,
  setWeb3Provider,
  getProvider,
} = require('@app/setup')
const defaultSetup = require('@app/setup').default
const {
  accountsReactive: _accountsReactive,
  globalErrorReactive: _globalErrorReactive,
  isAppReadyReactive: _isAppReadyReactive,
  networkIdReactive: _networkIdReactive,
  networkReactive: _networkReactive,
} = require('@app/apollo/reactiveVars')
const { connect: _connect } = require('@app/api/web3modal')
const { setup: _setup } = require('@app/apollo/mutations/ens')

const setup = asMock(_setup as typeof Setup)
const connect = asMock(_connect as typeof Connect)

const networkIdReactive = asMock(_networkIdReactive as typeof NetworkIdReactive)
const networkReactive = asMock(_networkReactive as typeof NetworkReactive)
const accountsReactive = asMock(_accountsReactive as typeof AccountsReactive)
const globalErrorReactive = asMock(
  _globalErrorReactive as typeof GlobalErrorReactive,
)
const isAppReadyReactive = asMock(
  _isAppReadyReactive as typeof IsAppReadyReactive,
)

const getNetworkId = asMock(_getNetworkId as typeof GetNetworkId)
const getNetwork = asMock(_getNetwork as typeof GetNetwork)

describe('getProvider', () => {
  it('should return readOnly provider if connect() fails', async () => {
    connect.mockRejectedValue(new Error('Test connection failed.'))
    setup.mockImplementation(({ ens, registrar, providerObject }) =>
      Promise.resolve({
        ens,
        registrar,
        providerObject: { ...providerObject, readOnlyProvider: true },
      }),
    )
    const provider = await getProvider(false)
    expect(provider.readOnlyProvider).toBeTruthy()
  })

  describe('local blockchain', () => {
    let originalReactAppStage: any
    let originalReactAppEnsAddress: any
    let originalReactAppLabels: any
    beforeAll(() => {
      originalReactAppStage = process.env.REACT_APP_STAGE
      originalReactAppEnsAddress = process.env.REACT_APP_ENS_ADDRESS
      originalReactAppLabels = process.env.REACT_APP_LABELS
      process.env.REACT_APP_STAGE = 'local'
      process.env.REACT_APP_ENS_ADDRESS = '0xaddress'
      process.env.REACT_APP_LABELS = '{}'
    })
    afterAll(() => {
      process.env.REACT_APP_STAGE = originalReactAppStage
      process.env.REACT_APP_ENS_ADDRESS = originalReactAppEnsAddress
      process.env.REACT_APP_LABELS = originalReactAppLabels
    })

    it('should return provider when using local blockchain', async () => {
      setup.mockImplementation(({ ens, registrar, providerObject }) =>
        Promise.resolve({
          ens,
          registrar,
          providerObject: { ...providerObject, localProvider: true },
        }),
      )
      const provider = await getProvider(false)
      expect(provider.localProvider)
    })
  })

  describe('web3 cached provider', () => {
    afterAll(() => {
      window.localStorage.clear()
    })
    it('should call connect if there is a cached provider', async () => {
      expect.assertions(1)
      window.localStorage.setItem('WEB3_CONNECT_CACHED_PROVIDER', 'injected')
      connect.mockImplementation(() =>
        Promise.resolve(expect(true).toBeTruthy()),
      )
      getProvider()
    })
  })

  describe('no cached provider', () => {
    it('should call setup', async () => {
      setup.mockImplementation(() =>
        Promise.resolve({
          ens: undefined,
          registrar: undefined,
          providerObject: {},
        }),
      )
      await getProvider(false)
      expect(setup).toHaveBeenCalled()
    }, 10000)
  })

  describe('reconnect == true', () => {
    it('should call connect if reconnect == true', async () => {
      connect.mockImplementation(() => Promise.resolve(1))
      const provider = await getProvider(true)
      expect(provider).toEqual(1)
    })
  })
})

describe('setWeb3Provider', () => {
  it('should update network id when network id changes', async () => {
    expect.assertions(1)
    getNetworkId.mockImplementation(() => Promise.resolve('2'))
    getNetwork.mockImplementation(() => Promise.resolve('Main'))
    const mockProvider = {
      on: (event: any, callback: any) => {
        const cb = async () => {
          try {
            await callback('1')
            expect(networkIdReactive).toHaveBeenCalled()
          } catch (e) {
            console.error(e)
          }
        }
        if (event === 'chainChanged') {
          cb()
        }
      },
      removeAllListeners: () => null,
    }
    await setWeb3Provider(mockProvider)
  })
  it('should update accounts when accounts change', async () => {
    expect.assertions(1)
    getNetworkId.mockImplementation(() => Promise.resolve('2'))
    getNetwork.mockImplementation(() => Promise.resolve('Main'))
    const mockProvider = {
      on: (event: any, callback: any) => {
        const cb = async () => {
          try {
            await callback('1')
            expect(accountsReactive).toHaveBeenCalled()
          } catch (e) {
            console.error(e)
          }
        }
        if (event === 'accountsChanged') {
          cb()
        }
      },
      removeAllListeners: () => null,
    }
    await setWeb3Provider(mockProvider)
  })
  it('should remove listeners on the provider if they already exist', async () => {
    expect.assertions(1)
    getNetworkId.mockImplementation(() => Promise.resolve(2))
    getNetwork.mockImplementation(() => Promise.resolve('Main'))
    const mockRemoveAllListeners = jest.fn()
    const mockProvider = {
      on: () => {},
      removeAllListeners: mockRemoveAllListeners,
    }
    await setWeb3Provider(mockProvider)
    expect(mockRemoveAllListeners).toHaveBeenCalled()
  })
  it('should update network when network changes', async () => {
    expect.assertions(1)
    getNetworkId.mockImplementation(() => Promise.resolve(2))
    getNetwork.mockImplementation(() => Promise.resolve('Main'))
    const mockProvider = {
      on: (event: any, callback: any) => {
        const cb = async () => {
          try {
            await callback('1')
            expect(networkReactive).toHaveBeenCalled()
          } catch (e) {
            console.error(e)
          }
        }
        if (event === 'chainChanged') {
          cb()
        }
      },
      removeAllListeners: () => null,
    }
    await setWeb3Provider(mockProvider)
  })
  it('should set global error if chain is changed to an unsupported network', async () => {
    expect.assertions(2)
    getNetworkId.mockImplementation(() => Promise.resolve(2))
    getNetwork.mockImplementation(() => Promise.resolve('Main'))
    const mockProvider = {
      on: (event: any, callback: any) => {
        const cb = async () => {
          try {
            await callback(1314)
            expect(globalErrorReactive).toHaveBeenCalled()
            expect(networkReactive).not.toHaveBeenCalled()
          } catch (e) {
            console.error(e)
          }
        }
        if (event === 'chainChanged') {
          cb()
        }
      },
      removeAllListeners: () => null,
    }
    await setWeb3Provider(mockProvider)
  })
})

describe('isSupportedNetwork', () => {
  it('should return true if network is supported', () => {
    expect(isSupportedNetwork(3)).toBeTruthy()
  })
  it('should return false if network is not supported', () => {
    expect(isSupportedNetwork(22222)).toBeFalsy()
  })
})

describe('setup', () => {
  let originalReactAppStage: any
  let originalReactAppEnsAddress: any
  let originalReactAppLabels: any
  beforeAll(() => {
    originalReactAppStage = process.env.REACT_APP_STAGE
    originalReactAppEnsAddress = process.env.REACT_APP_ENS_ADDRESS
    originalReactAppLabels = process.env.REACT_APP_LABELS
    process.env.REACT_APP_STAGE = 'local'
    process.env.REACT_APP_ENS_ADDRESS = '0xaddress'
    process.env.REACT_APP_LABELS = '{}'
  })
  afterAll(() => {
    process.env.REACT_APP_STAGE = originalReactAppStage
    process.env.REACT_APP_ENS_ADDRESS = originalReactAppEnsAddress
    process.env.REACT_APP_LABELS = originalReactAppLabels
  })
  it('should set global error if network is unsupported', async () => {
    setup.mockImplementation(() =>
      Promise.resolve({
        ens: undefined,
        registrar: undefined,
        providerObject: { localProvider: true },
      }),
    )
    await getProvider(false)
    getNetworkId.mockImplementation(() => Promise.resolve(222))
    await defaultSetup(false)
    expect(globalErrorReactive).toHaveBeenCalled()
  })

  it('should set global error if connect throws unsupported network error', async () => {
    jest.clearAllMocks()
    process.env.REACT_APP_STAGE = 'notlocal'
    connect.mockImplementation(() =>
      Promise.reject(new Error('Unsupported network 124')),
    )
    expect(globalErrorReactive).not.toHaveBeenCalled()
    await getProvider(true)
    expect(globalErrorReactive).toHaveBeenCalled()
  })

  it('should allow setup to continue if network is supported', async () => {
    const mockProvider = {
      on: () => {},
      removeAllListeners: () => null,
    }
    getNetworkId.mockImplementation(() => Promise.resolve(1))
    getNetwork.mockImplementation(() => Promise.resolve('Main'))
    setup.mockImplementation(() =>
      Promise.resolve({
        ens: undefined,
        registrar: undefined,
        providerObject: mockProvider,
      }),
    )
    await getProvider(false)
    getNetworkId.mockImplementation(() => Promise.resolve(1))
    await defaultSetup(false)
    expect(isAppReadyReactive).toHaveBeenCalled()
  })
})
