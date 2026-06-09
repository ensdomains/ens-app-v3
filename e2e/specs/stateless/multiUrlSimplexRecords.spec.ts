import { expect } from '@playwright/test'
import dotenv from 'dotenv'

import { test } from '../../../playwright'

dotenv.config({ path: '.env.local' })

/* The MultiUrlField component handles the `simplex.contact` and
 * `simplex.channel` text records, which can carry up to 5 SMP-server URLs
 * separated by commas. This spec drives the component end-to-end via the
 * profile-editor flow:
 *
 *   1) bare add: open the editor, add a `simplex.contact` row, type a URL
 *   2) extension: click "Add URL" → a second row appears
 *   3) re-render fidelity: every row carries the SimpleX glyph and has a
 *      trash button aligned with its input
 *   4) cap: a sixth Add URL click is disabled
 *   5) comma block: the separator can't be typed/pasted into a row
 *   6) per-row remove: the trash on row N removes only that row
 *   7) onDelete: removing the last row deletes the whole record
 *   8) save round-trip: the persisted text-record value reads back
 *      as a comma-joined string and re-renders as N rows
 */

const MULTI_URL_KEY = 'simplex.contact'

const inputAt = (page: any, index: number) =>
  page.getByTestId(`multi-url-field-${MULTI_URL_KEY}-input-${index}`)
const trashAt = (page: any, index: number) =>
  page.getByTestId(`multi-url-field-${MULTI_URL_KEY}-remove-${index}`)
const addUrl = (page: any) => page.getByTestId(`multi-url-field-${MULTI_URL_KEY}-add`)

test.describe('MultiUrlField — simplex.contact / simplex.channel', () => {
  test('adds, removes and round-trips multiple simplex.contact URLs', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({ label: 'simplex-multi', type: 'legacy' })

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const recordsPage = makePageObject('RecordsPage')

    await profilePage.goto(name)
    await login.connect()

    await profilePage.editProfileButton.click()
    await profilePage.profileEditorAddInputs([MULTI_URL_KEY])

    // First row should now be present.
    await expect(inputAt(page, 0)).toBeVisible()
    await inputAt(page, 0).fill('https://smp1.example.im/a#H1')

    // 2) Add URL → second row.
    await addUrl(page).click()
    await expect(inputAt(page, 1)).toBeVisible()
    await inputAt(page, 1).fill('https://smp2.example.im/a#H2')

    // 3) Every row's input has the SimpleX glyph icon (rendered as a sibling
    //    inside the Input). The icon is the same for every row, so just
    //    confirm both inputs have at least one ancestor `svg` icon.
    for (const i of [0, 1]) {
      await expect(inputAt(page, i).locator('xpath=ancestor::div[1]//svg').first()).toBeVisible()
      await expect(trashAt(page, i)).toBeVisible()
    }

    // 5) Comma must NOT be enterable, either by keystroke or by paste.
    await inputAt(page, 1).focus()
    await page.keyboard.press(',')
    await expect(inputAt(page, 1)).toHaveValue('https://smp2.example.im/a#H2')

    // Simulate paste that contains commas — value should be stripped.
    await inputAt(page, 1).fill('a,b,c')
    await expect(inputAt(page, 1)).toHaveValue('abc')

    // Restore a valid value before saving.
    await inputAt(page, 1).fill('https://smp2.example.im/a#H2')

    // 4) Cap at 5: keep clicking until we hit 5 rows, then verify disabled.
    for (let i = 2; i < 5; i += 1) {
      await addUrl(page).click()
      await inputAt(page, i).fill(`https://smp${i + 1}.example.im/a#H${i + 1}`)
    }
    await expect(addUrl(page)).toBeDisabled()

    // 6) Per-row remove: drop row 2. The remaining rows (0, 1, 3, 4) re-index
    //    as 0, 1, 2, 3.
    await trashAt(page, 2).click()
    await expect(inputAt(page, 0)).toHaveValue('https://smp1.example.im/a#H1')
    await expect(inputAt(page, 1)).toHaveValue('https://smp2.example.im/a#H2')
    await expect(inputAt(page, 2)).toHaveValue('https://smp4.example.im/a#H4')
    await expect(inputAt(page, 3)).toHaveValue('https://smp5.example.im/a#H5')
    await expect(addUrl(page)).toBeEnabled()

    // Drop two more so we end up with just smp1 + smp2 (round-trip target).
    await trashAt(page, 3).click()
    await trashAt(page, 2).click()
    await expect(inputAt(page, 0)).toHaveValue('https://smp1.example.im/a#H1')
    await expect(inputAt(page, 1)).toHaveValue('https://smp2.example.im/a#H2')

    // 8) Save and confirm the on-chain text record reads back as
    //    a comma-joined string.
    await profilePage.profileEditor.getByTestId('profile-submit-button').click()
    await transactionModal.autoComplete()

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', MULTI_URL_KEY)).toHaveText(
      'https://smp1.example.im/a#H1,https://smp2.example.im/a#H2',
    )

    // Re-open the editor: the persisted CSV should re-hydrate into two rows.
    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await expect(inputAt(page, 0)).toHaveValue('https://smp1.example.im/a#H1')
    await expect(inputAt(page, 1)).toHaveValue('https://smp2.example.im/a#H2')
  })

  test('removing the only URL row deletes the simplex.contact record entirely', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({ label: 'simplex-delete', type: 'legacy' })

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(name)
    await login.connect()

    await profilePage.editProfileButton.click()
    await profilePage.profileEditorAddInputs([MULTI_URL_KEY])

    await inputAt(page, 0).fill('https://smp1.example.im/a#H1')

    // Click trash on the only row → the record should be removed from the
    // editor entirely. The field is no longer rendered.
    await trashAt(page, 0).click()
    await expect(page.getByTestId(`multi-url-field-${MULTI_URL_KEY}`)).not.toBeVisible()
  })
})
