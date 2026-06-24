import { expect } from '@playwright/test'
import { Address, keccak256, namehash, toBytes } from 'viem'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  deploymentAddresses,
  publicClient,
  waitForTransaction,
  walletClient,
} from '../../../playwright/fixtures/contracts/utils/addTestContracts'

/*
 * SNRC end-to-end journey on a single .testing 2LD:
 *   1. register the 2LD through the UI (NFT-gated, free; account #0 holds the gate NFT)
 *   2. add a `simplex.contact` record to the 2LD
 *   3. create a subname (mobile.<2LD>) — soulbound to the 2LD NFT
 *   4. add a `simplex.contact` record to the subname
 *   5. assert the Ownership tab works on the 2LD but is hidden on the subname
 *      (subnames have no independent ownership — they're soulbound to the NFT)
 *   6. transfer the 2LD NFT to another account
 *   7. assert the subname followed the 2LD to the new owner (auto-reclaim +
 *      walk-up ownerOf), and the old owner can no longer manage it
 */

const CONTACT_KEY = 'simplex.contact'
const contactInput = (page: any, i = 0) =>
  page.getByTestId(`multi-url-field-${CONTACT_KEY}-input-${i}`)

const registryOwnerAbi = [
  { name: 'owner', type: 'function', stateMutability: 'view', inputs: [{ type: 'bytes32' }], outputs: [{ type: 'address' }] },
] as const
const subnameOwnerOfAbi = [
  { name: 'ownerOf', type: 'function', stateMutability: 'view', inputs: [{ type: 'uint256' }], outputs: [{ type: 'address' }] },
] as const
const baseRegistrarTransferAbi = [
  { name: 'safeTransferFrom', type: 'function', stateMutability: 'nonpayable', inputs: [{ type: 'address' }, { type: 'address' }, { type: 'uint256' }], outputs: [] },
] as const

test('SNRC: register 2LD + subname (both with simplex.contact), then transfer the 2LD — subname follows', async ({
  page,
  login,
  time,
  makePageObject,
}) => {
  test.slow()

  const label = `foobar-${Date.now().toString(36)}`
  const name = `${label}.testing`
  const subLabel = 'mobile'
  const subname = `${subLabel}.${name}`

  const homePage = makePageObject('HomePage')
  const profilePage = makePageObject('ProfilePage')
  const subnamesPage = makePageObject('SubnamesPage')
  const recordsPage = makePageObject('RecordsPage')
  const transactionModal = makePageObject('TransactionModal')

  await time.sync()
  await homePage.goto()
  await login.connect()

  await test.step('register the 2LD', async () => {
    await homePage.searchInput.fill(name)
    await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
    await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Available' }).waitFor()
    await homePage.searchInput.press('Enter')
    await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible({
      timeout: 90000,
    })
    const next = page.getByTestId('next-button')
    await expect(next).toBeEnabled({ timeout: 30000 })
    await next.click()
    await page.getByTestId('profile-submit-button').click()
    await expect(page.getByTestId('next-button')).toHaveText('Begin')
    await page.getByTestId('next-button').click()
    await expect(transactionModal.transactionModal).toBeVisible({ timeout: 30000 })
    await transactionModal.closeButton.click()
    await page.getByTestId('start-timer-button').click()
    await transactionModal.confirm()
    await time.sync()
    await time.increaseTime({ seconds: 90 })
    await expect(page.getByTestId('finish-button')).toBeEnabled({ timeout: 30000 })
    await page.getByTestId('finish-button').click()
    await transactionModal.confirm()
    await expect(page.getByText(`You are now the owner of ${name}`)).toBeVisible({ timeout: 60000 })
  })

  await test.step('add simplex.contact to the 2LD', async () => {
    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await expect(contactInput(page)).toBeVisible()
    await contactInput(page).fill('https://smp1.example.im/2ld#H1')
    await profilePage.profileEditor.getByTestId('profile-submit-button').click()
    await transactionModal.autoComplete()
    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', CONTACT_KEY)).toHaveText(
      'https://smp1.example.im/2ld#H1',
    )
  })

  await test.step('create the subname and add simplex.contact to it', async () => {
    await subnamesPage.goto(name)
    await subnamesPage.getAddSubnameButton.click()
    await subnamesPage.getAddSubnameInput.fill(subLabel)
    await subnamesPage.getSubmitSubnameButton.click()
    await subnamesPage.getSubmitSubnameProfileButton.click()
    await transactionModal.autoComplete()
    await expect(page).toHaveURL(new RegExp(subname.replace(/\./g, '\\.')), { timeout: 30000 })

    await profilePage.goto(subname)
    await profilePage.editProfileButton.click()
    await expect(contactInput(page)).toBeVisible()
    await contactInput(page).fill('https://smp1.example.im/sub#H1')
    await profilePage.profileEditor.getByTestId('profile-submit-button').click()
    await transactionModal.autoComplete()
    await recordsPage.goto(subname)
    await expect(recordsPage.getRecordValue('text', CONTACT_KEY)).toHaveText(
      'https://smp1.example.im/sub#H1',
    )
  })

  await test.step('Ownership tab: present + usable on the 2LD, hidden on the subname', async () => {
    await profilePage.goto(name)
    const ownershipTab = page.getByTestId('ownership-tab')
    await expect(ownershipTab).toBeVisible({ timeout: 30000 })
    // ... and it's functional: clicking it navigates to the ownership tab
    await ownershipTab.click()
    await expect(page).toHaveURL(/tab=ownership/, { timeout: 10000 })

    await profilePage.goto(subname)
    // page is loaded (subname is editable by the 2LD holder) ...
    await expect(page.getByTestId('profile-action-Edit profile')).toBeVisible({ timeout: 30000 })
    // ... but it has NO ownership tab (soulbound to the 2LD)
    await expect(page.getByTestId('ownership-tab')).toHaveCount(0)

    // and a subname can't itself register subnames (single-level in the UI)
    await subnamesPage.goto(subname)
    await expect(page.getByTestId('subnames-tab')).toBeVisible({ timeout: 30000 })
    await expect(page.getByTestId('add-subname-action')).toHaveCount(0)
  })

  await test.step('transfer the 2LD NFT to a new owner', async () => {
    const owner = createAccounts().getAddress('user') as Address
    const newOwner = createAccounts().getAddress('user2') as Address
    const tokenId = BigInt(keccak256(toBytes(label)))

    // pre-condition: subname's effective owner is the current 2LD holder
    const before = (await publicClient.readContract({
      address: deploymentAddresses.SubnameRegistrar as Address,
      abi: subnameOwnerOfAbi,
      functionName: 'ownerOf',
      args: [BigInt(namehash(subname))],
    })) as Address
    expect(before.toLowerCase()).toBe(owner.toLowerCase())

    const hash = await walletClient.writeContract({
      address: deploymentAddresses.BaseRegistrarImplementation as Address,
      abi: baseRegistrarTransferAbi,
      functionName: 'safeTransferFrom',
      args: [owner, newOwner, tokenId],
      account: owner,
    })
    await waitForTransaction(hash)
  })

  await test.step('the subname followed the 2LD to the new owner', async () => {
    const newOwner = createAccounts().getAddress('user2') as Address

    // 2LD registry node followed the NFT (auto-reclaim)
    const reg2ld = (await publicClient.readContract({
      address: deploymentAddresses.ENSRegistry as Address,
      abi: registryOwnerAbi,
      functionName: 'owner',
      args: [namehash(name)],
    })) as Address
    expect(reg2ld.toLowerCase()).toBe(newOwner.toLowerCase())

    // subname's effective owner followed too (walk-up ownerOf)
    const subOwner = (await publicClient.readContract({
      address: deploymentAddresses.SubnameRegistrar as Address,
      abi: subnameOwnerOfAbi,
      functionName: 'ownerOf',
      args: [BigInt(namehash(subname))],
    })) as Address
    expect(subOwner.toLowerCase()).toBe(newOwner.toLowerCase())

    // and the old owner (still connected) can no longer manage the subname
    await profilePage.goto(subname)
    await page.reload()
    await expect(page.getByTestId('profile-action-Edit profile')).toHaveCount(0, { timeout: 30000 })
  })
})
