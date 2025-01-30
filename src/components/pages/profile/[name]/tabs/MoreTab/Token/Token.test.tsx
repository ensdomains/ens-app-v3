import { mockFunction, render, screen } from '@app/test-utils'

import { makeMockUseWrapperDataData } from '@root/test/mock/makeMockUseWrapperDataData.ts'
import { labelhash, namehash } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import { useChainName } from '@app/hooks/chain/useChainName'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useParentBasicName } from '@app/hooks/useParentBasicName'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import Token from './Token'

vi.mock('@app/hooks/useParentBasicName')
vi.mock('@app/hooks/chain/useChainName')
vi.mock('@app/hooks/chain/useContractAddress')
vi.mock('@app/utils/BreakpointProvider')

vi.mock('./WrapButton', () => ({ default: () => <div data-testid="wrap-button" /> }))
vi.mock('./UnwrapButton', () => ({ default: () => <div data-testid="unwrap-button" /> }))

const mockUseChainName = mockFunction(useChainName)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseParentBasicName = mockFunction(useParentBasicName)

mockUseChainName.mockReturnValue('mainnet')
// @ts-ignore
mockUseContractAddress.mockImplementation(({ contract }) => {
  if (contract === 'ensNameWrapper') return 'wrapped' as unknown as `0x${string}`
  return 'unwrapped' as unknown as `0x${string}`
})
mockUseBreakpoint.mockReturnValue({ sm: true, md: true, lg: true })
mockUseParentBasicName.mockImplementation(() => {
  return {}
})

describe('Token', () => {
  describe('tokenids', () => {
    it('should not show tokenid section for unwrapped non .eth 2ld', () => {
      const name = 'sub.nick.eth'
      render(<Token {...({ name, isWrapped: false } as any)} />)
      expect(screen.queryByTestId('token-ids')).not.toBeInTheDocument()
    })
    it('should show correct decimal and hex for unwrapped .eth 2ld', () => {
      const name = 'nick.eth'
      const label = 'nick'
      const labelHash = labelhash(label)
      const tokenId = BigInt(labelHash).toString(10)

      render(<Token {...({ name, isWrapped: false } as any)} />)
      expect(screen.getByText(labelHash)).toBeVisible()
      expect(screen.getByText(tokenId)).toBeVisible()
    })
    it('should show correct decimal and hex for wrapped .eth 2ld name', () => {
      const name = 'nick.eth'
      const hexId = namehash(name)
      const decId = BigInt(hexId).toString(10)

      render(
        <Token
          {...({
            name,
            isWrapped: true,
            wrapperData: makeMockUseWrapperDataData('wrapped'),
          } as any)}
        />,
      )
      expect(screen.getByText(hexId)).toBeVisible()
      expect(screen.getByText(decId)).toBeVisible()
    })
    it('should show correct decimal and hex for wrapped other name', () => {
      const name = 'sub.nick.eth'
      const hexId = namehash(name)
      const decId = BigInt(hexId).toString(10)

      render(
        <Token
          {...({
            name,
            isWrapped: true,
            wrapperData: makeMockUseWrapperDataData('wrapped'),
          } as any)}
        />,
      )
      expect(screen.getByText(hexId)).toBeVisible()
      expect(screen.getByText(decId)).toBeVisible()
    })
  })
  describe('etherscan link', () => {
    it('should not show any link for unwrapped non .eth 2ld', () => {
      const name = 'sub.nick.eth'
      render(<Token {...({ name, isWrapped: false } as any)} />)
      expect(screen.queryByTestId('etherscan-nft-link')).not.toBeInTheDocument()
    })
    it('should show correct link for unwrapped .eth 2ld', () => {
      const name = 'nick.eth'
      const label = 'nick'
      const labelHash = labelhash(label)
      const tokenId = BigInt(labelHash).toString(10)

      render(<Token {...({ name, isWrapped: false } as any)} />)
      expect(screen.getByTestId('etherscan-nft-link')).toHaveAttribute(
        'href',
        `https://etherscan.io/nft/unwrapped/${tokenId}`,
      )
    })
    it('should show correct link for wrapped .eth 2ld', () => {
      const name = 'nick.eth'
      const hexId = namehash(name)
      const decId = BigInt(hexId).toString(10)

      render(
        <Token
          {...({
            name,
            isWrapped: true,
            wrapperData: makeMockUseWrapperDataData('wrapped'),
          } as any)}
        />,
      )
      expect(screen.getByTestId('etherscan-nft-link')).toHaveAttribute(
        'href',
        `https://etherscan.io/nft/wrapped/${decId}`,
      )
    })
    it('should show correct link for wrapped other', () => {
      const name = 'sub.nick.eth'
      const hexId = namehash(name)
      const decId = BigInt(hexId).toString(10)

      render(
        <Token
          {...({
            name,
            isWrapped: true,
            wrapperData: makeMockUseWrapperDataData('wrapped'),
          } as any)}
        />,
      )
      expect(screen.getByTestId('etherscan-nft-link')).toHaveAttribute(
        'href',
        `https://etherscan.io/nft/wrapped/${decId}`,
      )
    })
  })
})
