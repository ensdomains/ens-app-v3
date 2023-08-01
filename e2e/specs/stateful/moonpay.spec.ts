import { expect } from '@playwright/test'
import { test } from '@root/playwright'

const makeid = (length: number) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

test.describe('Moonpay registration', () => {
  test('should open up moonpay flow if selected', async ({ page, login }) => {
    test.slow()
    // cy.changeMetamaskNetwork('goerli')
    await page.goto(`/${makeid(230)}.eth/register`)

    await login.connect()

    await page.getByText('Credit or debit card').click()
    await page.getByText('Next').click()

    const moonpay = page.frameLocator('#moonpayIframe')
    await expect(moonpay.getByText('Purchase NFT with card')).toBeVisible({ timeout: 25000 })
    await moonpay.getByRole('button', { name: 'Continue' }).click()
    await expect(moonpay.getByText('Checkout with MoonPay')).toBeVisible()
  })
})
