import { mockFunction, render, screen } from '@app/test-utils'

import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { useFusesStates } from '@app/hooks/fuses/useFusesStates'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import Token from './Token'

jest.mock('@app/hooks/useContractAddress')
jest.mock('@app/hooks/fuses/useFusesStates')
jest.mock('@app/utils/BreakpointProvider')

jest.mock('./WrapButton', () => () => <div data-testid="wrap-button" />)
jest.mock('./UnwrapButton', () => () => <div data-testid="unwrap-button" />)

const mockUseFusesStates = mockFunction(useFusesStates)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseBreakpoint = mockFunction(useBreakpoint)

mockUseContractAddress.mockImplementation((contractName) => {
  if (contractName === 'NameWrapper') return 'wrapped'
  return 'unwrapped'
})
mockUseBreakpoint.mockReturnValue({ sm: true, md: true, lg: true })

describe('Token', () => {
  it('should show wrapped status for unwrapped name', () => {
    mockUseFusesStates.mockReturnValue({
      state: 'unwrapped',
    })
    const name = 'nick.eth'
    render(<Token {...({ name, isWrapped: false } as any)} />)
    expect(screen.getByTestId('name-details-text-tabs.more.token.wrapper')).toHaveTextContent(
      'tabs.more.token.status.unwrapped',
    )
  })
  it('should show wrapped status for wrapped name', () => {
    mockUseFusesStates.mockReturnValue({
      state: 'wrapped',
    })
    const name = 'nick.eth'
    render(<Token {...({ name, isWrapped: true } as any)} />)
    expect(screen.getByTestId('name-details-text-tabs.more.token.wrapper')).toHaveTextContent(
      'tabs.more.token.status.wrapped',
    )
  })
  it('should show wrapped status for emancipated name', () => {
    mockUseFusesStates.mockReturnValue({
      state: 'emancipated',
    })
    const name = 'nick.eth'
    render(<Token {...({ name, isWrapped: true } as any)} />)
    expect(screen.getByTestId('name-details-text-tabs.more.token.wrapper')).toHaveTextContent(
      'tabs.more.token.status.emancipated',
    )
  })
  it('should show wrapped status for locked name', () => {
    mockUseFusesStates.mockReturnValue({
      state: 'locked',
    })
    const name = 'nick.eth'
    render(<Token {...({ name, isWrapped: true } as any)} />)
    expect(screen.getByTestId('name-details-text-tabs.more.token.wrapper')).toHaveTextContent(
      'tabs.more.token.status.locked',
    )
  })
  it('should show wrap button if unwrapped', () => {
    mockUseFusesStates.mockReturnValue({
      state: 'unwrapped',
    })
    const name = 'nick.eth'
    render(<Token {...({ name, isWrapped: false } as any)} />)
    expect(screen.getByTestId('wrap-button')).toBeVisible()
  })
  it('should show unwrap button if wrapped', () => {
    mockUseFusesStates.mockReturnValue({
      state: 'wrapped',
    })
    const name = 'nick.eth'
    render(<Token {...({ name, isWrapped: true } as any)} />)
    expect(screen.getByTestId('unwrap-button')).toBeVisible()
  })
  describe('tokenids', () => {
    it('should not show tokenid section for unwrapped non .eth 2ld', () => {
      mockUseFusesStates.mockReturnValue({
        state: 'unwrapped',
      })
      const name = 'sub.nick.eth'
      render(<Token {...({ name, isWrapped: false } as any)} />)
      expect(screen.queryByTestId('token-ids')).not.toBeInTheDocument()
    })
    it('should show correct decimal and hex for unwrapped .eth 2ld', () => {
      mockUseFusesStates.mockReturnValue({
        state: 'unwrapped',
      })
      const name = 'nick.eth'
      const label = 'nick'
      const labelHash = labelhash(label)
      const tokenId = BigNumber.from(labelHash).toString()

      render(<Token {...({ name, isWrapped: false } as any)} />)
      expect(screen.getByText(labelHash)).toBeVisible()
      expect(screen.getByText(tokenId)).toBeVisible()
    })
    it('should show correct decimal and hex for wrapped .eth 2ld name', () => {
      mockUseFusesStates.mockReturnValue({
        state: 'wrapped',
      })
      const name = 'nick.eth'
      const hexId = namehash(name)
      const decId = BigNumber.from(hexId).toString()

      render(<Token {...({ name, isWrapped: true } as any)} />)
      expect(screen.getByText(hexId)).toBeVisible()
      expect(screen.getByText(decId)).toBeVisible()
    })
    it('should show correct decimal and hex for wrapped other name', () => {
      mockUseFusesStates.mockReturnValue({
        state: 'wrapped',
      })
      const name = 'sub.nick.eth'
      const hexId = namehash(name)
      const decId = BigNumber.from(hexId).toString()

      render(<Token {...({ name, isWrapped: true } as any)} />)
      expect(screen.getByText(hexId)).toBeVisible()
      expect(screen.getByText(decId)).toBeVisible()
    })
  })
  describe('etherscan link', () => {
    it('should not show any link for unwrapped non .eth 2ld', () => {
      mockUseFusesStates.mockReturnValue({
        state: 'unwrapped',
      })
      const name = 'sub.nick.eth'
      render(<Token {...({ name, isWrapped: false } as any)} />)
      expect(screen.queryByTestId('etherscan-nft-link')).not.toBeInTheDocument()
    })
    it('should show correct link for unwrapped .eth 2ld', () => {
      mockUseFusesStates.mockReturnValue({
        state: 'unwrapped',
      })
      const name = 'nick.eth'
      const label = 'nick'
      const labelHash = labelhash(label)
      const tokenId = BigNumber.from(labelHash).toString()

      render(<Token {...({ name, isWrapped: false } as any)} />)
      expect(screen.getByTestId('etherscan-nft-link')).toHaveAttribute(
        'href',
        `https://etherscan.io/nft/unwrapped/${tokenId}`,
      )
    })
    it('should show correct link for wrapped .eth 2ld', () => {
      mockUseFusesStates.mockReturnValue({
        state: 'wrapped',
      })
      const name = 'nick.eth'
      const hexId = namehash(name)
      const decId = BigNumber.from(hexId).toString()

      render(<Token {...({ name, isWrapped: true } as any)} />)
      expect(screen.getByTestId('etherscan-nft-link')).toHaveAttribute(
        'href',
        `https://etherscan.io/nft/wrapped/${decId}`,
      )
    })
    it('should show correct link for wrapped other', () => {
      mockUseFusesStates.mockReturnValue({
        state: 'wrapped',
      })
      const name = 'sub.nick.eth'
      const hexId = namehash(name)
      const decId = BigNumber.from(hexId).toString()

      render(<Token {...({ name, isWrapped: true } as any)} />)
      expect(screen.getByTestId('etherscan-nft-link')).toHaveAttribute(
        'href',
        `https://etherscan.io/nft/wrapped/${decId}`,
      )
    })
  })
})
