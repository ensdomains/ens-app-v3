import { fireEvent, render, screen } from '@app/test-utils'

import { cleanup } from '@testing-library/react'

import AddressEthereumSVG from '@app/assets/address/AddressEthereum.svg'

import { RecordInput } from './RecordInput'

const mockCallback = jest.fn()

describe('RecordInput', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render', () => {
    render(<RecordInput />)
    expect(screen.getByTestId('record-input-input')).toBeVisible()
    expect(screen.getByTestId('record-input-delete')).toBeVisible()
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

    const labelList = input.querySelectorAll('label')
    const labels = Array.from(labelList)
    expect(labels.some((label) => /<svg/.test(label.innerHTML))).toBe(true)
  })

  it('should call onDelete when delete button clicked', () => {
    render(<RecordInput onDelete={mockCallback} />)
    fireEvent.click(screen.getByTestId('record-input-delete'))
    expect(mockCallback).toHaveBeenCalled()
  })

  it('should hide delete button if deleteable is set to false', () => {
    render(<RecordInput onDelete={mockCallback} deletable={false} />)
    expect(screen.queryByTestId('record-input-delete')).toBe(null)
  })
})
