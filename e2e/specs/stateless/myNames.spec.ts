/* eslint-disable no-await-in-loop */
import { expect } from '@playwright/test'

import { test } from '../../../playwright'

// test('owner test', async ({ page,
//   login,
//   makePageObject,
//   makeName }) => {
//   //make 200 names
//   const name = await makeName({
//     label: 'legacy',
//     type: 'legacy',
//     owner: 'user',
//     duration: -24 * 60 * 60,
//   })
  
//   const profilePage = makePageObject('ProfilePage')
//   await profilePage.goto(name)
//   const namesPage = makePageObject('MyNamesPage')
//   await login.connect()
//   await namesPage.goto()
//   await expect(page.getByText(`${name}`)).toBeVisible({
//     timeout: 15000,
//   })

//   const namesList = []

//   for (let i = 0; i < 50; i++) {
//     namesList.push(
//     await makeName({
//       label: `legacy-${i}`,
//       type: 'legacy',
//       owner: 'user',
//       duration: -24 * 60 * 60,
//     }))
//   }
//   await namesPage.goto()
//   await namesPage.searchField.fill(namesList[19])
//   await expect(page.getByText(`${namesList[19]}`)).toBeVisible({
//     timeout: 15000,
//   })
//   await namesPage.goto()
//   await namesPage.scrollToEnd()
//   await expect(page.getByText(`${namesList[19]}`)).toBeVisible({
//     timeout: 15000,
//   })
// })

// test('manager test', async ({ page,
//   login,
//   accounts,
//   provider,
//   time,
//   makePageObject,
//   makeName }) => {
//   //make 200 names
//   const name = await makeName({
//     label: 'legacy',
//     type: 'legacy',
//     owner: 'user2',
//     manager: 'user',
//     duration: -24 * 60 * 60,
//   })
  
//   const profilePage = makePageObject('ProfilePage')
//   await profilePage.goto(name)
//   const namesPage = makePageObject('MyNamesPage')
//   await login.connect()
//   await namesPage.goto()
//   await expect(page.getByText(`${name}`)).toBeVisible({
//     timeout: 15000,
//   })

//   const namesList = []

//   for (let i = 0; i < 50; i++) {
//     namesList.push(
//     await makeName({
//       label: `legacy-${i}`,
//       type: 'legacy',
//       owner: 'user2',
//       manager: 'user',
//       duration: -24 * 60 * 60,
//     }))
//   }
//   await namesPage.goto()
//   await namesPage.searchField.fill(namesList[19])
//   await expect(page.getByText(`${namesList[19]}`)).toBeVisible({
//     timeout: 15000,
//   })
//   await namesPage.goto()
//   await namesPage.scrollToEnd()
//   await expect(page.getByText(`${namesList[19]}`)).toBeVisible({
//     timeout: 15000,
//   })
// })

test('Should display all expiry data', async ({ page, login, makePageObject }) => {
  await page.goto('/');
  await login.connect();
  const namesPage = makePageObject('MyNamesPage');
  await namesPage.goto();

  for (let index = 1; index <= 30; index++) {
    await expect(page.getByText(`hour-expiring-${index}.wrapped-expired-subnames.eth`)).toBeVisible({
      timeout: 15000,
    });
  }
});

