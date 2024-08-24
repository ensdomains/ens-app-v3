import { render, screen } from '@app/test-utils'
import { makeMockUseWrapperDataData } from '@root/test/mock/makeMockUseWrapperDataData.ts'
import { describe, expect, it, vi } from 'vitest'
import { NameWrapper } from './NameWrapper'


vi.mock('./Token/WrapButton', () => ({ default: () => <div data-testid="wrap-button" /> }))
vi.mock('./Token/UnwrapButton', () => ({ default: () => <div data-testid="unwrap-button" /> }))

describe('NameWrapper', () => {
  it('should show wrapped status for unwrapped name', () => {
    const name = 'nick.eth'
    render(
      <NameWrapper {...({ name, isWrapped: false, wrapperData: makeMockUseWrapperDataData() } as any)} />,
    )
    expect(screen.getByTestId('namewrapper-status')).toHaveTextContent(
      'tabs.more.token.status.unwrapped',
    )
  })
  it('should show wrapped status for wrapped name', () => {
    const name = 'nick.eth'
    render(
      <NameWrapper
        {...({ name, isWrapped: true, wrapperData: makeMockUseWrapperDataData('wrapped') } as any)}
         ownerData={{
          owner:'0xaaa'
        }}
      />,
    )
    expect(screen.getByTestId('namewrapper-status')).toHaveTextContent(
      'tabs.more.token.status.wrapped',
    )
  })
  it('should show wrap button if unwrapped', () => {
    const name = 'nick.eth'
    render(<NameWrapper address="0xaaa" {...({ name, isWrapped: false } as any)}  ownerData={{
      owner:'0xaaa'
    }} />)
    expect(screen.getByTestId('wrap-button')).toBeVisible()
  })
  it('should show unwrap button if wrapped', () => {
    const name = 'nick.eth'
    render(
      <NameWrapper
      isWrapped
      
      address={'0xaaa'}
        {...({ name, isWrapped: true, wrapperData: makeMockUseWrapperDataData('wrapped') } as any)}
        ownerData={{
          owner:'0xaaa',
          ownershipLevel:'nameWrapper'
        }}
      />,
    )
    expect(screen.getByTestId('unwrap-button')).toBeVisible()
  })
})