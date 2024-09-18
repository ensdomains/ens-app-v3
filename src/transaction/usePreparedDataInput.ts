import type { ComponentProps } from 'react'
import { useAccount } from 'wagmi'

import { useTransactionStore } from './transactionStore'
import { DataInputComponents, type DataInputComponent, type DataInputName } from './user/input'

type ShowDataInput<name extends DataInputName> = (
  flowId: string,
  data: ComponentProps<DataInputComponent[name]>['data'],
  options?: {
    disableBackgroundClick?: boolean
  },
) => void

export const usePreparedDataInput = <name extends DataInputName>(name: name) => {
  const showInput = useTransactionStore((s) => s.flow.showInput)
  const { address } = useAccount()
  if (address) (DataInputComponents[name] as any).render.preload()

  const func: ShowDataInput<name> = (flowId, data, options) =>
    showInput(flowId, {
      input: {
        name,
        data: data as never,
      },
      disableBackgroundClick: options?.disableBackgroundClick,
    })

  return func
}
