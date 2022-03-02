jest.mock('@app/setup', () => ({ __esModule: true, default: jest.fn() }))

jest.mock('../api/web3modal', () => ({
  disconnect: jest.fn(),
}))

jest.mock('../apollo/reactiveVars', () => ({
  accountsReactive: jest.fn(),
  isReadOnlyReactive: jest.fn(),
  reverseRecordReactive: jest.fn(),
  delegatesReactive: jest.fn(),
}))

const { disconnect } = require('@app/api/web3modal')
const {
  accountsReactive,
  isReadOnlyReactive,
  reverseRecordReactive,
} = require('@app/apollo/reactiveVars')
const setupENS = require('@app/setup').default

const { connectProvider, disconnectProvider } = require('./providerUtils')

describe('connectProvider', () => {
  it('should call setup with reconnect === true', () => {
    connectProvider()
    expect(setupENS).toBeCalledWith(true)
  })
})

describe('disconnectProvider', () => {
  it('should call disconnect on the provider', () => {
    disconnectProvider()
    expect(disconnect).toBeCalled()
  })
  it('should reset the correct global variables', () => {
    disconnectProvider()
    expect(isReadOnlyReactive).toBeCalledWith(true)
    expect(reverseRecordReactive).toBeCalledWith(null)
    expect(accountsReactive).toBeCalledWith(null)
  })
})
