import { render, screen, userEvent } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { QuestionTooltip } from './QuestionTooltip'

describe('QuestionTooltip', () => {
  it('should render and show tooltip', async () => {
    render(<QuestionTooltip content="CONTENT" />)
    await userEvent.hover(screen.getByTestId('question-icon'))
    expect(screen.getByText('CONTENT')).toBeVisible()
    expect(screen.queryByText('action.learnMore')).toEqual(null)
  })

  it('should render and show tooltip with link', async () => {
    render(<QuestionTooltip content="CONTENT" link="https://google.com" />)
    await userEvent.hover(screen.getByTestId('question-icon'))
    expect(screen.getByText('CONTENT')).toBeVisible()
    expect(screen.getByText('action.learnMore')).toBeVisible()
  })
})
