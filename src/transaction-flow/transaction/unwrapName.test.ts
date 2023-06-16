import unwrapName from './unwrapName'

describe('unwrapName', () => {
  const name = 'myname.eth'
  const data = { name }

  describe('displayItems', () => {
    it('returns the correct display items', () => {
      const t = (key: string) => key
      const items = unwrapName.displayItems(data, t)
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
    const signer: any = { getAddress: () => Promise.resolve(address) }
    const mockPopulateTransaction = jest.fn()
    const ens = { unwrapName: { populateTransaction: mockPopulateTransaction } } as any

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should provide controller and registrant when name is an eth 2ld', async () => {
      await unwrapName.transaction(signer, ens, data)
      expect(mockPopulateTransaction).toHaveBeenCalledWith(
        name,
        expect.objectContaining({
          newController: address,
          newRegistrant: address,
          signer,
        }),
      )
    })

    it('should not provide registrant when name is not an eth 2ld', async () => {
      const subname = 'sub.myname.eth'
      const dataWithSubname = { name: subname }
      await unwrapName.transaction(signer, ens, dataWithSubname)
      expect(mockPopulateTransaction).toHaveBeenCalledWith(
        subname,
        expect.objectContaining({
          newController: address,
          newRegistrant: undefined,
          signer,
        }),
      )
    })
  })
})
