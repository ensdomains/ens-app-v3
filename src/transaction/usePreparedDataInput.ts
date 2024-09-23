import type { ComponentProps } from 'react'
import { useAccount } from 'wagmi'

import { useTransactionManager } from './transactionManager'
import {
  transactionInputComponents,
  type TransactionInputComponent,
  type TransactionInputName,
} from './user/input'

type ShowDataInput<name extends TransactionInputName> = (
  flowId: string,
  data: ComponentProps<TransactionInputComponent[name]>['data'],
  options?: {
    disableBackgroundClick?: boolean
  },
) => void

export const usePreparedDataInput = <name extends TransactionInputName>(name: name) => {
  const showInput = useTransactionManager((s) => s.showFlowInput)
  const { address } = useAccount()
  if (address) (transactionInputComponents[name] as any).render.preload()

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
