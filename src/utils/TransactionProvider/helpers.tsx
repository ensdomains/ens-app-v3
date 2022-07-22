import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { Spinner, Typography } from '@ensdomains/thorin'

import { DisplayItems } from '@app/components/@molecules/TransactionModal/DisplayItems'
import PaperPlaneColourSVG from '@app/assets/PaperPlaneColour.svg'

const WaitingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['3']};
  `,
)

const WaitingTextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    color: ${theme.colors.textSecondary};
  `,
)

const StyledSpinner = styled(Spinner)(
  ({ theme }) => css`
    width: ${theme.space['9']};
    height: ${theme.space['9']};
  `,
)

export const WaitingElement = () => {
  const { t } = useTranslation()

  return (
    <WaitingContainer>
      <StyledSpinner color="accent" />
      <WaitingTextContainer>
        <Typography weight="bold">{t('transaction.modal.confirm.waiting.title')}</Typography>
        <Typography>{t('transaction.modal.confirm.waiting.subtitle')}</Typography>
      </WaitingTextContainer>
    </WaitingContainer>
  )
}

export const TransactionStep = ({ state }) => {
  const currentStep = state.steps[state.currentStep]

  return (
    <>
      {currentStep.stepStatus === 'inProgress' ? <WaitingElement /> : null}
      {currentStep.stepStatus === 'complete' ? (
        <>
          <PaperPlaneColourSVG />
          <Typography>
            Your transaction has been sent to the network, but may take some time to confirm. You
            may close this dialog.
          </Typography>
        </>
      ) : null}

      {/* <DisplayItems displayItems={currentStep.infoItems} /> */}
    </>
  )
}

export const createUpdateResolverCompleteStep = () => ({
  type: 'completedTransaction',
  transactionType: 'updateResolver',
  title: 'Transaction mining',
  setpStatus: 'inProgress',
  content: TransactionStep,
  description:
    'Your transaction has been sent to the network, and is waiting to be saved to the blockchain. You may close this dialog.',
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
      label: 'newResolver',
      value: 'shouldGetUpdated',
      type: 'address',
    },
  ],
  buttons: {
    leading: {
      type: 'back',
      clickHandler:
        ({ actions, currentStep }) =>
        async () => {
          if (currentStep.buttons.leading.type === 'cancel') {
            actions.cancelFlow()
          }
          if (currentStep.buttons.leading.type === 'back') {
            actions.decreaseStep()
          }
        },
    },
    trailing: null,
  },
})

export const createUpdateResolverTransactionStep = () => ({
  type: 'transaction',
  transactionType: 'updateResolver',
  title: 'Transaction Request',
  description: 'Confirm the details of the transaction',
  stepStatus: 'notStarted',
  content: TransactionStep,
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
        ({ actions, currentStep }) =>
        async () => {
          if (currentStep.buttons.leading.type === 'cancel') {
            actions.cancelFlow()
          }
          if (currentStep.buttons.leading.type === 'back') {
            actions.decreaseStep()
          }
        },
    },
    trailing: {
      type: 'update',
      clickHandler:
        ({ actions, signer, ens, transactionData }) =>
        async () => {
          actions.setStepStatus('inProgress')
          const transaction = await transactionData.transactionFunction(
            signer,
            ens,
            transactionData,
          )
          actions.setStepStatus('complete')
          actions.increaseStep()
        },
    },
  },
  transaction: {
    type: null,
    transactionStatus: 'notStarted',
    transactionFunction: async (signer, ens, transactionData) => {
      const transaction = await ens[transactionData.transactionExecutor].populateTransaction(
        transactionData.transactionInfo.name,
        {
          contract: 'registry',
          resolver: transactionData.transactionInfo.newResolver,
          signer,
        },
      )
      const estimatedGas = await signer?.estimateGas(transaction)

      const { hash } = await signer.sendTransaction({
        ...transaction,
        gasLimit: estimatedGas!,
      })
      if (!hash) throw new Error('No transaction generated')
      console.log('hash: ', hash)
      return hash
    },
    transactionExecutor: 'setResolver',
    transactionInfo: null,
  },
})

export const createCompleteStep = () => <div>complete</div>
