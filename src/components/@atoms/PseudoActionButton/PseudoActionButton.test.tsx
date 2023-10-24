import { act, render, screen, userEvent, waitFor} from '@app/test-utils'
import { PseudoActionButton } from './PseudoActionButton'

beforeAll(() => {
  jest.useFakeTimers()
})

afterAll(() => {
  jest.useRealTimers()
})

describe('PseudoActionButton', () => {
  it('should show loading state when clicked and reset after timeout has been run', async () => {
    const testIcon = <div data-testid="icon"/>
    render(<PseudoActionButton prefix={testIcon} timeout={500}>Test</PseudoActionButton>)
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime})
    const button = screen.getByRole('button', { name: /Test/i })
    const icon = screen.getByTestId('icon')
    expect(icon).toBeVisible()
    await user.click(button)
    expect(icon).not.toBeVisible()
    act(() => {
      jest.runAllTimers()
    })
    await waitFor(() => {
      expect(screen.getByTestId('icon')).toBeVisible()
    })
  })

  it('should maintain loading state if loading is set to true', async () => {
    const testIcon = <div data-testid="icon"/>
    render(<PseudoActionButton loading prefix={testIcon} timeout={500}>Test</PseudoActionButton>)
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime})
    const button = screen.getByRole('button', { name: /Test/i })
    expect(screen.queryByTestId('icon')).toEqual(null)
    await user.click(button)
    expect(screen.queryByTestId('icon')).toEqual(null)
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.queryByTestId('icon')).toEqual(null)
  })
})