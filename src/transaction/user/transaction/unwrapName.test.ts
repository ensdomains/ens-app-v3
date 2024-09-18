import { mockFunction } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { unwrapName } from '@ensdomains/ensjs/wallet'

import { ClientWithEns, ConnectorClientWithEns } from '@app/types'

import unwrapNameFlowTransaction from './unwrapName'

vi.mock('wagmi')

vi.mock('@ensdomains/ensjs/wallet')

const mockUnwrapName = mockFunction(unwrapName.makeFunctionData)

describe('unwrapName', () => {
  const name = 'myname.eth'
  const data = { name }

  describe('displayItems', () => {
    it('returns the correct display items', () => {
      const t = (key: string) => key
      const items = unwrapNameFlowTransaction.displayItems(data, t)
      expect(items).toEqual([
        {
          label: 'action',
          value: 'transaction.description.unwrapName',
        },
        {
          label: 'name',
          value: name,
          type: 'name',
        },
      ])
    })
  })

  describe('transaction', () => {
    const address = '0x123'
    const connectorClient = { account: { address } } as unknown as ConnectorClientWithEns
    const client = {} as unknown as ClientWithEns

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('should provide controller and registrant when name is an eth 2ld', async () => {
      await unwrapNameFlowTransaction.transaction({
        client,
        connectorClient,
        data: { name: 'test.eth' },
      })
      expect(mockUnwrapName).toHaveBeenCalledWith(
        connectorClient,
        expect.objectContaining({
          name: 'test.eth',
          newOwnerAddress: address,
          newRegistrantAddress: address,
        }),
      )
    })

    it('should not provide registrant when name is not an eth 2ld', async () => {
      const subname = 'sub.test.eth'
      const dataWithSubname = { name: subname }
      await unwrapNameFlowTransaction.transaction({
        client,
        connectorClient,
        data: dataWithSubname,
      })
      expect(mockUnwrapName).toHaveBeenCalledWith(
        connectorClient,
        expect.objectContaining({
          name: 'sub.test.eth',
          newOwnerAddress: address,
        }),
      )
    })
  })
})
