import React, { useContext, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useImmerReducer } from 'use-immer'
import { useSigner } from 'wagmi'
import { useTranslation } from 'react-i18next'

import { Dialog, Button, mq } from '@ensdomains/thorin'

import { useEns } from '@app/utils/EnsProvider'

import { reducer, initialState } from './reducer'
import { createDispatchers } from './actions'
import * as helpers from './helpers'
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

const LeadingButton = ({ state, actions }) => {
  const { t } = useTranslation('common')
  const currentStep = selectors.getCurrentStep(state)

  return (
    <ButtonShrinkwrap onClick={currentStep?.buttons.leading.clickHandler({ actions })}>
      {t(`action.${currentStep?.buttons?.leading?.type}`)}
    </ButtonShrinkwrap>
  )
}

const TrailingButton = ({ state, actions }) => {
  const { t } = useTranslation('common')
  const currentStep = selectors.getCurrentStep(state)
  const ens = useEns()
  const { data: signer } = useSigner()
  const transactionData = selectors.getCurrentTransactionData(state)

  if (!currentStep?.buttons?.trailing) {
    return null
  }

  return (
    <ButtonShrinkwrap
      disabled={!state.canAdvance}
      onClick={currentStep?.buttons.trailing.clickHandler({
        actions,
        signer,
        ens,
        transactionData,
      })}
    >
      {t(`action.${currentStep?.buttons?.trailing?.type}`)}
    </ButtonShrinkwrap>
  )
}

export const TransactionProviderTwo = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState)
  const actions = useMemo(() => createDispatchers(dispatch), [])

  const stepStatus = selectors.getCurrentStepStatus(state)

  const Content = state.steps[state.currentStep]?.content

  const providerValue = useMemo(() => {
    return {
      state,
      dispatch,
      actions,
      selectors,
      helpers,
    }
  }, [state])

  const LeadingButtonMem = useMemo(() => {
    return <LeadingButton {...{ state, actions }} />
  }, [state, actions])

  const TrailingButtonMem = useMemo(() => {
    return <TrailingButton {...{ state, actions }} />
  }, [state, actions])

  return (
    <TransactionContext.Provider value={providerValue}>
      {children}
      <Dialog
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
      </Dialog>
    </TransactionContext.Provider>
  )
}

export const useTransactionTwo = () => {
  const context = useContext(TransactionContext)
  return context
}
