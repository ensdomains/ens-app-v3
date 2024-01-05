import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, FastForwardSVG, mq } from '@ensdomains/thorin'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { shouldShowExtendWarning } from '@app/utils/abilities/shouldShowExtendWarning'

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
  const abilities = useAbilities(name)
  const { prepareDataInput } = useTransactionFlow()
  const showExtendNamesInput = prepareDataInput('ExtendNames')

  if (!abilities.data?.canExtend) return null

  return (
    <ButtonContainer>
      <Button
        onClick={() => {
          showExtendNamesInput(`extend-names-${name}`, {
            names: [name],
            isSelf: shouldShowExtendWarning(abilities.data),
          })
        }}
        prefix={<FastForwardIcon as={FastForwardSVG} />}
      >
        {t('action.extend')}
      </Button>
    </ButtonContainer>
  )
}
