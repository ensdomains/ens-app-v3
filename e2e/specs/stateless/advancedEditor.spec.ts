import { expect } from '@playwright/test'
import { test } from '@root/playwright'

test('should be able to maintain state when returning from transaction modal to advanced editor', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'profile',
    type: 'legacy',
    records: {
      texts: [{ key: 'text', value: 'text' }],
      coinTypes: [{ key: 'SOL', value: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH' }],
      contentHash: 'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
      abi: {
        contentType: 1,
        data: '{"test":"test"}',
      },
    },
  })

  const recordsPage = makePageObject('RecordsPage')
  const advancedEditor = makePageObject('AdvancedEditorModal')
  const transactionModal = makePageObject('TransactionModal')

  await recordsPage.goto(name)
  await login.connect()

  // Validate records
  await expect(recordsPage.getRecordValue('text', 'text')).toHaveText('text')
  await expect(recordsPage.getRecordValue('address', 'sol')).toHaveText(
    'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  )
  await expect(recordsPage.getRecordValue('contentHash')).toHaveText(
    'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
  )
  await expect(recordsPage.getRecordValue('abi')).toHaveText('"{\\"test\\":\\"test\\"}"')

  await recordsPage.editRecordsButton.click()

  // Validate advanced editor
  await expect(await advancedEditor.recordInput('text', 'text')).toHaveValue('text')
  await expect(await advancedEditor.recordInput('address', 'SOL')).toHaveValue(
    'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  )
  await expect(await advancedEditor.recordInput('contentHash')).toHaveValue(
    'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
  )
  await expect(await advancedEditor.recordInput('abi')).toHaveValue('"{\\"test\\":\\"test\\"}"')

  await advancedEditor.recordClearButton('text', 'text').then((button) => button.click())
  await advancedEditor.recordClearButton('address', 'SOL').then((button) => button.click())
  await advancedEditor.recordInput('contentHash').then((input) => input.fill(''))
  await advancedEditor.recordInput('abi').then((input) => input.fill(''))

  await advancedEditor.saveButton.click()

  // Validate transaction display item
  await expect(transactionModal.displayItem('update')).toHaveText('4 records')

  await transactionModal.backButton.click()

  // Validate inputs have been rebuilt correctly
  await expect(await advancedEditor.recordComponent('text', 'text')).toHaveCount(0)
  await expect(await advancedEditor.recordComponent('address', 'SOL')).toHaveCount(0)
  await expect(await advancedEditor.recordInput('contentHash')).toHaveValue('')
  await expect(await advancedEditor.recordInput('abi')).toHaveValue('')

  await advancedEditor.saveButton.click()

  await transactionModal.autoComplete()

  // Validate change in records
  await expect(recordsPage.getRecordButton('text', 'text')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('address', 'sol')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('contentHash')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('abi')).toHaveCount(0)
})
