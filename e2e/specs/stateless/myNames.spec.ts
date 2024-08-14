import { test } from '../../../playwright'

test('myNames', async ({ page, login, makeName }) => {
  const nameConfig = Array.from({ length: 20 }).map((_, i) => ({
    label: `name${i}`,
    type: 'legacy',
    owner: 'user2',
  }))

  console.log('nameConfig:', nameConfig)
  const names = await makeName(nameConfig as any)
  console.log('names:', names)

  await page.goto('/')
  await login.connect('user2')

  await page.goto('/my/names')

  await page.pause()
})
