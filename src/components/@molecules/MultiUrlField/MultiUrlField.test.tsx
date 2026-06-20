import { fireEvent, render, screen } from '@app/test-utils'

import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { MULTI_URL_FIELD_CAP, MultiUrlField } from './MultiUrlField'

describe('MultiUrlField', () => {
  const baseProps = {
    recordKey: 'simplex.contact',
    label: 'SimpleX contact',
    placeholder: 'https://…',
    onChange: vi.fn(),
  }

  it('renders one empty row when value is the empty list', () => {
    render(<MultiUrlField {...baseProps} value={[]} />)
    expect(screen.getByTestId('multi-url-field-simplex.contact-input-0')).toBeVisible()
    expect(
      screen.queryByTestId('multi-url-field-simplex.contact-input-1'),
    ).not.toBeInTheDocument()
  })

  it('renders one row per existing URL', () => {
    render(
      <MultiUrlField
        {...baseProps}
        value={['https://smp1.example.im/a#H1', 'https://smp2.example.im/a#H1']}
      />,
    )
    const row0 = screen.getByTestId('multi-url-field-simplex.contact-input-0') as HTMLInputElement
    const row1 = screen.getByTestId('multi-url-field-simplex.contact-input-1') as HTMLInputElement
    expect(row0.value).toBe('https://smp1.example.im/a#H1')
    expect(row1.value).toBe('https://smp2.example.im/a#H1')
  })

  // Multi-link is disabled while the cap is 1 (issue #11). These add-row tests
  // re-activate automatically once SIMPLEX_MAX_LINKS is bumped back to 5.
  it.skipIf(MULTI_URL_FIELD_CAP <= 1)('appends an empty row when "Add URL" is clicked, up to the cap', () => {
    const onChange = vi.fn()
    render(
      <MultiUrlField {...baseProps} onChange={onChange} value={['https://smp1.example.im/a#H1']} />,
    )
    const addButton = screen.getByTestId('multi-url-field-simplex.contact-add')
    fireEvent.click(addButton)
    // A newly-added empty row is dropped from the upstream onChange (parse
    // rule), but the row is rendered locally so the user can type into it.
    expect(
      screen.getByTestId('multi-url-field-simplex.contact-input-1'),
    ).toBeInTheDocument()
  })

  it.skipIf(MULTI_URL_FIELD_CAP <= 1)(
    'disables the add button once MULTI_URL_FIELD_CAP rows are present',
    () => {
      const value = Array.from(
        { length: MULTI_URL_FIELD_CAP },
        (_, i) => `https://smp${i + 1}.example.im/a#H1`,
      )
      render(<MultiUrlField {...baseProps} value={value} />)
      const addButton = screen.getByTestId(
        'multi-url-field-simplex.contact-add',
      ) as HTMLButtonElement
      expect(addButton).toBeDisabled()
      expect(screen.getByText(`${MULTI_URL_FIELD_CAP} of ${MULTI_URL_FIELD_CAP}`)).toBeVisible()
    },
  )

  // Single-link mode (issue #11): the "Add URL" row is hidden entirely.
  it.skipIf(MULTI_URL_FIELD_CAP > 1)('hides the add row in single-link mode', () => {
    render(<MultiUrlField {...baseProps} value={['https://smp1.example.im/a#H1']} />)
    expect(screen.queryByTestId('multi-url-field-simplex.contact-add')).not.toBeInTheDocument()
  })

  it('emits the trimmed/joined list upstream when a row is typed into', () => {
    const onChange = vi.fn()
    render(
      <MultiUrlField {...baseProps} onChange={onChange} value={['https://smp1.example.im/a#H1']} />,
    )
    const input1 = screen.getByTestId('multi-url-field-simplex.contact-input-0')
    fireEvent.change(input1, { target: { value: 'https://smp42.example.im/a#H42' } })
    expect(onChange).toHaveBeenLastCalledWith(['https://smp42.example.im/a#H42'])
  })

  it('removes a row when its trash button is clicked (with >1 rows)', () => {
    const onChange = vi.fn()
    render(
      <MultiUrlField
        {...baseProps}
        onChange={onChange}
        value={['https://smp1.example.im/a#H1', 'https://smp2.example.im/a#H1']}
      />,
    )
    const removeButton = screen.getByTestId('multi-url-field-simplex.contact-remove-0')
    fireEvent.click(removeButton)
    expect(onChange).toHaveBeenLastCalledWith(['https://smp2.example.im/a#H1'])
  })

  it('strips the separator typed into the input (preserves the on-chain separator)', () => {
    const onChange = vi.fn()
    render(
      <MultiUrlField {...baseProps} onChange={onChange} value={['https://smp1.example.im/a#H1']} />,
    )
    const input = screen.getByTestId('multi-url-field-simplex.contact-input-0')
    // A change event with the separator already in the value (e.g. paste) — it
    // must be stripped so the on-chain separator stays consistent.
    fireEvent.change(input, {
      target: { value: 'https://smp1.example.im/a#H1;https://smp2.example.im/a#H2' },
    })
    expect(onChange).toHaveBeenLastCalledWith([
      'https://smp1.example.im/a#H1https://smp2.example.im/a#H2',
    ])
  })

  // Regression: in the real app the parent calls `setValue` with the joined
  // CSV string, which is then re-parsed back into a `string[]` and pushed
  // down as the next `value` prop. Empty rows are dropped before being
  // joined, so the parent's value doesn't grow when the user clicks Add
  // URL on an already-filled row. The MultiUrlField must keep the empty
  // row visible across that re-render — otherwise Add URL appears to do
  // nothing.
  const ParentHarness = ({ initial }: { initial: string[] }) => {
    const [value, setValue] = useState(initial)
    return (
      <MultiUrlField
        recordKey="simplex.contact"
        label="SimpleX contact"
        value={value}
        onChange={(next) => setValue(next)}
      />
    )
  }

  it.skipIf(MULTI_URL_FIELD_CAP <= 1)(
    'keeps the new empty row visible after the parent re-binds the same value',
    () => {
      render(<ParentHarness initial={['https://smp1.example.im/a#H1']} />)
      fireEvent.click(screen.getByTestId('multi-url-field-simplex.contact-add'))
      expect(screen.getByTestId('multi-url-field-simplex.contact-input-1')).toBeVisible()
      // And a second click still works — three rows now.
      fireEvent.click(screen.getByTestId('multi-url-field-simplex.contact-add'))
      expect(screen.getByTestId('multi-url-field-simplex.contact-input-2')).toBeVisible()
    },
  )

  it('calls onDelete when the only row is removed', () => {
    const onChange = vi.fn()
    const onDelete = vi.fn()
    render(
      <MultiUrlField
        {...baseProps}
        onChange={onChange}
        onDelete={onDelete}
        value={['https://smp1.example.im/a#H1']}
      />,
    )
    const removeButton = screen.getByTestId('multi-url-field-simplex.contact-remove-0')
    fireEvent.click(removeButton)
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
  })
})
