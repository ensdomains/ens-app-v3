import { describe, expect, it } from 'vitest'

import { buildChainTransport, getDefaultTransportSpecs, getTransportSpecs } from './transports'

// Instantiate a viem transport (or fallback) so we can inspect what it actually wired up.
type InstantiatedTransport = { config: { type: string }; value: { url?: string } }
const instantiate = (transport: (opts: object) => unknown) =>
  transport({}) as { value: { transports: InstantiatedTransport[] } }

describe('getTransportSpecs', () => {
  const chainName = 'mainnet'
  const defaults = getDefaultTransportSpecs(chainName)

  it('returns only the defaults when no custom rpc is set', () => {
    expect(getTransportSpecs({ chainName })).toEqual(defaults)
  })

  it('puts the custom url first as primary, keeping defaults as fallback', () => {
    const specs = getTransportSpecs({
      chainName,
      customRpc: { url: 'https://my.node.example', exclusive: false },
    })
    expect(specs[0]).toEqual({ type: 'http', url: 'https://my.node.example' })
    expect(specs.slice(1)).toEqual(defaults)
  })

  it('uses only the custom url when exclusive', () => {
    const specs = getTransportSpecs({
      chainName,
      customRpc: { url: 'https://my.node.example', exclusive: true },
    })
    expect(specs).toEqual([{ type: 'http', url: 'https://my.node.example' }])
  })

  it('falls back to defaults when the custom url is invalid', () => {
    expect(
      getTransportSpecs({ chainName, customRpc: { url: 'not-a-url', exclusive: false } }),
    ).toEqual(defaults)
  })

  it('falls back to defaults when an invalid custom url is marked exclusive (never bricks)', () => {
    expect(
      getTransportSpecs({ chainName, customRpc: { url: 'ws://unsupported', exclusive: true } }),
    ).toEqual(defaults)
  })

  it('falls back to defaults for an empty custom url', () => {
    expect(getTransportSpecs({ chainName, customRpc: { url: '', exclusive: true } })).toEqual(
      defaults,
    )
  })

  it('builds sepolia default urls with the sepolia network name', () => {
    const specs = getDefaultTransportSpecs('sepolia')
    expect(specs.every((s) => s.url.includes('sepolia'))).toBe(true)
  })

  it('maps the mainnet chain name to the drpc "ethereum" network', () => {
    expect(getDefaultTransportSpecs('mainnet').some((s) => s.url.includes('network=ethereum'))).toBe(
      true,
    )
  })
})

// Independent of the SUT: pin the exact kind + order of the default fallback chain so a
// dropped/reordered entry (the mechanism behind AC5, auto-degrade to DRPC/Tenderly) is caught.
describe('getDefaultTransportSpecs shape', () => {
  it('is exactly [drpc ws, drpc http, tenderly http] in that order', () => {
    const specs = getDefaultTransportSpecs('mainnet')
    expect(specs).toHaveLength(3)
    expect(specs.map((s) => s.type)).toEqual(['ws', 'http', 'http'])
    expect(specs[0].url).toContain('drpc.org/ogws')
    expect(specs[1].url).toContain('drpc.org/ogrpc')
    expect(specs[2].url).toContain('tenderly')
  })
})

// buildChainTransport is the function actually wired into wagmi's transport config; assert the
// spec list is mapped to the right viem transports (ws vs http) and wired into fallback().
describe('buildChainTransport', () => {
  it('maps the defaults to a ws primary + two http fallbacks, in order', () => {
    const { value } = instantiate(buildChainTransport({ chainName: 'mainnet' }))
    expect(value.transports.map((t) => t.config.type)).toEqual(['webSocket', 'http', 'http'])
  })

  it('puts a valid custom url first as an http transport, keeping the defaults as fallback', () => {
    const { value } = instantiate(
      buildChainTransport({ chainName: 'mainnet', customRpc: { url: 'https://my.node', exclusive: false } }),
    )
    expect(value.transports).toHaveLength(4)
    expect(value.transports[0].config.type).toBe('http')
    expect(value.transports[0].value.url).toBe('https://my.node')
  })

  it('uses only the custom url with no fallback when exclusive', () => {
    const { value } = instantiate(
      buildChainTransport({ chainName: 'mainnet', customRpc: { url: 'https://only.node', exclusive: true } }),
    )
    expect(value.transports).toHaveLength(1)
    expect(value.transports[0].config.type).toBe('http')
    expect(value.transports[0].value.url).toBe('https://only.node')
  })

  it('ignores an invalid custom url and falls back to the defaults', () => {
    const { value } = instantiate(
      buildChainTransport({ chainName: 'mainnet', customRpc: { url: 'ws://nope', exclusive: true } }),
    )
    expect(value.transports.map((t) => t.config.type)).toEqual(['webSocket', 'http', 'http'])
  })
})
