import { act, fireEvent, render, screen } from '@app/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { imageUrlReturnsImage } from '@app/validators/validateImageUrl'

import { makeMockIntersectionObserver } from '../../../../../test/mock/makeMockIntersectionObserver'
import { HeaderManual } from './HeaderManual'

vi.mock('@app/validators/validateImageUrl')

makeMockIntersectionObserver()

const mockImageUrlReturnsImage = vi.mocked(imageUrlReturnsImage)

const mockHandleCancel = vi.fn()
const mockHandleSubmit = vi.fn()

const props = {
  handleCancel: mockHandleCancel,
  handleSubmit: mockHandleSubmit,
}

const NOT_AN_IMAGE_ERROR = 'This URL does not return an image'
const VALID_URL = 'https://example.com/header.png'
const OTHER_VALID_URL = 'https://example.com/other-header.png'

// react-i18next is mocked in test-utils so `t(key)` returns the key.
const saveButton = () => screen.getByRole('button', { name: 'action.save' })

const typeUri = (value: string) =>
  fireEvent.change(screen.getByTestId('header-manual-input'), { target: { value } })

const advanceDebounce = async () => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(450)
  })
}

describe('<HeaderManual />', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockImageUrlReturnsImage.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows an inline error and disables Save when the URL does not return an image', async () => {
    mockImageUrlReturnsImage.mockResolvedValue(false)

    render(<HeaderManual {...props} />)
    typeUri(VALID_URL)

    expect(screen.getByTestId('header-manual-validating')).toBeVisible()

    await advanceDebounce()

    expect(screen.getByText(NOT_AN_IMAGE_ERROR)).toBeVisible()
    expect(saveButton()).toBeDisabled()
    expect(screen.queryByTestId('header-manual-validating')).not.toBeInTheDocument()
  })

  it('clears the error and enables Save when the URL returns an image', async () => {
    mockImageUrlReturnsImage.mockResolvedValue(true)

    render(<HeaderManual {...props} />)
    typeUri(VALID_URL)

    await advanceDebounce()

    expect(screen.queryByText(NOT_AN_IMAGE_ERROR)).not.toBeInTheDocument()
    expect(saveButton()).toBeEnabled()
  })

  it('shows the validating indicator while the check is in flight and hides it after', async () => {
    mockImageUrlReturnsImage.mockResolvedValue(true)

    render(<HeaderManual {...props} />)
    typeUri(VALID_URL)

    expect(screen.getByTestId('header-manual-validating')).toBeVisible()
    expect(saveButton()).toBeDisabled()

    await advanceDebounce()

    expect(screen.queryByTestId('header-manual-validating')).not.toBeInTheDocument()
  })

  it('immediately shows a format error without running the async check for an invalid URL', async () => {
    render(<HeaderManual {...props} />)
    typeUri('not-a-url')

    expect(screen.getByText('Image URL must be a valid URL')).toBeVisible()
    expect(screen.queryByTestId('header-manual-validating')).not.toBeInTheDocument()
    expect(saveButton()).toBeDisabled()
    expect(mockImageUrlReturnsImage).not.toHaveBeenCalled()
  })

  it('ignores a stale async result for a value that has since changed', async () => {
    let resolveFirst!: (value: boolean) => void
    const firstCheck = new Promise<boolean>((resolve) => {
      resolveFirst = resolve
    })
    mockImageUrlReturnsImage.mockImplementation((url) =>
      url === VALID_URL ? firstCheck : Promise.resolve(true),
    )

    render(<HeaderManual {...props} />)

    typeUri(VALID_URL)
    await advanceDebounce()

    typeUri(OTHER_VALID_URL)

    await act(async () => {
      resolveFirst(false)
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(screen.queryByText(NOT_AN_IMAGE_ERROR)).not.toBeInTheDocument()

    await advanceDebounce()
    expect(screen.queryByText(NOT_AN_IMAGE_ERROR)).not.toBeInTheDocument()
    expect(saveButton()).toBeEnabled()
  })
})
