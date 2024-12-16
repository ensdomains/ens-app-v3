import { render, screen, userEvent } from '@app/test-utils'

import { ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { encodeLabelhash } from '@ensdomains/ensjs/utils'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'
import UnknownLabels from './UnknownLabels-flow'

const mockDispatch = vi.fn()
const mockOnDismiss = vi.fn()

const labels = {
  test: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
  sub: '0xfa1ea47215815692a5f1391cff19abbaf694c82fb2151a4c351b6c0eeaaf317b',
}

const encodeLabel = (str: string) => {
  try {
    return encodeLabelhash(str)
  } catch {
    return str
  }
}

const renderHelper = (data: Omit<ComponentProps<typeof UnknownLabels>['data'], 'key'>) => {
  const newData = {
    ...data,
    key: 'test',
    name: data.name
      .split('.')
      .map((label) => encodeLabel(label))
      .join('.'),
  }
  return render(<UnknownLabels data={newData} dispatch={mockDispatch} onDismiss={mockOnDismiss} />)
}

makeMockIntersectionObserver()

describe('UnknownLabels', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
  })
  it('should render', () => {
    renderHelper({
      name: `${labels.sub}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
      },
    })
    expect(screen.getByText('input.unknownLabels.title')).toBeVisible()
  })
  it('should render inputs for all labels', () => {
    renderHelper({
      name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
      },
    })
    expect(screen.getByTestId('unknown-label-input-cool')).toBeVisible()
    expect(screen.getByTestId(`unknown-label-input-${labels.sub}`)).toBeVisible()
    expect(screen.getByTestId('unknown-label-input-nice')).toBeVisible()
    expect(screen.getByTestId(`unknown-label-input-${labels.test}`)).toBeVisible()
    expect(screen.getByTestId('unknown-label-input-test123')).toBeVisible()
  })
  it('should only allow inputs for unknown labels', () => {
    renderHelper({
      name: `${labels.sub}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
      },
    })
    expect(screen.getByText('input.unknownLabels.title')).toBeVisible()
    expect(screen.getByTestId(`unknown-label-input-${labels.sub}`)).toBeEnabled()
    expect(screen.getByTestId('unknown-label-input-test123')).toBeDisabled()
  })
  describe('should throw error if', () => {
    let input: HTMLElement
    beforeEach(async () => {
      renderHelper({
        name: `${labels.sub}.test123.eth`,
        transactionFlowItem: {
          transactions: [],
        },
      })
      input = screen.getByTestId(`unknown-label-input-${labels.sub}`)
      await userEvent.click(input)
    })

    it('label input is empty', async () => {
      await userEvent.type(input, 'aaa')
      await userEvent.clear(input)
      expect(screen.getByText('Label is required')).toBeVisible()
    })
    it('label input is too long', async () => {
      await userEvent.type(input, 'a'.repeat(512))
      expect(screen.getByText('Label is too long')).toBeVisible()
    })
    it('label input is invalid', async () => {
      await userEvent.type(input, '.')
      expect(screen.getByText('Invalid label')).toBeVisible()
    })
    it('label input does not match hash', async () => {
      await userEvent.type(input, 'aaa')
      expect(screen.getByText('Label is incorrect')).toBeVisible()
    })
  })
  it('should only allow inputs for unknown labels where there are known labels in between them', () => {
    renderHelper({
      name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
      },
    })
    expect(screen.getByTestId('unknown-label-input-cool')).toBeDisabled()
    expect(screen.getByTestId(`unknown-label-input-${labels.sub}`)).toBeEnabled()
    expect(screen.getByTestId('unknown-label-input-nice')).toBeDisabled()
    expect(screen.getByTestId(`unknown-label-input-${labels.test}`)).toBeEnabled()
    expect(screen.getByTestId('unknown-label-input-test123')).toBeDisabled()
  })
  it('should show TLD on last input as suffix', () => {
    renderHelper({
      name: `${labels.sub}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
      },
    })
    expect(
      screen.getByTestId(`unknown-label-input-test123`).parentElement!.querySelector('label'),
    ).toHaveTextContent('.eth')
  })
  it('should not allow submit when inputs are empty', () => {
    renderHelper({
      name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
      },
    })
    expect(screen.getByTestId('unknown-labels-confirm')).toBeDisabled()
  })
  it('should not allow submit when inputs have errors', async () => {
    renderHelper({
      name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
      },
    })

    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.sub}`), 'aaa')
    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.test}`), 'aaa')

    expect(screen.getByTestId('unknown-labels-confirm')).toBeDisabled()
  })
  it('should allow submit when inputs are filled and valid', async () => {
    renderHelper({
      name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
      },
    })

    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.sub}`), 'sub')
    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.test}`), 'test')

    expect(screen.getByTestId('unknown-labels-confirm')).toBeEnabled()
  })
  it('should replace all unknown label names in transactions array with the new ones', async () => {
    renderHelper({
      name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
      transactionFlowItem: {
        transactions: [
          {
            name: 'approveNameWrapper',
            data: {
              address: '0x123',
            },
          },
          {
            name: 'migrateProfile',
            data: {
              name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
            },
          },
          {
            name: 'wrapName',
            data: {
              name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
            },
          },
        ],
      },
    })

    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.sub}`), 'sub')
    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.test}`), 'test')

    expect(screen.getByTestId('unknown-labels-confirm')).toBeEnabled()
    await userEvent.click(screen.getByTestId('unknown-labels-confirm'))

    expect(mockDispatch).toHaveBeenCalledWith({
      name: 'startFlow',
      key: 'test',
      payload: {
        transactions: [
          {
            name: 'approveNameWrapper',
            data: {
              address: '0x123',
            },
          },
          {
            name: 'migrateProfile',
            data: {
              name: `cool.sub.nice.test.test123.eth`,
            },
          },
          {
            name: 'wrapName',
            data: {
              name: `cool.sub.nice.test.test123.eth`,
            },
          },
        ],
      },
    })
  })
  it('should replace name in intro with new name', async () => {
    renderHelper({
      name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
        intro: {
          title: ['test'],
          content: {
            name: 'WrapName',
            data: {
              name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
            },
          },
        },
      },
    })

    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.sub}`), 'sub')
    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.test}`), 'test')

    expect(screen.getByTestId('unknown-labels-confirm')).toBeEnabled()
    await userEvent.click(screen.getByTestId('unknown-labels-confirm'))

    expect(mockDispatch).toHaveBeenCalledWith({
      name: 'startFlow',
      key: 'test',
      payload: {
        transactions: [],
        intro: {
          title: ['test'],
          content: {
            name: 'WrapName',
            data: {
              name: `cool.sub.nice.test.test123.eth`,
            },
          },
        },
      },
    })
  })
  it('should pass through all other transaction item props', async () => {
    renderHelper({
      name: `cool.${labels.sub}.nice.${labels.test}.test123.eth`,
      transactionFlowItem: {
        transactions: [],
        resumable: true,
        resumeLink: 'test123',
      },
    })

    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.sub}`), 'sub')
    await userEvent.type(screen.getByTestId(`unknown-label-input-${labels.test}`), 'test')

    expect(screen.getByTestId('unknown-labels-confirm')).toBeEnabled()
    await userEvent.click(screen.getByTestId('unknown-labels-confirm'))

    expect(mockDispatch).toHaveBeenCalledWith({
      name: 'startFlow',
      key: 'test',
      payload: {
        transactions: [],
        resumable: true,
        resumeLink: 'test123',
      },
    })
  })
})
