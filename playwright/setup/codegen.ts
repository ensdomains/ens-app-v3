/* eslint-disable import/no-extraneous-dependencies */
import { chromium } from '@playwright/test'
import { injectHeadlessWeb3Provider } from 'headless-web3-provider'

const main = async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()

  const page = await context.newPage()
  const wallet = await injectHeadlessWeb3Provider(
    page,
    [
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
      '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    ],
    1337,
    'http://localhost:8545',
  )
  await page.goto('http://localhost:3000')
  await page.getByTestId('connect-button').click()
  await page.getByTestId('rk-wallet-option-injected').click()
  await wallet.authorize('eth_requestAccounts')

  await page.pause()
}
main()
