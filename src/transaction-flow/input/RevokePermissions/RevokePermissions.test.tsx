import { fireEvent, mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { DeepPartial } from '@app/types'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'
import RevokePermissions, { Props } from './RevokePermissions-flow'

vi.mock('@app/hooks/ensjs/public/usePrimaryName')

vi.spyOn(Date, 'now').mockImplementation(() => new Date('2023-01-01').getTime())

const mockUsePrimaryName = mockFunction(usePrimaryName)

const mockDispatch = vi.fn()
const mockOnDismiss = vi.fn()

makeMockIntersectionObserver()

type Data = Props['data']
const makeData = (overrides: DeepPartial<Data> = {}) => {
  const defaultData = {
    name: 'test.eth',
    flowType: 'revoke-pcc',
    owner: '0x1234',
    parentFuses: {
      PARENT_CANNOT_CONTROL: false,
      CAN_EXTEND_EXPIRY: false,
    },
    childFuses: {
      CANNOT_UNWRAP: false,
      CANNOT_CREATE_SUBDOMAIN: false,
      CANNOT_TRANSFER: false,
      CANNOT_SET_RESOLVER: false,
      CANNOT_SET_TTL: false,
      CANNOT_BURN_FUSES: false,
    },
    minExpiry: 0,
    maxExpiry: 0,
  }
  const { parentFuses = {}, childFuses = {}, ...data } = overrides
  return {
    ...defaultData,
    ...data,
    parentFuses: {
      ...defaultData.parentFuses,
      ...parentFuses,
    },
    childFuses: {
      ...defaultData.childFuses,
      ...childFuses,
    },
  } as Data
}

beforeEach(() => {
  mockUsePrimaryName.mockReturnValue({ data: null, isLoading: false })
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('RevokePermissions', () => {
  describe('revoke-pcc', () => {
    it('should call dispatch when flow is finished', async () => {
      render(
        <RevokePermissions
          data={makeData({
            name: 'sub.test.eth',
            flowType: 'revoke-pcc',
            minExpiry: 1672531200,
            maxExpiry: 1675238574,
          })}
          transactions={[]}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )

      const nextButton = screen.getByTestId('permissions-next-button')

      // warning screen
      expect(
        screen.getByText('input.revokePermissions.views.revokeWarning.subtitle2'),
      ).toBeInTheDocument()
      expect(nextButton).toHaveTextContent('action.understand')
      await userEvent.click(nextButton)

      // pcc view
      const pccCheckbox = screen.getByTestId('checkbox-pcc')
      await waitFor(() => {
        expect(pccCheckbox).toBeInTheDocument()
        expect(pccCheckbox).not.toBeChecked()
        expect(nextButton).toBeDisabled()
      })
      await userEvent.click(pccCheckbox)
      await waitFor(() => {
        expect(pccCheckbox).toBeChecked()
        expect(nextButton).not.toBeDisabled()
      })
      await userEvent.click(nextButton)

      // set expiry view
      const maxRadio = screen.getByTestId('radio-max')
      const customRadio = screen.getByTestId('radio-custom')
      await waitFor(() => {
        expect(maxRadio).toBeChecked()
        expect(customRadio).not.toBeChecked()
      })
      await userEvent.click(nextButton)

      // parent revoke permissions
      const fusesToBurn = [
        'CAN_EXTEND_EXPIRY',
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_TRANSFER',
        'CANNOT_SET_RESOLVER',
        'CANNOT_SET_TTL',
        'CANNOT_BURN_FUSES',
      ]
      for (const fuse of fusesToBurn) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(screen.getByTestId(`checkbox-${fuse}`))
      }
      await waitFor(() => {
        expect(nextButton).toHaveTextContent('input.revokePermissions.action.revoke7')
      })
      await userEvent.click(nextButton)

      // burn fuses warning
      await waitFor(() => {
        expect(
          screen.getByText('input.revokePermissions.views.revokeChangeFusesWarning.title'),
        ).toBeInTheDocument()
      })

      await userEvent.click(nextButton)

      const nameConfirmation = screen.getByTestId('input-name-confirmation')

      fireEvent.change(nameConfirmation, { target: { value: 'sub.test.eth' } })

      await userEvent.click(nextButton)

      await waitFor(() => {
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactions',
          payload: [
            createTransactionItem('changePermissions', {
              name: 'sub.test.eth',
              contract: 'setChildFuses',
              fuses: {
                parent: ['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPIRY'],
                child: [
                  'CANNOT_UNWRAP',
                  'CANNOT_BURN_FUSES',
                  'CANNOT_TRANSFER',
                  'CANNOT_SET_RESOLVER',
                  'CANNOT_SET_TTL',
                  'CANNOT_CREATE_SUBDOMAIN',
                ],
              },
              expiry: 1675238574,
            }),
          ],
        })
      })
    })

    it('should not show SetExpiryView if minExpiry and maxExpiry are equal', async () => {
      render(
        <RevokePermissions
          data={makeData({
            name: 'sub.test.eth',
            flowType: 'revoke-pcc',
            minExpiry: 1675238574,
            maxExpiry: 1675238574,
          })}
          transactions={[]}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )

      const nextButton = screen.getByTestId('permissions-next-button')

      // warning screen
      await userEvent.click(nextButton)

      // pcc view
      const pccCheckbox = screen.getByTestId('checkbox-pcc')
      await userEvent.click(pccCheckbox)
      await waitFor(() => {
        expect(pccCheckbox).toBeChecked()
        expect(nextButton).not.toBeDisabled()
      })
      await userEvent.click(nextButton)

      // set expiry view
      const maxRadio = screen.queryByTestId('radio-max')
      const customRadio = screen.queryByTestId('radio-custom')
      await waitFor(() => {
        expect(maxRadio).toBeNull()
        expect(customRadio).toBeNull()
      })
    })

    it('should filter out child fuses if CANNOT_UNWRAP is checked', async () => {
      render(
        <RevokePermissions
          data={makeData({
            name: 'sub.test.eth',
            flowType: 'revoke-pcc',
            minExpiry: 1672531200,
            maxExpiry: 1675238574,
          })}
          transactions={[]}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )

      const nextButton = screen.getByTestId('permissions-next-button')

      // warning screen
      await userEvent.click(nextButton)

      // pcc view
      const pccCheckbox = screen.getByTestId('checkbox-pcc')
      await userEvent.click(pccCheckbox)
      await userEvent.click(nextButton)

      // set expiry view
      await userEvent.click(nextButton)

      // parent revoke permissions
      const fusesToBurn = [
        'CAN_EXTEND_EXPIRY',
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_TRANSFER',
        'CANNOT_SET_RESOLVER',
        'CANNOT_SET_TTL',
        'CANNOT_BURN_FUSES',
      ]
      for (const fuse of fusesToBurn) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(screen.getByTestId(`checkbox-${fuse}`))
      }
      await userEvent.click(screen.getByTestId('checkbox-CANNOT_UNWRAP'))
      await userEvent.click(nextButton)

      await userEvent.click(nextButton)

      const nameConfirmation = screen.getByTestId('input-name-confirmation')

      fireEvent.change(nameConfirmation, { target: { value: 'sub.test.eth' } })

      await userEvent.click(nextButton)

      await waitFor(() => {
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactions',
          payload: [
            createTransactionItem('changePermissions', {
              name: 'sub.test.eth',
              contract: 'setChildFuses',
              fuses: {
                parent: ['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPIRY'],
                child: [],
              },
              expiry: 1675238574,
            }),
          ],
        })
      })
    })
  })

  describe('grant-extend-expiry', () => {
    it('should call dispatch when flow is finished', async () => {
      render(
        <RevokePermissions
          data={makeData({
            name: 'sub.test.eth',
            flowType: 'grant-extend-expiry',
            minExpiry: Math.floor(new Date('2022-01-01').getTime() / 1000),
            maxExpiry: Math.floor(new Date('2024-01-01').getTime() / 1000),
          })}
          transactions={[]}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )

      const nextButton = screen.getByTestId('permissions-next-button')

      // warning screen
      expect(
        screen.getByText('input.revokePermissions.views.revokeWarning.subtitle2'),
      ).toBeInTheDocument()
      expect(nextButton).toHaveTextContent('action.understand')
      await userEvent.click(nextButton)

      // extend expiry view
      const extendExpiryCheckbox = screen.getByTestId('checkbox-CAN_EXTEND_EXPIRY')
      await waitFor(() => {
        expect(extendExpiryCheckbox).toBeInTheDocument()
        expect(extendExpiryCheckbox).not.toBeChecked()
        expect(nextButton).toBeDisabled()
      })
      await userEvent.click(extendExpiryCheckbox)
      await waitFor(() => {
        expect(extendExpiryCheckbox).toBeChecked()
        expect(nextButton).not.toBeDisabled()
      })
      await userEvent.click(nextButton)

      // set expiry view
      const maxRadio = screen.getByTestId('radio-max')
      const customRadio = screen.getByTestId('radio-custom')

      await waitFor(() => {
        expect(maxRadio).toBeChecked()
        expect(customRadio).not.toBeChecked()
      })

      await userEvent.click(customRadio)

      await waitFor(() => {
        expect(maxRadio).not.toBeChecked()
        expect(customRadio).toBeChecked()
        expect(nextButton).not.toBeDisabled()
      })

      await userEvent.click(nextButton)

      await waitFor(() => {
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactions',
          payload: [
            createTransactionItem('changePermissions', {
              name: 'sub.test.eth',
              contract: 'setChildFuses',
              fuses: {
                parent: ['CAN_EXTEND_EXPIRY'],
                child: [],
              },
              expiry: Math.floor(new Date('2023-01-02').getTime() / 1000),
            }),
          ],
        })
      })
    })

    it('should not show SetExpiryView if minExpiry and maxExpiry are equal', async () => {
      render(
        <RevokePermissions
          data={makeData({
            name: 'sub.test.eth',
            flowType: 'grant-extend-expiry',
            minExpiry: 1675238574,
            maxExpiry: 1675238574,
          })}
          transactions={[]}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )

      const nextButton = screen.getByTestId('permissions-next-button')

      // warning screen
      expect(
        screen.getByText('input.revokePermissions.views.revokeWarning.subtitle2'),
      ).toBeInTheDocument()
      expect(nextButton).toHaveTextContent('action.understand')
      await userEvent.click(nextButton)

      // extend expiry view
      const extendExpiryCheckbox = screen.getByTestId('checkbox-CAN_EXTEND_EXPIRY')
      await waitFor(() => {
        expect(extendExpiryCheckbox).toBeInTheDocument()
        expect(extendExpiryCheckbox).not.toBeChecked()
        expect(nextButton).toBeDisabled()
      })
      await userEvent.click(extendExpiryCheckbox)
      await waitFor(() => {
        expect(extendExpiryCheckbox).toBeChecked()
        expect(nextButton).not.toBeDisabled()
      })
      await userEvent.click(nextButton)

      await waitFor(() => {
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactions',
          payload: [
            createTransactionItem('changePermissions', {
              name: 'sub.test.eth',
              contract: 'setChildFuses',
              fuses: {
                parent: ['CAN_EXTEND_EXPIRY'],
                child: [],
              },
              expiry: 1675238574,
            }),
          ],
        })
      })
    })
  })

  describe('revoke-permissions', () => {
    it('should call dispatch when flow is finished', async () => {
      render(
        <RevokePermissions
          data={makeData({
            name: 'sub.test.eth',
            flowType: 'revoke-permissions',
            parentFuses: {
              PARENT_CANNOT_CONTROL: true,
              CAN_EXTEND_EXPIRY: true,
            },
          })}
          transactions={[]}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )

      const nextButton = screen.getByTestId('permissions-next-button')

      // warning screen
      expect(
        screen.getByText('input.revokePermissions.views.revokeWarning.subtitle2'),
      ).toBeInTheDocument()
      expect(nextButton).toHaveTextContent('action.understand')
      await userEvent.click(nextButton)

      // pcc view
      const unwrapCheckbox = screen.getByTestId('checkbox-CANNOT_UNWRAP')
      await waitFor(() => {
        expect(unwrapCheckbox).toBeInTheDocument()
        expect(unwrapCheckbox).not.toBeChecked()
        expect(nextButton).toBeDisabled()
      })
      await userEvent.click(unwrapCheckbox)
      await waitFor(() => {
        expect(unwrapCheckbox).toBeChecked()
        expect(nextButton).not.toBeDisabled()
      })
      await userEvent.click(nextButton)

      // revoke permissions
      const fusesToBurn = [
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_TRANSFER',
        'CANNOT_SET_RESOLVER',
        'CANNOT_SET_TTL',
      ]
      for (const fuse of fusesToBurn) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(screen.getByTestId(`checkbox-${fuse}`))
      }
      await waitFor(() => {
        expect(nextButton).toHaveTextContent('input.revokePermissions.action.revoke4')
      })
      await userEvent.click(nextButton)

      const nameConfirmation = screen.getByTestId('input-name-confirmation')

      fireEvent.change(nameConfirmation, { target: { value: 'sub.test.eth' } })

      await userEvent.click(nextButton)

      await waitFor(() => {
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactions',
          payload: [
            createTransactionItem('changePermissions', {
              name: 'sub.test.eth',
              contract: 'setFuses',
              fuses: [
                'CANNOT_UNWRAP',
                'CANNOT_TRANSFER',
                'CANNOT_SET_RESOLVER',
                'CANNOT_SET_TTL',
                'CANNOT_CREATE_SUBDOMAIN',
              ],
            }),
          ],
        })
      })
    })

    it('should skip unwrap view if it already burned', async () => {
      render(
        <RevokePermissions
          data={makeData({
            name: 'sub.test.eth',
            flowType: 'revoke-permissions',
            parentFuses: {
              PARENT_CANNOT_CONTROL: true,
              CAN_EXTEND_EXPIRY: true,
            },
            childFuses: {
              CANNOT_UNWRAP: true,
            },
          })}
          transactions={[]}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )

      const nextButton = screen.getByTestId('permissions-next-button')

      // warning screen
      expect(
        screen.getByText('input.revokePermissions.views.revokeWarning.subtitle2'),
      ).toBeInTheDocument()
      expect(nextButton).toHaveTextContent('action.understand')
      await userEvent.click(nextButton)

      // revoke permissions
      const fusesToBurn = [
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_TRANSFER',
        'CANNOT_SET_RESOLVER',
        'CANNOT_SET_TTL',
      ]
      for (const fuse of fusesToBurn) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(screen.getByTestId(`checkbox-${fuse}`))
      }
      await waitFor(() => {
        expect(nextButton).toHaveTextContent('input.revokePermissions.action.revoke4')
      })
      await userEvent.click(nextButton)

      const nameConfirmation = screen.getByTestId('input-name-confirmation')

      fireEvent.change(nameConfirmation, { target: { value: 'sub.test.eth' } })

      await userEvent.click(nextButton)

      await waitFor(() => {
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactions',
          payload: [
            createTransactionItem('changePermissions', {
              name: 'sub.test.eth',
              contract: 'setFuses',
              fuses: [
                'CANNOT_TRANSFER',
                'CANNOT_SET_RESOLVER',
                'CANNOT_SET_TTL',
                'CANNOT_CREATE_SUBDOMAIN',
              ],
            }),
          ],
        })
      })
    })

    it('should disable checkboxes that are already burned', async () => {
      render(
        <RevokePermissions
          data={makeData({
            name: 'sub.test.eth',
            flowType: 'revoke-permissions',
            parentFuses: {
              PARENT_CANNOT_CONTROL: true,
              CAN_EXTEND_EXPIRY: true,
            },
            childFuses: {
              CANNOT_UNWRAP: true,
              CANNOT_CREATE_SUBDOMAIN: true,
              CANNOT_TRANSFER: true,
            },
          })}
          transactions={[]}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )

      const nextButton = screen.getByTestId('permissions-next-button')

      // warning screen
      expect(
        screen.getByText('input.revokePermissions.views.revokeWarning.subtitle2'),
      ).toBeInTheDocument()
      expect(nextButton).toHaveTextContent('action.understand')
      await userEvent.click(nextButton)

      // revoke permissions
      const fusesToBurn = [
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_TRANSFER',
        'CANNOT_SET_RESOLVER',
        'CANNOT_SET_TTL',
      ]
      for (const fuse of fusesToBurn) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(screen.getByTestId(`checkbox-${fuse}`))
      }
      await waitFor(() => {
        expect(screen.getByTestId(`checkbox-CANNOT_CREATE_SUBDOMAIN`)).toBeDisabled()
        expect(screen.getByTestId(`checkbox-CANNOT_TRANSFER`)).toBeDisabled()
        expect(nextButton).toHaveTextContent('input.revokePermissions.action.revoke2')
      })
      await userEvent.click(nextButton)

      const nameConfirmation = screen.getByTestId('input-name-confirmation')

      fireEvent.change(nameConfirmation, { target: { value: 'sub.test.eth' } })

      await userEvent.click(nextButton)

      await waitFor(() => {
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactions',
          payload: [
            createTransactionItem('changePermissions', {
              name: 'sub.test.eth',
              contract: 'setFuses',
              fuses: ['CANNOT_SET_RESOLVER', 'CANNOT_SET_TTL'],
            }),
          ],
        })
      })
    })
  })

  describe('revoke-change-fuses', () => {
    it('should call dispatch when flow is finished', async () => {
      render(
        <RevokePermissions
          data={makeData({
            name: 'sub.test.eth',
            flowType: 'revoke-change-fuses',
            parentFuses: {
              PARENT_CANNOT_CONTROL: true,
              CAN_EXTEND_EXPIRY: true,
            },
            childFuses: {
              CANNOT_UNWRAP: true,
            },
          })}
          transactions={[]}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )

      const nextButton = screen.getByTestId('permissions-next-button')

      // warning screen
      expect(
        screen.getByText('input.revokePermissions.views.revokeWarning.subtitle2'),
      ).toBeInTheDocument()
      expect(nextButton).toHaveTextContent('action.understand')
      await userEvent.click(nextButton)

      // change permissions view
      const burnFusesCheckbox = screen.getByTestId('checkbox-CANNOT_BURN_FUSES')
      await waitFor(() => {
        expect(burnFusesCheckbox).toBeInTheDocument()
        expect(burnFusesCheckbox).not.toBeChecked()
        expect(nextButton).toBeDisabled()
      })
      await userEvent.click(burnFusesCheckbox)
      await waitFor(() => {
        expect(burnFusesCheckbox).toBeChecked()
        expect(nextButton).not.toBeDisabled()
      })
      await userEvent.click(nextButton)

      // burn warning permissions
      await waitFor(() => {
        expect(
          screen.getByText('input.revokePermissions.views.revokeChangeFusesWarning.title'),
        ).toBeInTheDocument()
      })
      await userEvent.click(nextButton)

      const nameConfirmation = screen.getByTestId('input-name-confirmation')

      fireEvent.change(nameConfirmation, { target: { value: 'sub.test.eth' } })

      await userEvent.click(nextButton)

      await waitFor(() => {
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactions',
          payload: [
            createTransactionItem('changePermissions', {
              name: 'sub.test.eth',
              contract: 'setFuses',
              fuses: ['CANNOT_BURN_FUSES'],
            }),
          ],
        })
      })
    })
  })
})
