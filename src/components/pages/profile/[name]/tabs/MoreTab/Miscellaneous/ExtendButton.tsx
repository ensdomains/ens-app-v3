import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, FastForwardSVG, mq } from '@ensdomains/thorin'

import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

const FastForwardIcon = styled.svg(
  ({ theme }) => css`
    display: block;
    color: ${theme.colors.background};
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 100%;
    ${mq.sm.min(css`
      width: fit-content;
      min-width: ${theme.space['40']};
      max-width: max-content;
    `)}
  `,
)

export const ExtendButton = ({ name }: { name: string }) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { canExtend, canEdit } = useSelfAbilities(address, name)
  const { prepareDataInput } = useTransactionFlow()
  const showExtendNamesInput = prepareDataInput('ExtendNames')

  if (!canExtend) return null

  return (
    <ButtonContainer>
      <Button
        onClick={() => {
          showExtendNamesInput(`extend-names-${name}`, {
            names: [name],
            isSelf: canEdit,
          })
        }}
        prefix={<FastForwardIcon as={FastForwardSVG} />}
      >
        {t('action.extend')}
      </Button>
    </ButtonContainer>
  )
}
