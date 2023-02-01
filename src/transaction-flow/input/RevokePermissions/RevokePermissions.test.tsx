import { render } from '@app/test-utils'

import type changePermissions from '@app/transaction-flow/transaction/changePermissions'

import RevokePermissions, { Props } from './RevokePermissions-flow'

const mockDispatch = jest.fn()
const mockOnDismiss = jest.fn()

type Data = Props['data']
const makeData = () => {
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
  return {
    ...defaultData,
  } as Data
}

type TransactionData = Parameters<typeof changePermissions['transaction']>['2']
const makeTransactions = () => {
  const defaultData: TransactionData = {
    name: 'test.eth',
    contract: 'setFuses',
    fuses: [],
  }
  return [
    {
      name: 'changePermissions',
      data: defaultData,
    },
  ]
}

describe('RevokePermissions', () => {
  it.todo('<RevokeWarning/> should have link to doc site')
  it.todo('<RevokePermissionsView/> counter has correct values')
  it.todo('back button should cancel if at first view')
  describe('2LD', () => {
    it.todo('should not show set expiry view')
    it('renders', () => {
      render(
        <RevokePermissions
          data={makeData()}
          transactions={makeTransactions()}
          onDismiss={mockOnDismiss}
          dispatch={mockDispatch}
        />,
      )
    })
  })
})
