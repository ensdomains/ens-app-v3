import { test } from '..'

test('should be able to register multiple names on the address page', async ({
  page,
  accounts,
  wallet,
  Login,
  AddressPage,
}) => {
  const address = accounts.getAddress('user')
  const addresPage = new AddressPage(page)
  await addresPage.goto(address)

  await new Login(page, wallet).connect()
})
