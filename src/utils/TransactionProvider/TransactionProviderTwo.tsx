import React, { useContext, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useImmerReducer } from 'use-immer'
import { useSigner } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useQuery } from 'react-query'

import { Dialog, Button, mq } from '@ensdomains/thorin'

import { useEns } from '@app/utils/EnsProvider'

import { reducer, initialState } from './reducer'
import * as selectors from './selectors'

const TransactionContext = React.createContext()

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

const LeadingButton = ({ state, actions, dispatch }) => {
  const { t } = useTranslation('common')
  const currentStep = selectors.getCurrentStep(state)

  return (
    <ButtonShrinkwrap onClick={currentStep?.buttons.leading.clickHandler({ actions, dispatch })}>
      {t(`action.${currentStep?.buttons?.leading?.type}`)}
    </ButtonShrinkwrap>
  )
}

const TrailingButton = ({ state, actions, dispatch }) => {
  const { t } = useTranslation('common')
  const currentStep = selectors.getCurrentStep(state)
  const ens = useEns()
  const { data: signer } = useSigner()
  const transactionData = selectors.getCurrentTransactionData(state)
  const addTransaction = useAddRecentTransaction()
  const gasKey = JSON.stringify(transactionData?.transactionInfo)

  const { data: estimatedGas } = useQuery(
    ['gas', gasKey],
    () => {
      return transactionData.gasEstimator({ transactionData, signer, ens })
    },
    {
      enabled: !!transactionData?.transactionInfo,
    },
  )

  if (!currentStep?.buttons?.trailing) {
    return null
  }

  return (
    <ButtonShrinkwrap
      disabled={!state.canAdvance || (currentStep.type === 'tranasaction' && !estimatedGas)}
      onClick={currentStep?.buttons.trailing.clickHandler({
        actions,
        signer,
        ens,
        transactionData,
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

export const TransactionProviderTwo = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  const stepStatus = selectors.getCurrentStepStatus(state)

  const Content = state.steps[state.currentStep]?.content

  const providerValue = useMemo(() => {
    return {
      state,
      dispatch,
      selectors,
    }
  }, [state])

  const LeadingButtonMem = useMemo(() => {
    return <LeadingButton {...{ state, dispatch }} />
  }, [state])

  const TrailingButtonMem = useMemo(() => {
    return <TrailingButton {...{ state, dispatch }} />
  }, [state])

  return (
    <TransactionContext.Provider value={providerValue}>
      {children}
      <StyledDialog
        {...{
          title: state.steps[state.currentStep]?.title,
          subtitle: stepStatus !== 'complete' && state.steps[state.currentStep]?.description,
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
