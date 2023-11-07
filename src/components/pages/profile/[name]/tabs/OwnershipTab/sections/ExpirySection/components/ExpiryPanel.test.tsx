import { render, screen, userEvent } from "@app/test-utils"
import { ExpiryPanel } from "./ExpiryPanel"

jest.mock('@ensdomains/thorin2', () => {
  const _thorin = jest.requireActual('@ensdomains/thorin2')
  return {
  _esModule: true,
  ..._thorin,
  QuestionCircleSVG: () => <div>ICON</div>
}})

describe('ExpiryPanel', () => {
  it('should render', async () => {
    render(<ExpiryPanel type="expiry" date={new Date(3255803954000)}/>)
    expect(screen.getByTestId('expiry-panel-expiry')).toHaveTextContent(/Mar (2|3|4), 2073/)
  })

  it('should not throw error if date object is corrupted', async () => {
    render(<ExpiryPanel type="expiry" date={'3255803954000' as any}/>)
    expect(screen.getByTestId('expiry-panel-expiry')).toHaveTextContent(/Mar (2|3|4), 2073/)
  })

  it('should not display link only if link is provided', async () => {
    const {rerender} = render(<ExpiryPanel type="expiry" date={new Date(3255803954000)} link="https://app.ens.domains"/>)
    expect(screen.getByText('action.view')).toBeVisible()
    rerender(<ExpiryPanel type="expiry" date={new Date(3255803954000)}/>)
    expect(screen.queryByText('action.view')).toEqual(null)
  })

  it('should not display tooltip only if tooltip is provided', async () => {
    const {rerender} = render(<ExpiryPanel type="expiry" date={new Date(3255803954000)} tooltip={'TOOLTIP'}/>)
    expect(screen.getByText('ICON')).toBeVisible()
    expect(screen.queryByText('TOOLTIP')).toEqual(null)
    await userEvent.hover(screen.getByText('ICON'))
    expect(screen.getByText('TOOLTIP')).toBeVisible()
    rerender(<ExpiryPanel type="expiry" date={new Date(3255803954000)}/>)
    expect(screen.queryByText('ICON')).toEqual(null)
    expect(screen.queryByText('TOOLTIP')).toEqual(null)
  })
})