import { render } from '@app/test-utils'

import RevokePermissions from './RevokePermissions-flow'

describe('RevokePermissions', () => {
  it.todo('<RevokeWarning/> should have link to doc site')
  it.todo('<RevokePermissionsView/> counter has correct values')
  it.todo('back button should cancel if at first view')
  describe('2LD', () => {
    it.todo('should not show set expiry view')
    it('renders', () => {
      render(
        <RevokePermissions
          data={{ name: 'test.eth', flowType: 'revoke-pcc', owner: 'test.eth', fuseObj: {} }}
        />,
      )
    })
  })
})
