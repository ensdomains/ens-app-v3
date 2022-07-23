import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { DisplayItems } from '@app/components/@molecules/TransactionModal/DisplayItems'
import PaperPlaneColourSVG from '@app/assets/PaperPlaneColour.svg'
import { useChainName } from '@app/hooks/useChainName'
import { Outlink } from '@app/components/Outlink'
import { makeEtherscanLink } from '@app/utils/utils'

import { WaitingElement } from './waitingElement'

const TextContainer = styled.div(
  ({ theme }) => css`
    max-width: ${theme.space['96']};
    text-align: center;
  `,
)

export const TransactionStep = ({ actions, state }) => {
  const { t } = useTranslation()

  const currentStep = state.steps[state.currentStep]
  const { error } = state.steps[state.currentStep]

  return (
    <>
      {currentStep.stepStatus === 'inProgress' ? (
        <WaitingElement
          {...{
            title: t('transaction.modal.confirm.waiting.title'),
            subtitle: t('transaction.modal.confirm.waiting.subtitle'),
          }}
        />
      ) : null}
      <TextContainer>{error ? <Typography color="red">{error}</Typography> : null}</TextContainer>
      {currentStep.stepStatus === 'completed' ? (
        <>
          <PaperPlaneColourSVG />
          <Typography>Your transaction has been sent to the network.</Typography>
        </>
      ) : null}

      <DisplayItems displayItems={currentStep.infoItems} />
    </>
  )
}

export const createTransactionStep = () => ({
  type: 'transaction',
  transactionType: 'updateResolver',
  title: 'Send Transaction',
  description: 'Confirm the details of the transaction',
  stepStatus: 'notStarted',
  content: TransactionStep,
  error: null,
  infoItems: [
    {
      label: 'action',
      value: 'Update Resolver',
    },
    {
      label: 'info',
      value: 'Update your current resolver to the new one you have selected',
    },
    {
      label: 'currentResolver',
      value: 'shouldGetUpdated',
      type: 'address',
    },
    {
      label: 'newResolver',
      value: 'shouldGetUpdated',
      type: 'address',
    },
  ],
  buttons: {
    leading: {
      type: 'back',
      clickHandler:
        ({ dispatch }) =>
        () => {
          dispatch({
            type: 'updateStep',
            payload: { error: null },
          })
          dispatch({
            type: 'decreaseStep',
          })
        },
    },
    trailing: {
      type: 'send',
      clickHandler:
        ({ signer, ens, transactionData, addTransaction, dispatch, estimatedGas }) =>
        async () => {
          dispatch({
            type: 'updateStep',
            payload: { error: null, stepStatus: 'inProgress' },
          })

          const transaction = await ens.setResolver.populateTransaction(
            transactionData.transactionInfo.name,
            {
              contract: 'registry',
              resolver: transactionData.transactionInfo.newResolver,
              signer,
            },
          )

          let transactionHash
          try {
            transactionHash = await signer.sendUncheckedTransaction({
              ...transaction,
              gasLimit: estimatedGas,
            })
          } catch (e) {
            dispatch({
              type: 'updateStep',
              payload: { error: e.message, stepStatus: 'notStarted' },
            })
            return
          }
          if (!transactionHash) throw new Error('No transaction generated')

          addTransaction({
            description: JSON.stringify({ action: 'updateResolver', key: transactionHash }),
            hash: transactionHash,
          })

          dispatch({
            type: 'updateStep',
            payload: { stepStatus: 'completed', error: null },
          })
          dispatch({ type: 'setUpdateResolverCompletionInfo', payload: transaction })
          dispatch({ type: 'increaseStep' })
        },
    },
  },
  transaction: {
    transactionInfo: null,
    gasEstimator: async ({ transactionData, signer, ens }) => {
      const transaction = await ens.setResolver.populateTransaction(
        transactionData.transactionInfo.name,
        {
          contract: 'registry',
          resolver: transactionData.transactionInfo.newResolver,
          signer,
        },
      )
      const estimatedGas = await signer?.estimateGas(transaction)
      return estimatedGas
    },
  },
})

export const MiningStep = ({ state, dispatch }) => {
  const currentStep = state.steps[state.currentStep]
  const transactions = useRecentTransactions()
  const { transactionHash } = currentStep.transaction
  const chainName = useChainName()
  const { t } = useTranslation('common')

  useEffect(() => {
    const currentTransaction = transactions[0]
    if (currentTransaction.status === 'confirmed') {
      dispatch({
        type: 'updateStep',
        payload: {
          title: 'Transaction confirmed',
          stepStatus: 'completed',
        },
      })
    }
  }, [transactions])

  return (
    <>
      {currentStep.stepStatus === 'inProgress' ? (
        <>
          <WaitingElement
            {...{
              title: 'Waiting for transaction to be saved to the blockchain',
              subTitle: 'Estimated time: 15 seconds',
            }}
          />
          <TextContainer>
            <Typography>
              Your transaction has been sent to the network, but may take some time to confirm. You
              may close this dialog and we'll send you a notification when it's ready.
            </Typography>
          </TextContainer>
        </>
      ) : null}
      {currentStep.stepStatus === 'completed' ? (
        <>
          <PaperPlaneColourSVG />
          <TextContainer>
            <Typography>Your transaction has been saved to the blockchain!</Typography>
          </TextContainer>
          <Outlink href={makeEtherscanLink(transactionHash.data!, chainName)}>
            {t('transaction.viewEtherscan')}
          </Outlink>
        </>
      ) : null}

      <DisplayItems displayItems={currentStep.infoItems} />
    </>
  )
}

export const createMiningStep = () => ({
  type: 'completedTransaction',
  transactionType: 'updateResolver',
  title: 'Transaction confirmation',
  stepStatus: 'inProgress',
  content: MiningStep,
  description: '',
  error: null,
  infoItems: [
    {
      label: 'action',
      value: 'Update Resolver',
    },
    {
      label: 'info',
      value: 'Update your current resolver to the new one you have selected',
    },
  ],
  buttons: {
    leading: {
      type: 'close',
      clickHandler:
        ({ dispatch }) =>
        () => {
          dispatch({ type: 'cancelFlow' })
        },
    },
    trailing: null,
  },
  transaction: {},
})
