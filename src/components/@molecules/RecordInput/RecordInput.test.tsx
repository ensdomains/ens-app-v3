import { fireEvent, render, screen } from '@app/test-utils'

import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import AddressEthereumSVG from '@app/assets/address/EthIcon.svg'

import { RecordInput } from './RecordInput'

const mockCallback = vi.fn()

describe('RecordInput', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should render', () => {
    render(<RecordInput value="hello world" />)
    expect(screen.getByTestId('record-input-input')).toBeVisible()
  })

  it('should display option data', () => {
    render(
      <RecordInput
        option={{
          label: 'test-label',
          value: 'test-value',
          prefix: <AddressEthereumSVG />,
        }}
      />,
    )
    const input = screen.getByTestId('record-input-test-label')
    expect(screen.getByText('test-label')).toBeVisible()

    const labelList = input.querySelectorAll('svg')
    const labels = Array.from(labelList)
    expect(labels.some((label) => /<svg/.test(label.outerHTML))).toBe(true)
  })

  it('should call onDelete when action button clicked', () => {
    render(<RecordInput onDelete={mockCallback} />)
    fireEvent.click(screen.getByTestId('record-input-delete-button'))
    expect(mockCallback).toHaveBeenCalled()
  })
})
