import { test } from '..'

const testFile = async () => {
  await setTimeout(Promise.resolve, 4000)
}

test.describe.parallel(() => {
  test('parallel 1', testFile)
  test('parallel 2', testFile)
  test('parallel 3', testFile)
  test('parallel 4', testFile)
  test('parallel 5', testFile)
  test('parallel 6', testFile)
  test('parallel 7', testFile)
  test('parallel 8', testFile)
  test('parallel 9', testFile)
  test('parallel 10', testFile)
})

test.describe.serial(() => {
  test('serial 1', testFile)
  test('serial 2', testFile)
  test('serial 3', testFile)
  test('serial 4', testFile)
  test('serial 5', testFile)
  test('serial 6', testFile)
  test('serial 7', testFile)
  test('serial 8', testFile)
  test('serial 9', testFile)
  test('serial 10', testFile)
})
