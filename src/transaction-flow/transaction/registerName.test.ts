import { BigNumber } from '@ethersproject/bignumber'

import registerName from './registerName'

const mockEns = {
  getPrice: async () => ({
    base: BigNumber.from(100),
    premium: BigNumber.from(0),
  }),
  registerName: {
    populateTransaction: (...args: any[]) => args,
  },
}

it('adds a 2% value buffer to the transaction from the real price', async () => {
  const result = (await registerName.transaction(
    {} as any,
    mockEns as any,
    {
      name: 'test.eth',
    } as any,
  )) as [string, { value: BigNumber }]
  const data = result[1]
  expect(data.value).toEqual(BigNumber.from(102))
})
