import '@app/test-utils'

import { render, screen } from '@app/test-utils'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

import { TimezonePicker } from './TimezonePicker'

const Wrapper = ({ value }: { value: string }) => {
  const { control } = useForm<ProfileEditorForm>({
    defaultValues: {
      records: [{ key: 'timezone', group: 'general', type: 'text', value }],
    },
  })
  return (
    <TimezonePicker
      control={control}
      index={0}
      label="Timezone"
      placeholder="Search for a timezone"
    />
  )
}

describe('TimezonePicker', () => {
  it('renders a searchable select, not a free-text record input', () => {
    render(<Wrapper value="" />)

    expect(screen.getByTestId('profile-record-input-timezone')).toBeInTheDocument()
    // thorin Select renders a select-container; the plain text record input does not.
    expect(screen.getByTestId('select-container')).toBeInTheDocument()
    expect(
      screen.queryByTestId('profile-record-input-input-timezone'),
    ).not.toBeInTheDocument()
  })

  it('renders a delete control so the record can be cleared', () => {
    render(<Wrapper value="Asia/Tokyo" />)

    expect(
      screen.getByTestId('profile-record-input-timezone-delete-button'),
    ).toBeInTheDocument()
  })
})
