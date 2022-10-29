import { cleanup, render } from '@app/test-utils'

import NFTTemplate from './NFTTemplate'

describe('NFTTemplate', () => {
  beforeEach(() => {})

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render', async () => {
    render(<NFTTemplate name="nick.eth" backgroundImage={undefined} isNormalised />)
    // expect(screen.getByText('nick.eth')).toBeInTheDocument();
  })
})
