import { cleanup, render, waitFor } from '@app/test-utils'

import NFTTemplate from './NFTTemplate'

describe('NFTTemplate', () => {
  beforeEach(() => {
    global.FontFace = jest.fn().mockReturnValue({ loaded: true })
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render', async () => {
    const { getByText } = render(
      <NFTTemplate name="nick.eth" backgroundImage={undefined} isNormalised />,
    )
    expect(getByText('nick.eth')).toBeInTheDocument()
  })

  it('should render with background', async () => {
    const whiteBG =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg=='
    const { getByText, getByTestId } = render(
      <NFTTemplate name="validator.eth" backgroundImage={whiteBG} isNormalised />,
    )
    expect(getByText('validator.eth')).toBeInTheDocument()
    expect(getByTestId('nft-back-img')).toBeInTheDocument()
  })

  it('should render with subdomain', async () => {
    const { getByText } = render(
      <NFTTemplate name="itsasubdomain.khori.eth" backgroundImage={undefined} isNormalised />,
    )
    expect(getByText('itsasubdomain.')).toBeInTheDocument()
  })

  it('should render domain with more than 25 chars', async () => {
    const { getByText } = render(
      <NFTTemplate
        name="thisnameislongerthan25char.eth"
        backgroundImage={undefined}
        isNormalised
      />,
    )
    expect(getByText('thisnameislonge')).toBeInTheDocument()
    expect(getByText('rthan25char.eth')).toBeInTheDocument()
  })

  it('should use polyfill of Intl.Segmenter if browser does not support', async () => {
    ;(window.Intl.Segmenter as typeof Intl['Segmenter']) = undefined as any
    const { getByText } = render(
      <NFTTemplate name="alisha.eth" backgroundImage={undefined} isNormalised />,
    )
    await waitFor(() => expect(getByText('alisha.eth')).toBeInTheDocument())
    expect(getByText('alisha.eth')).toBeInTheDocument()
  })
})
