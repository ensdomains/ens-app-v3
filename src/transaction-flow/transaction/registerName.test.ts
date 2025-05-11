import { mockFunction } from '@app/test-utils'

import { expect, it, vi } from 'vitest'

import { getPrice } from '@ensdomains/ensjs/public'
import { legacyRegisterName, registerName } from '@ensdomains/ensjs/wallet'

import registerNameFlowTransaction from './registerName'

vi.mock('@ensdomains/ensjs/public')
vi.mock('@ensdomains/ensjs/wallet')

const mockGetPrice = mockFunction(getPrice)
const mockRegisterName = mockFunction(registerName.makeFunctionData)
const mockLegacyRegisterName = mockFunction(legacyRegisterName.makeFunctionData)

mockGetPrice.mockImplementation(async () => ({ base: 100n, premium: 0n }))
mockRegisterName.mockImplementation((...args: any[]) => args as any)
mockLegacyRegisterName.mockImplementation((...args: any[]) => args as any)

it('adds a 2% value buffer to the transaction from the real price', async () => {
  const result = (await registerNameFlowTransaction.transaction({
    client: {} as any,
    connectorClient: { walletClient: true } as any,
    data: { name: 'test.eth' } as any,
  })) as unknown as [{ walletClient: true }, { name: string; value: bigint }]
  const data = result[1]
  expect(data.value).toEqual(102n)
})
