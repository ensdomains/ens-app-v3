import { cleanup, fireEvent, render, screen, userEvent } from '@app/test-utils'

import { waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AddRecordButton } from './AddRecordButton'

const mockHandleAddRecord = vi.fn()

window.HTMLElement.prototype.scrollIntoView = () => {}

const options = [
  {
    value: 'test',
    label: 'test',
  },
  {
    value: 'test2',
    label: 'test2',
  },
  {
    value: 'anotherTest',
    label: 'anotherTest',
  },
  {
    value: 'anotherTest2',
    label: 'anotherTest2',
  },
]

describe('AddRecordButton', () => {
  beforeEach(() => {})

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should render', async () => {
    render(<AddRecordButton />)
  })

  it('should display options on click', async () => {
    render(<AddRecordButton options={options} onAddRecord={mockHandleAddRecord} />)
    fireEvent.click(screen.getByTestId('add-record-button-button'))
    await screen.findByTestId('add-record-button-controls')
    await waitFor(() => {
      expect(screen.getByTestId('add-record-button-option-test')).toBeVisible()
      expect(screen.getByTestId('add-record-button-option-test2')).toBeVisible()
      expect(screen.getByTestId('add-record-button-option-anotherTest')).toBeVisible()
      expect(screen.getByTestId('add-record-button-option-anotherTest2')).toBeVisible()
    })
  })

  it('should call onAddRecord when option is selected', async () => {
    render(<AddRecordButton options={options} onAddRecord={mockHandleAddRecord} />)
    fireEvent.click(screen.getByTestId('add-record-button-button'))
    await screen.findByTestId('add-record-button-controls')
    const option = await screen.findByTestId('add-record-button-option-test')
    fireEvent.click(option)
    expect(mockHandleAddRecord).toHaveBeenCalledWith('test')
  })

  it('should be searchable when autocomplete is set to true', async () => {
    render(<AddRecordButton autocomplete options={options} onAddRecord={mockHandleAddRecord} />)
    fireEvent.click(screen.getByTestId('add-record-button-button'))
    await screen.findByTestId('add-record-button-controls')
    const input = await screen.findByTestId('add-record-button-input')
    await userEvent.type(input, 'another')
    await waitFor(() => {
      expect(screen.queryByTestId('add-record-button-option-test')).toBe(null)
      expect(screen.queryByTestId('add-record-button-option-test2')).toBe(null)
      expect(screen.getByTestId('add-record-button-option-anotherTest')).toBeVisible()
      expect(screen.getByTestId('add-record-button-option-anotherTest2')).toBeVisible()
    })
  })

  it('should show clear button when input has content', async () => {
    render(<AddRecordButton autocomplete options={options} onAddRecord={mockHandleAddRecord} />)
    fireEvent.click(screen.getByTestId('add-record-button-button'))
    const input = await screen.findByTestId('add-record-button-input')
    const clearButton = screen.getByTestId('input-action-button')

    await userEvent.type(input, 'another')
    expect(input).toHaveDisplayValue('another')

    fireEvent.click(clearButton)

    expect(screen.getByDisplayValue('')).toHaveAttribute('data-testid', 'add-record-button-input')
  })

  it('should call onAddRecord with input value when createable is set to true', async () => {
    render(<AddRecordButton createable onAddRecord={mockHandleAddRecord} />)

    fireEvent.click(screen.getByTestId('add-record-button-button'))

    const input = await screen.findByTestId('add-record-button-input')
    await userEvent.type(input, 'another')

    const submit = await screen.findByText('action.add')
    fireEvent.click(submit)

    expect(mockHandleAddRecord).toHaveBeenCalledWith('another')
  })

  it('should call onAddRecord with form safe input value', async () => {
    render(<AddRecordButton createable onAddRecord={mockHandleAddRecord} />)

    fireEvent.click(screen.getByTestId('add-record-button-button'))

    const input = await screen.findByTestId('add-record-button-input')
    await userEvent.type(input, 'com.example')

    const submit = await screen.findByText('action.add')
    fireEvent.click(submit)

    expect(mockHandleAddRecord).toHaveBeenCalledWith('com%2Eexample')
  })
})
