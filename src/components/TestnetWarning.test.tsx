import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'
import { holesky, mainnet } from 'wagmi/chains'

import { TestnetWarning } from './TestnetWarning'

vi.mock('wagmi')

const mockUseAccount = mockFunction(useAccount)

describe('TestnetWarning', () => {
  it('renders if testnet is used', async () => {
    mockUseAccount.mockReturnValue({ chain: holesky })

    render(<TestnetWarning />)

    expect(
      screen.getByText(`You are viewing the ENS app on ${holesky.name} testnet.`),
    ).toBeVisible()
  })
  it('renders nothing if on mainnet', async () => {
    mockUseAccount.mockReturnValue({ chain: mainnet })

    const { container } = render(<TestnetWarning />)

    expect(container).not.toHaveTextContent(
      `You are viewing the ENS app on ${mainnet.name} testnet.`,
    )
  })
})
