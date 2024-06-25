import { expect } from '@playwright/test'

import { test } from '../../../../playwright/index'

test('should not allow parent owner to delete if PCC is expired', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'wrapped-expired-subname',
    type: 'wrapped',
    owner: 'user',
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    subnames: [
      {
        label: 'day-expired',
        owner: 'user',
        duration: -24 * 60 * 60,
        fuses: {
          parent: {
            named: ['PARENT_CANNOT_CONTROL'],
          },
        },
      },
    ],
  })
  const subname = `day-expired.${name}`

  const profilePage = makePageObject('ProfilePage')

  await profilePage.goto(subname)
  await login.connect()
  // this is because once PCC expires, the name is effectively deleted
  await expect(page.getByTestId('profile-action-Delete subname')).toHaveCount(0)
})
