import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography, mq } from '@ensdomains/thorin'

import { NightSky } from '@app/assets/NightSky'
import SparklesSVG from '@app/assets/Sparkles.svg'
import { Card } from '@app/components/Card'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'

const Container = styled(Card)(
  ({ theme }) => css`
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['3']};
    padding: ${theme.space['3']};

    ${mq.md.min(css`
      flex-direction: row;
      padding-right: ${theme.space['5']};
    `)}
  `,
)

const InnerContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: ${theme.space.full};

    padding: 0 ${theme.space['2']};
    padding-top: ${theme.space['1']};

    ${mq.md.min(css`
      flex-grow: 1;
      flex-direction: row-reverse;
      justify-content: flex-end;
      gap: ${theme.space['6']};
      padding: ${theme.space['2']};
    `)}
  `,
)

const Heading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.background};
    line-height: ${theme.lineHeights.normal};
  `,
)

const Subheading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.background};
    opacity: 0.8;
  `,
)

const Sparkles = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['12']};
    height: ${theme.space['12']};
  `,
)

const TextContainer = styled.div(
  () => css`
    width: fit-content;
  `,
)

const UpgradeButton = styled(Button)(
  ({ theme }) => css`
    & {
      background: ${theme.colors.backgroundTertiary};
      color: ${theme.colors.foreground};
    }
    &:hover {
      background: ${theme.colors.background};
    }
    ${mq.md.min(css`
      max-width: ${theme.space['64']};
      height: ${theme.space.full};
    `)}
  `,
)

export const WrapperCallToAction = ({ name }: { name: string }) => {
  const { t } = useTranslation('profile')

  const { createTransactionFlow, resumeTransactionFlow, getResumable } = useTransactionFlow()
  const resumable = getResumable(`wrapName-${name}`)

  const handleUpgradeClick = () =>
    resumable
      ? resumeTransactionFlow(`wrapName-${name}`)
      : createTransactionFlow(`wrapName-${name}`, {
          transactions: [
            makeTransactionItem('migrateProfile', {
              name,
            }),
            makeTransactionItem('wrapName', {
              name,
            }),
          ],
          resumable: true,
          intro: {
            title: t('details.wrap.startTitle'),
            content: makeIntroItem('WrapName', { name }),
          },
        })

  return (
    <NightSky>
      <Container data-testid="wrapper-cta-container">
        <InnerContainer>
          <TextContainer>
            <Heading variant="extraLarge" weight="bold">
              {t('details.wrap.boxTitle')}
            </Heading>
            <Subheading>{t('details.wrap.boxDescription')}</Subheading>
          </TextContainer>
          <Sparkles as={SparklesSVG} />
        </InnerContainer>
        <UpgradeButton data-testid="wrapper-cta-button" shadowless onClick={handleUpgradeClick}>
          {resumable ? t('details.wrap.resumeLabel') : t('details.wrap.startLabel')}
        </UpgradeButton>
      </Container>
    </NightSky>
  )
}
