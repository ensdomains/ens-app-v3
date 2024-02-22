import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Helper, mq } from '@ensdomains/thorin'

const Card = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['3.5']};
    border-radius: ${theme.radii['3xLarge']};
    background-color: ${theme.colors.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    gap: ${theme.space['4']};
    max-height: 75vh;
    overflow-y: auto;

    ${mq.sm.min(css`
      width: initial;
      min-width: ${theme.space['128']};
    `)}
  `,
)

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function Page() {
  const { t } = useTranslation()

  // TODO: reimplement ?
  // useEffect(() => {
  //   if (currentChain?.id && getSupportedChainById(currentChain.id)) {
  //     router.push('/')
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentChain?.id])

  const handleChangeNetwork = () => {
    // switchNetwork?.(1)
  }

  return (
    <Container>
      <Card>
        <Helper type="error">{t('unsupportedNetwork')}</Helper>
        <Button onClick={handleChangeNetwork}>{t('action.changeNetwork')}</Button>
      </Card>
    </Container>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Container>{page}</Container>
}
