import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { makeMockIntersectionObserver } from '../../../../../test/mock/makeMockIntersectionObserver'
import { CropComponent } from './HeaderCrop'

makeMockIntersectionObserver()

const mockHandleCancel = vi.fn()
const mockSetDataURL = vi.fn()

// Create a simple 100x100 image for testing
const createTestImage = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 100
  canvas.height = 100
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, 100, 100)

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], 'test.png', { type: 'image/png' }))
      }
    })
  })
}

describe('<CropComponent /> - Zoom Functionality', () => {
  beforeAll(() => {
    URL.createObjectURL = vi.fn(() => 'https://localhost/test.png')
  })

  it('renders the crop component with zoom slider', async () => {
    const mockFile = await createTestImage()
    render(
      <CropComponent header={mockFile} handleCancel={mockHandleCancel} setDataURL={mockSetDataURL} />
    )

    expect(screen.getByTestId('edit-image-container')).toBeVisible()

    // Check if slider is present
    const slider = screen.getByLabelText('zoom')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('min', '100')
    expect(slider).toHaveAttribute('max', '200')
  })

  it('changes zoom value when slider is moved', async () => {
    const mockFile = await createTestImage()
    render(
      <CropComponent header={mockFile} handleCancel={mockHandleCancel} setDataURL={mockSetDataURL} />
    )

    const slider = screen.getByLabelText('zoom') as HTMLInputElement

    // Initial value should be 100
    expect(slider.value).toBe('100')

    // Change zoom to 150
    fireEvent.change(slider, { target: { value: '150' } })

    await waitFor(() => {
      expect(slider.value).toBe('150')
    })
  })

  it('handles zoom to maximum value', async () => {
    const mockFile = await createTestImage()
    render(
      <CropComponent header={mockFile} handleCancel={mockHandleCancel} setDataURL={mockSetDataURL} />
    )

    const slider = screen.getByLabelText('zoom') as HTMLInputElement

    // Change zoom to max (200)
    fireEvent.change(slider, { target: { value: '200' } })

    await waitFor(() => {
      expect(slider.value).toBe('200')
    })
  })

  it('calls handleCancel when cancel button is clicked', async () => {
    const mockFile = await createTestImage()
    render(
      <CropComponent header={mockFile} handleCancel={mockHandleCancel} setDataURL={mockSetDataURL} />
    )

    const cancelButton = screen.getByTestId('header-cancel-button')
    fireEvent.click(cancelButton)

    expect(mockHandleCancel).toHaveBeenCalled()
  })

  it('calls setDataURL when continue button is clicked', async () => {
    const mockFile = await createTestImage()
    mockSetDataURL.mockClear()

    render(
      <CropComponent header={mockFile} handleCancel={mockHandleCancel} setDataURL={mockSetDataURL} />
    )

    // Wait for canvas to be in the document
    await waitFor(() => {
      const canvas = document.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
    }, { timeout: 3000 })

    const continueButton = screen.getByTestId('continue-button')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(mockSetDataURL).toHaveBeenCalled()
      const dataURL = mockSetDataURL.mock.calls[0][0]
      expect(dataURL).toMatch(/^data:image\/jpeg;base64,/)
    })
  })
})
