import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { probeRpcUrl } from '@app/utils/query/probeRpcUrl'
import type { CustomRpcUrls } from '@app/utils/query/customRpc'

import { RpcSection } from './index'

vi.mock('@app/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}))

vi.mock('@app/utils/query/probeRpcUrl', () => ({
  probeRpcUrl: vi.fn(),
}))

const mockUseLocalStorage = mockFunction(useLocalStorage)
// vi.mocked (not mockFunction) so the async ProbeResult return type is preserved for
// mockResolvedValue — mockFunction DeepPartials the Promise and breaks the typing.
const mockProbeRpcUrl = vi.mocked(probeRpcUrl)

// test-utils mocks the wagmi config to a single mainnet chain, so useChainId() === 1.
const CHAIN_ID = 1

const typeUrl = (value: string) =>
  fireEvent.change(screen.getByTestId('rpc-url-input'), { target: { value } })

// The component writes via functional updaters (setCustomRpcUrls(prev => ...)) so a late
// probe composes with the latest stored value; apply the recorded updater to inspect its result.
const applyLastUpdater = (setter: ReturnType<typeof vi.fn>, prev: CustomRpcUrls): CustomRpcUrls => {
  const updater = setter.mock.calls.at(-1)?.[0]
  return typeof updater === 'function' ? updater(prev) : updater
}

describe('RpcSection', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders with an empty form and disabled save/reset when nothing is stored', () => {
    mockUseLocalStorage.mockReturnValue([{}, vi.fn()])

    render(<RpcSection />)

    expect(screen.getByTestId('rpc-section')).toBeInTheDocument()
    expect(screen.getByTestId('rpc-url-input')).toHaveValue('')
    expect(screen.getByTestId('rpc-save-button')).toBeDisabled()
    expect(screen.getByTestId('rpc-reset-button')).toBeDisabled()
  })

  it('pre-populates the form from a stored value for the active chain (persistence across reloads)', () => {
    mockUseLocalStorage.mockReturnValue([
      { [CHAIN_ID]: { url: 'https://stored.example', exclusive: true } },
      vi.fn(),
    ])

    render(<RpcSection />)

    expect(screen.getByTestId('rpc-url-input')).toHaveValue('https://stored.example')
    expect(screen.getByTestId('rpc-exclusive-toggle')).toBeChecked()
    expect(screen.getByTestId('rpc-exclusive-warning')).toBeInTheDocument()
  })

  it('shows an inline error and keeps save disabled for an invalid url', async () => {
    mockUseLocalStorage.mockReturnValue([{}, vi.fn()])

    render(<RpcSection />)

    typeUrl('not a url')

    expect(await screen.findByText('section.rpc.errors.validate.invalidUrl')).toBeInTheDocument()
    expect(screen.getByTestId('rpc-save-button')).toBeDisabled()
    expect(mockProbeRpcUrl).not.toHaveBeenCalled()
  })

  it('probes, persists and prompts a reload on a valid save', async () => {
    const setUrls = vi.fn()
    mockUseLocalStorage.mockReturnValue([{}, setUrls])
    mockProbeRpcUrl.mockResolvedValue({ success: true })

    render(<RpcSection />)

    typeUrl('https://my.node.example')
    await waitFor(() => expect(screen.getByTestId('rpc-save-button')).toBeEnabled())

    fireEvent.click(screen.getByTestId('rpc-save-button'))

    await waitFor(() =>
      expect(mockProbeRpcUrl).toHaveBeenCalledWith({
        url: 'https://my.node.example',
        chainId: CHAIN_ID,
      }),
    )
    expect(applyLastUpdater(setUrls, {})).toEqual({
      [CHAIN_ID]: { url: 'https://my.node.example', exclusive: false },
    })
    expect(await screen.findByTestId('rpc-reload-button')).toBeInTheDocument()
  })

  it('composes the save with the latest stored value rather than a stale snapshot', async () => {
    const setUrls = vi.fn()
    // Another chain's entry must survive a save for the active chain.
    mockUseLocalStorage.mockReturnValue([{ 999: { url: 'https://other', exclusive: false } }, setUrls])
    mockProbeRpcUrl.mockResolvedValue({ success: true })

    render(<RpcSection />)

    typeUrl('https://my.node.example')
    await waitFor(() => expect(screen.getByTestId('rpc-save-button')).toBeEnabled())
    fireEvent.click(screen.getByTestId('rpc-save-button'))

    await waitFor(() => expect(setUrls).toHaveBeenCalled())
    // Apply the updater to a DIFFERENT prev than render-time to prove it isn't a stale snapshot.
    expect(applyLastUpdater(setUrls, { 999: { url: 'https://other', exclusive: false } })).toEqual({
      999: { url: 'https://other', exclusive: false },
      [CHAIN_ID]: { url: 'https://my.node.example', exclusive: false },
    })
  })

  it('persists the exclusive flag and shows the warning when enabled', async () => {
    const setUrls = vi.fn()
    mockUseLocalStorage.mockReturnValue([{}, setUrls])
    mockProbeRpcUrl.mockResolvedValue({ success: true })

    render(<RpcSection />)

    typeUrl('https://my.node.example')
    fireEvent.click(screen.getByTestId('rpc-exclusive-toggle'))

    expect(await screen.findByTestId('rpc-exclusive-warning')).toBeInTheDocument()

    await waitFor(() => expect(screen.getByTestId('rpc-save-button')).toBeEnabled())
    fireEvent.click(screen.getByTestId('rpc-save-button'))

    await waitFor(() => expect(setUrls).toHaveBeenCalled())
    expect(applyLastUpdater(setUrls, {})).toEqual({
      [CHAIN_ID]: { url: 'https://my.node.example', exclusive: true },
    })
  })

  it('surfaces a probe failure and does not persist', async () => {
    const setUrls = vi.fn()
    mockUseLocalStorage.mockReturnValue([{}, setUrls])
    mockProbeRpcUrl.mockResolvedValue({ success: false, reason: 'wrongChain', reportedChainId: 5 })

    render(<RpcSection />)

    typeUrl('https://my.node.example')
    await waitFor(() => expect(screen.getByTestId('rpc-save-button')).toBeEnabled())
    fireEvent.click(screen.getByTestId('rpc-save-button'))

    expect(await screen.findByText('section.rpc.errors.probe.wrongChain')).toBeInTheDocument()
    expect(setUrls).not.toHaveBeenCalled()
    expect(screen.queryByTestId('rpc-reload-button')).not.toBeInTheDocument()
  })

  it('keeps Save enabled after a probe failure so the same URL can be retried', async () => {
    const setUrls = vi.fn()
    mockUseLocalStorage.mockReturnValue([{}, setUrls])
    mockProbeRpcUrl.mockResolvedValueOnce({ success: false, reason: 'timeout' })

    render(<RpcSection />)

    typeUrl('https://my.node.example')
    await waitFor(() => expect(screen.getByTestId('rpc-save-button')).toBeEnabled())
    fireEvent.click(screen.getByTestId('rpc-save-button'))

    // Probe failed, but the URL is still valid — Save must remain usable to retry it.
    expect(await screen.findByText('section.rpc.errors.probe.timeout')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByTestId('rpc-save-button')).toBeEnabled())

    // Retry the same URL; this time the probe succeeds and it persists.
    mockProbeRpcUrl.mockResolvedValueOnce({ success: true })
    fireEvent.click(screen.getByTestId('rpc-save-button'))
    await waitFor(() => expect(setUrls).toHaveBeenCalled())
    expect(applyLastUpdater(setUrls, {})).toEqual({
      [CHAIN_ID]: { url: 'https://my.node.example', exclusive: false },
    })
  })

  it('keeps the reload prompt visible when a later save attempt fails', async () => {
    mockUseLocalStorage.mockReturnValue([{}, vi.fn()])
    mockProbeRpcUrl.mockResolvedValueOnce({ success: true })

    render(<RpcSection />)

    // First save succeeds -> reload prompt appears.
    typeUrl('https://good.example')
    await waitFor(() => expect(screen.getByTestId('rpc-save-button')).toBeEnabled())
    fireEvent.click(screen.getByTestId('rpc-save-button'))
    expect(await screen.findByTestId('rpc-reload-button')).toBeInTheDocument()

    // Editing to a second URL whose probe fails must not hide the still-pending reload prompt.
    mockProbeRpcUrl.mockResolvedValueOnce({ success: false, reason: 'unreachable' })
    typeUrl('https://bad.example')
    await waitFor(() => expect(screen.getByTestId('rpc-save-button')).toBeEnabled())
    fireEvent.click(screen.getByTestId('rpc-save-button'))

    expect(await screen.findByText('section.rpc.errors.probe.unreachable')).toBeInTheDocument()
    expect(screen.getByTestId('rpc-reload-button')).toBeInTheDocument()
  })

  it('resets by clearing the active chain entry (leaving others intact)', async () => {
    const setUrls = vi.fn()
    mockUseLocalStorage.mockReturnValue([
      { [CHAIN_ID]: { url: 'https://stored.example', exclusive: false } },
      setUrls,
    ])

    render(<RpcSection />)

    const resetButton = screen.getByTestId('rpc-reset-button')
    expect(resetButton).toBeEnabled()
    fireEvent.click(resetButton)

    expect(
      applyLastUpdater(setUrls, {
        [CHAIN_ID]: { url: 'https://stored.example', exclusive: false },
        999: { url: 'https://other', exclusive: false },
      }),
    ).toEqual({ 999: { url: 'https://other', exclusive: false } })
    expect(await screen.findByTestId('rpc-reload-button')).toBeInTheDocument()
  })
})
