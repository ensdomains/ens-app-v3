/* eslint-disable no-param-reassign */
import { getAccount, watchChainId } from '@wagmi/core'
import type { Address } from 'viem'
import type { StateCreator } from 'zustand'

import type { SourceChain, SupportedChain } from '@app/constants/chains'
import { getSourceChainId } from '@app/utils/query/getSourceChainId'
import { wagmiConfig } from '@app/utils/query/wagmi'

import type { FlowId } from './createFlowSlice'
import type { AllSlices, MiddlewareArray } from './types'

export type CurrentSlice = {
  current: {
    sourceChainId: SourceChain['id'] | null
    account: Address | null
    flowId: FlowId | null
    _previousFlowId: FlowId | null
  }
  onChainIdUpdate: (chainId: SupportedChain['id']) => void
  onAccountUpdate: (account: Address | undefined) => void
  _hasHydrated: boolean
  _setHasHydrated: (hasHydrated: boolean) => void
}

export const createCurrentSlice: StateCreator<AllSlices, MiddlewareArray, [], CurrentSlice> = (
  set,
) => {
  const onChainIdUpdate = (chainId: SupportedChain['id']) =>
    set((state) => {
      const oldSourceChainId = state.current.sourceChainId
      const newSourceChainId = getSourceChainId(chainId)
      if (oldSourceChainId !== newSourceChainId) {
        state.current.sourceChainId = newSourceChainId
        state.current.flowId = null
        state.clearNotifications()
      }
    })

  const onAccountUpdate = (account: Address | undefined) =>
    set((state) => {
      state.current.account = account ?? null
      state.current.flowId = null
      state.clearNotifications()
    })

  wagmiConfig.subscribe(() => getAccount(wagmiConfig).address, onAccountUpdate)

  watchChainId(wagmiConfig, {
    onChange: onChainIdUpdate,
  })
  return {
    current: {
      sourceChainId: null,
      account: null,
      flowId: null,
      _previousFlowId: null,
    },
    onChainIdUpdate,
    onAccountUpdate,
    _hasHydrated: false,
    _setHasHydrated: (hasHydrated) =>
      set((state) => {
        state._hasHydrated = hasHydrated
      }),
  }
}
