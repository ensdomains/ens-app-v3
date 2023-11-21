import { render, screen} from '@app/test-utils'
import { ContractSection } from './ContractSection'
import { BreakpointProvider, useBreakpoint } from '@app/utils/BreakpointProvider';

jest.mock('@app/hooks/useContractAddress', () => ({
  useContractAddress: () => '0xnamewrapper'
}))

jest.mock('@app/utils/BreakpointProvider', () => ({
  useBreakpoint: () => ({
  xs: true,
  sm: true,
  md: true,
  lg: false,
  xl: false,
  })
}))

describe('ContractSection', () => {
  it('should display if details.isWrapped is true', async () => {
    render(<ContractSection details={{ isWrapped: true} as any} />)
    expect(screen.getByText('0xnamewrapper')).toBeVisible()
  })

  it('should not display if details.isWrapped is false', async () => {
    render(<ContractSection details={{ isWrapped: false } as any} />)
    expect(screen.queryByText('0xnamewrapper')).toEqual(null)
  })
})