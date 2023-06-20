import { expect } from '@playwright/test'
import { Web3RequestKind } from 'headless-web3-provider'

import { test } from '..'

test('connect the wallet', async ({ page, wallet, nameGenerator }) => {
  const name = await nameGenerator()
  console.log('generating name', name)
  await page.goto(`http://localhost:3000/${name}`)

  await page.pause()
  // Inject window.ethereum instance

  // Request connecting the wallet
  await page.locator('text=Connect').click()
  await page.locator('text=Browser Wallet').click()
  await page.isVisible('text=Confirm connection in the extension')
  expect(wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts)).toEqual(1)
  await wallet.authorize(Web3RequestKind.RequestAccounts)
  expect(wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts)).toEqual(0)
  await page.isVisible('text=0xf39...92266')

  await page.pause()

  // Verify if the wallet is really connected
  await test.expect(page.locator('text=Connected')).not.toBeVisible()
  await test.expect(page.locator('text=0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')).toBeVisible()
})
