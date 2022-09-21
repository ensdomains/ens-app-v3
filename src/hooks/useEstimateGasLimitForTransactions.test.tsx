import { renderHook } from '@app/test-utils'

import { useEstimateGasLimitForTransactions } from './useEstimateGasLimitForTransactions'

describe('useEstimateGasLimitForTransactions', () => {
  it('should return gas limit', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEstimateGasLimitForTransactions([
        {
          name: 'extendNames',
          data: {
            names: ['test.eth'],
            years: 1,
          },
        },
      ]),
    )

    await waitForNextUpdate()

    console.log(result.current)

    // await waitForNextUpdate()

    // console.log(result.current)

    // expect(result.current).toEqual([21000])
  })
})
