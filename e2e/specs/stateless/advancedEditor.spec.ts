import { expect } from '@playwright/test'
import { test } from '../../../playwright'
import { encodeAbi } from '@ensdomains/ensjs/utils'

test('should be able to maintain state when returning from transaction modal to advanced editor', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const dummyABI = 
    {
      "test":"test"
    }
  const name = await makeName({
    label: 'profile',
    type: 'legacy',
    records: {
      texts: [
        { key: 'name', value: 'Bob' },
        { key: 'text', value: 'text' },
        { key: 'com.twitter', value: '@test' },
      ],
      coins: [
        { coin: 'SOL', value: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH' },
        { coin: 'ETH', value: '0xbec1C7C11F2Fa9AB24b9E49122D26e721766DAF6' },
        { coin: 'BTC', value: '1PzAJcFtEiXo9UGtRU6iqXQKj8NXtcC7DE' },
      ],
      contentHash: 'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
      abi: await encodeAbi({ encodeAs: 'json', data: dummyABI }),
    },
  })

  const recordsPage = makePageObject('RecordsPage')
  const advancedEditor = makePageObject('AdvancedEditorModal')
  const transactionModal = makePageObject('TransactionModal')

  await recordsPage.goto(name)
  await login.connect()

  // Validate records
  await expect(recordsPage.getRecordValue('text', 'name')).toHaveText('Bob')
  await expect(recordsPage.getRecordValue('text', 'text')).toHaveText('text')
  await expect(recordsPage.getRecordValue('text', 'com.twitter')).toHaveText('@test')
  await expect(recordsPage.getRecordValue('address', 'sol')).toHaveText(
    'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  )
  await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
    '0xbec1C7C11F2Fa9AB24b9E49122D26e721766DAF6',
  )
  await expect(recordsPage.getRecordValue('address', 'btc')).toHaveText(
    '1PzAJcFtEiXo9UGtRU6iqXQKj8NXtcC7DE',
  )
  await expect(recordsPage.getRecordValue('contentHash')).toHaveText(
    'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
  )
  await expect(recordsPage.getRecordValue('abi')).toHaveText('{"test":"test"}')

  await recordsPage.editRecordsButton.click()

  // Validate advanced editor
  await expect(await advancedEditor.recordInput('text', 'text')).toHaveValue('text')
  await expect(await advancedEditor.recordInput('text', 'name')).toHaveValue('Bob')
  await expect(await advancedEditor.recordInput('text', 'com.twitter')).toHaveValue('@test')
  await expect(await advancedEditor.recordInput('address', 'SOL')).toHaveValue(
    'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  )
  await expect(await advancedEditor.recordInput('address', 'ETH')).toHaveValue(
    '0xbec1C7C11F2Fa9AB24b9E49122D26e721766DAF6',
  )
  await expect(await advancedEditor.recordInput('address', 'BTC')).toHaveValue(
    '1PzAJcFtEiXo9UGtRU6iqXQKj8NXtcC7DE',
  )
  await expect(await advancedEditor.recordInput('contentHash')).toHaveValue(
    'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
  )
  await expect(await advancedEditor.recordInput('abi')).toHaveValue('"{\\"test\\":\\"test\\"}"')

  await advancedEditor.recordClearButton('text', 'text').then((button) => button.click())
  await advancedEditor.recordClearButton('address', 'SOL').then((button) => button.click())
  await advancedEditor.recordClearButton('address', 'ETH').then((button) => button.click())
  await advancedEditor.recordInput('contentHash').then((input) => input.fill(''))
  await advancedEditor.recordInput('abi').then((input) => input.fill(''))

  await advancedEditor.saveButton.click()

  // Validate transaction display item
  await expect(transactionModal.displayItem('update')).toHaveText('5 records')

  await transactionModal.backButton.click()

  // Validate inputs have been rebuilt correctly
  await expect(await advancedEditor.recordComponent('text', 'text')).toHaveCount(0)
  await expect(await advancedEditor.recordComponent('address', 'SOL')).toHaveCount(0)
  await expect(await advancedEditor.recordComponent('address', 'ETH')).toHaveCount(0)
  await expect(await advancedEditor.recordInput('contentHash')).toHaveValue('')
  await expect(await advancedEditor.recordInput('abi')).toHaveValue('')

  await advancedEditor.saveButton.click()

  // Validate transaction display item
  await expect(transactionModal.displayItem('update')).toHaveText('5 records')

  await transactionModal.autoComplete()

  // Validate change in records
  await expect(recordsPage.getRecordButton('text', 'text')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('address', 'sol')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('address', 'eth')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('contentHash')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('abi')).toHaveCount(0)
})
