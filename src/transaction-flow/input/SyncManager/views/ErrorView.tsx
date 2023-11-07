import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog } from '@ensdomains/thorin2'

import { SearchViewErrorView } from '../../SendName/views/SearchView/views/SearchViewErrorView'

const Container = styled.div(
  ({ theme }) => css`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space[4]};
  `,
)

const SubviewContainer = styled.div(
  () => css`
    position: relative;
  `,
)

type Props = {
  onCancel: () => void
}

export const ErrorView = ({ onCancel }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <Container>
      <SubviewContainer>
        <SearchViewErrorView />
      </SubviewContainer>
      <Dialog.Footer
        trailing={
          <Button colorStyle="redSecondary" onClick={onCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
      />
    </Container>
  )
}
