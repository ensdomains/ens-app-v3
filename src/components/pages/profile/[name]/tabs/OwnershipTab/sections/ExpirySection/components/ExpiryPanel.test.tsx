import { render, screen } from "@app/test-utils"
import { ExpiryPanel } from "./ExpiryPanel"

describe('ExpiryPanel', () => {
  it('should render', async () => {
    render(<ExpiryPanel type="expiry" date={new Date(3255803954000)}/>)
    expect(screen.getByTestId('expiry-panel-expiry')).toHaveTextContent(/Mar (2|3|4), 2073/)
  })

  it('should not throw error if date object is corrupted', async () => {
    render(<ExpiryPanel type="expiry" date={'3255803954000' as any}/>)
    expect(screen.getByTestId('expiry-panel-expiry')).toHaveTextContent(/Mar (2|3|4), 2073/)
  })
})