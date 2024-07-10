import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'

import { TestnetWarning } from './TestnetWarning'

vi.mock('wagmi')

const mockUseAccount = mockFunction(useAccount)

describe('TestnetWarning', () => {
  it('renders if testnet is used', async () => {
    mockUseAccount.mockReturnValue({ chain: goerli })

    render(<TestnetWarning />)

    expect(screen.getByText(`You are viewing the UNS app on ${goerli.name} testnet.`)).toBeVisible()
  })
  it('renders nothing if on mainnet', async () => {
    mockUseAccount.mockReturnValue({ chain: mainnet })

    const { container } = render(<TestnetWarning />)

    expect(container).not.toHaveTextContent(
      `You are viewing the UNS app on ${mainnet.name} testnet.`,
    )
  })
})
