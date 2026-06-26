import { act, fireEvent, render, screen } from '@app/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { imageUrlReturnsImage } from '@app/validators/validateImageUrl'

import { makeMockIntersectionObserver } from '../../../../../test/mock/makeMockIntersectionObserver'
import { AvatarManual } from './AvatarManual'

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
const VALID_URL = 'https://example.com/avatar.png'
const OTHER_VALID_URL = 'https://example.com/other.png'

const typeUri = (value: string) =>
  fireEvent.change(screen.getByTestId('avatar-uri-input'), { target: { value } })

const advanceDebounce = async () => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(450)
  })
}

describe('<AvatarManual />', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockImageUrlReturnsImage.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows an inline error and disables Confirm when the URL does not return an image', async () => {
    mockImageUrlReturnsImage.mockResolvedValue(false)

    render(<AvatarManual {...props} />)
    typeUri(VALID_URL)

    // Indicator appears immediately while the async check is in flight.
    expect(screen.getByTestId('avatar-uri-validating')).toBeVisible()

    await advanceDebounce()

    expect(screen.getByText(NOT_AN_IMAGE_ERROR)).toBeVisible()
    expect(screen.getByTestId('avatar-manual-submit')).toBeDisabled()
    expect(screen.queryByTestId('avatar-uri-validating')).not.toBeInTheDocument()
  })

  it('clears the error and enables Confirm when the URL returns an image', async () => {
    mockImageUrlReturnsImage.mockResolvedValue(true)

    render(<AvatarManual {...props} />)
    typeUri(VALID_URL)

    await advanceDebounce()

    expect(screen.queryByText(NOT_AN_IMAGE_ERROR)).not.toBeInTheDocument()
    expect(screen.getByTestId('avatar-manual-submit')).toBeEnabled()
  })

  it('shows the validating indicator while the check is in flight and hides it after', async () => {
    mockImageUrlReturnsImage.mockResolvedValue(true)

    render(<AvatarManual {...props} />)
    typeUri(VALID_URL)

    expect(screen.getByTestId('avatar-uri-validating')).toBeVisible()
    // Confirm stays disabled while validating, even before the result is known.
    expect(screen.getByTestId('avatar-manual-submit')).toBeDisabled()

    await advanceDebounce()

    expect(screen.queryByTestId('avatar-uri-validating')).not.toBeInTheDocument()
  })

  it('immediately shows a format error without running the async check for an invalid URL', async () => {
    render(<AvatarManual {...props} />)
    typeUri('not-a-url')

    expect(screen.getByText('Image URL must be a valid URL')).toBeVisible()
    expect(screen.queryByTestId('avatar-uri-validating')).not.toBeInTheDocument()
    expect(screen.getByTestId('avatar-manual-submit')).toBeDisabled()
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

    render(<AvatarManual {...props} />)

    // Type the first URL and let its debounced check start (now awaiting).
    typeUri(VALID_URL)
    await advanceDebounce()

    // Before the first check resolves, type a different valid URL.
    typeUri(OTHER_VALID_URL)

    // The first (now stale) check resolves false — it must not surface an error.
    await act(async () => {
      resolveFirst(false)
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(screen.queryByText(NOT_AN_IMAGE_ERROR)).not.toBeInTheDocument()

    // The current value's check resolves true and is applied.
    await advanceDebounce()
    expect(screen.queryByText(NOT_AN_IMAGE_ERROR)).not.toBeInTheDocument()
    expect(screen.getByTestId('avatar-manual-submit')).toBeEnabled()
  })
})
