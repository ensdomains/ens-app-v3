import React, { ReactNode, useContext, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useImmerReducer } from 'use-immer'
import { useSigner } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useQuery } from 'react-query'

import { Dialog, Button, mq } from '@ensdomains/thorin'

import { useEns } from '@app/utils/EnsProvider'

import { DispatchFn, TransactionState } from '@app/types'
import { JsonRpcSigner } from '@ethersproject/providers'
import { reducer, initialState } from './reducer'
import * as selectors from './selectors'

type ProviderValue = {
  state: TransactionState
  dispatch: DispatchFn
}
const TransactionContext = React.createContext<ProviderValue | null>(null)

const InnerDialog = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    padding: 0 ${theme.space['5']};
    gap: ${theme.space['4']};
    max-height: 60vh;
    overflow-y: auto;
    ${mq.sm.min(css`
      min-width: ${theme.space['128']};
    `)}
  `,
)

const ButtonShrinkwrap = styled(Button)(
  () => css`
    width: 80%;
    flex-shrink: 1;
    ${mq.md.min(css`
      width: 100%;
    `)}
  `,
)

const LeadingButton = ({ state, dispatch }: { state: TransactionState; dispatch: DispatchFn }) => {
  const { t } = useTranslation('common')
  const currentStep = selectors.getCurrentStep(state)

  return (
    <ButtonShrinkwrap onClick={currentStep?.buttons.leading.clickHandler({ dispatch })}>
      {t(`action.${currentStep?.buttons?.leading?.type}`)}
    </ButtonShrinkwrap>
  )
}

const TrailingButton = ({ state, dispatch }: { state: TransactionState; dispatch: DispatchFn }) => {
  const { t } = useTranslation('common')
  const currentStep = selectors.getCurrentStep(state)
  const ens = useEns()
  const { data: signer } = useSigner()
  const addTransaction = useAddRecentTransaction()
  const gasKey = JSON.stringify(currentStep?.transactionInfo)

  const { data: estimatedGas } = useQuery(
    ['gas', gasKey],
    () => {
      if (!signer) return undefined
      return currentStep.gasEstimator({ currentStep, signer: signer as JsonRpcSigner, ens })
    },
    {
      enabled: !!currentStep?.transactionInfo && !!signer,
    },
  )

  if (!currentStep?.buttons?.trailing) {
    return null
  }

  return (
    <ButtonShrinkwrap
      disabled={!state.canAdvance || (currentStep.type === 'transaction' && !estimatedGas)}
      onClick={currentStep?.buttons.trailing.clickHandler({
        signer: signer as JsonRpcSigner,
        ens,
        currentStep,
        addTransaction,
        dispatch,
        estimatedGas,
      })}
    >
      {t(`action.${currentStep?.buttons?.trailing?.type}`)}
    </ButtonShrinkwrap>
  )
}

const StyledDialog = styled(Dialog)(
  () => css`
    transition: all 1s ease-in-out;
  `,
)

export const TransactionProviderTwo = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  const Content = state.steps[state.currentStep]?.content

  const providerValue = useMemo(() => {
    return {
      state,
      dispatch,
    }
  }, [state, dispatch])

  const LeadingButtonMem = useMemo(() => {
    return <LeadingButton {...{ state, dispatch }} />
  }, [state, dispatch])

  const TrailingButtonMem = useMemo(() => {
    return <TrailingButton {...{ state, dispatch }} />
  }, [state, dispatch])

  return (
    <TransactionContext.Provider value={providerValue}>
      {children}
      <StyledDialog
        {...{
          title: state.steps[state.currentStep]?.title,
          subtitle: state.steps[state.currentStep]?.description,
          open: state.isOpen,
          variant: 'actionable',
          leading: LeadingButtonMem,
          trailing: TrailingButtonMem,
          currentStep: state.currentStep,
          stepCount: state.steps.length,
          stepStatus: state.steps[state.currentStep]?.stepStatus,
        }}
      >
        <InnerDialog>{Content ? <Content {...providerValue} /> : null}</InnerDialog>
      </StyledDialog>
    </TransactionContext.Provider>
  )
}

export const useTransactionTwo = () => {
  const context = useContext(TransactionContext)
  return context
}
