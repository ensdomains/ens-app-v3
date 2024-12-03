import { expect } from '@playwright/test'

import { encodeAbi } from '@ensdomains/ensjs/utils'

import { test } from '../../../playwright'

test('should be able to maintain state when returning from transaction modal when deleting records', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const dummyABI = {
    test: 'test',
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
  await expect(recordsPage.getRecordValue('address', 'SOL')).toHaveText(
    'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  )
  await expect(recordsPage.getRecordValue('address', 'ETH')).toHaveText(
    '0xbec1C7C11F2Fa9AB24b9E49122D26e721766DAF6',
  )
  await expect(recordsPage.getRecordValue('address', 'BTC')).toHaveText(
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
  await expect(await advancedEditor.recordInput('abi')).toHaveValue('{"test":"test"}')

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
  await expect(recordsPage.getRecordButton('address', 'SOL')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('address', 'ETH')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('contentHash')).toHaveCount(0)
  await expect(recordsPage.getRecordButton('abi')).toHaveCount(0)
})

test('should maintain state and when returning from transaction modal when adding/updating records', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
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
        { coin: 'sol', value: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH' },
        { coin: 'eth', value: '0xbec1C7C11F2Fa9AB24b9E49122D26e721766DAF6' },
        { coin: 'btc', value: '1PzAJcFtEiXo9UGtRU6iqXQKj8NXtcC7DE' },
      ],
      contentHash: 'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
      abi: await encodeAbi({ encodeAs: 'uri', data: 'https://example.com' }), // test abi uri content type
    },
  })

  // mock abi uri response
  await page.route('https://example.com', async (route) => {
    const json = { test: 'test' }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(json),
    })
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
  await expect(recordsPage.getRecordValue('address', 'SOL')).toHaveText(
    'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  )
  await expect(recordsPage.getRecordValue('address', 'ETH')).toHaveText(
    '0xbec1C7C11F2Fa9AB24b9E49122D26e721766DAF6',
  )
  await expect(recordsPage.getRecordValue('address', 'BTC')).toHaveText(
    '1PzAJcFtEiXo9UGtRU6iqXQKj8NXtcC7DE',
  )
  await expect(recordsPage.getRecordValue('contentHash')).toHaveText(
    'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
  )
  await expect(recordsPage.getRecordValue('abi')).toHaveText('https://example.com')

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
  await expect(await advancedEditor.recordInput('abi')).toHaveValue('{"test":"test"}')

  // Add and update a text record
  await page.getByTestId('text-tab').click()
  await page.getByRole('button', { name: 'Add record' }).click()
  await page.getByPlaceholder('Type a record name...').fill('another text')
  await page.getByTestId('add-record-button-action-button').click()
  await advancedEditor
    .recordInput('text', 'another text')
    .then((input) => input.fill('another record'))
  await advancedEditor.recordInput('text', 'name').then((input) => input.fill('Nick'))

  // Add and update an address record
  await page.getByTestId('address-tab').click()
  await page.getByRole('button', { name: 'Add address' }).click()
  await expect(page.getByTestId('add-record-button-option-bnb')).toHaveCount(1)
  expect(page.getByTestId('add-record-button-option-btc')).toHaveCount(0)
  expect(page.getByTestId('add-record-button-option-eth')).toHaveCount(0)
  await page.getByTestId('add-record-button-option-bnb').click()
  await advancedEditor
    .recordInput('address', 'BNB')
    .then((input) => input.fill('bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl'))
  await advancedEditor
    .recordInput('address', 'ETH')
    .then((input) => input.fill('0x70997970C51812dc3A010C7d01b50e0d17dc79C8'.toLowerCase())) // lowercase to test normalization

  // Update other records
  await advancedEditor
    .recordInput('contentHash')
    .then((input) =>
      input.fill(
        'bzz://e40101fa011b20d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
      ),
    )
  await advancedEditor.recordInput('abi').then((input) => input.fill('{"test2":"test2"}'))

  await advancedEditor.saveButton.click()

  // Validate transaction display item
  await expect(transactionModal.displayItem('update')).toHaveText('6 records')

  await transactionModal.backButton.click()

  // Validate inputs have been rebuilt correctly
  await expect(await advancedEditor.recordInput('text', 'name')).toHaveValue('Nick')
  await expect(await advancedEditor.recordInput('text', 'another text')).toHaveValue(
    'another record',
  )
  await expect(await advancedEditor.recordInput('address', 'BNB')).toHaveValue(
    'bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl',
  )
  await expect(await advancedEditor.recordInput('address', 'ETH')).toHaveValue(
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  )
  await expect(await advancedEditor.recordInput('contentHash')).toHaveValue(
    'bzz://e40101fa011b20d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
  )
  await expect(await advancedEditor.recordInput('abi')).toHaveValue('{"test2":"test2"}')

  await advancedEditor.saveButton.click()

  // Validate transaction display item
  await expect(transactionModal.displayItem('update')).toHaveText('6 records')

  await transactionModal.autoComplete()

  // Validate change in records

  await expect(recordsPage.getRecordValue('text', 'name')).toHaveText('Nick')
  await expect(recordsPage.getRecordValue('text', 'another text')).toHaveText('another record')
  await expect(recordsPage.getRecordValue('address', 'bnb')).toHaveText(
    'bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl',
  )
  await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  )

  await expect(recordsPage.getRecordValue('contentHash')).toHaveText(
    'bzz://e40101fa011b20d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'.toLowerCase(),
  )
  await expect(recordsPage.getRecordValue('abi')).toHaveText('{"test2":"test2"}')
})
