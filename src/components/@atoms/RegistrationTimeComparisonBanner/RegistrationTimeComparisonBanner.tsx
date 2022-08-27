import styled, { css } from 'styled-components'
import { InfoSVG } from '@ensdomains/thorin'
import mq from '@app/mediaQuery'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    border: 1px solid ${theme.colors.accent};
    background: ${theme.colors.accentSecondary};
    padding: ${theme.space['4']};
    border-radius: ${theme.space['2']};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
    align-items: center;
  `,
)

const IconWrapper = styled.div(
  ({ theme }) => css`
    svg {
      width: ${theme.space['6']};
      height: ${theme.space['6']};
      path {
        fill: ${theme.colors.accent};
      }
    }
  `,
)

const Message = styled.div(
  ({ theme }) => css`
    line-height: ${theme.space['5']};
    font-weight: ${theme.fontWeights.light};
    color: ${theme.colors.text};
    text-align: center;
  `,
)

const ChartContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
)

const ChartTop = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['0.5']};
  `,
)

const ChartBar = styled.div<{
  $flex: number
  $highlight?: boolean
}>(
  ({ theme, $flex, $highlight }) => css`
    flex: ${$flex};
    margin-top: ${theme.space['1']};
    background: ${$highlight ? theme.colors.accent : theme.colors.red};
    height: ${theme.space['2']};
    border-radius: ${theme.space['0.5']};
  `,
)

const ChartMarker = styled.div<{ $highlight?: boolean }>(
  ({ theme, $highlight }) => css`
    position: relative;
    background: ${$highlight ? theme.colors.accent : theme.colors.white};
    width: ${theme.space['1']};
    height: ${theme.space['4']};
    border-top-left-radius: ${theme.space['0.5']};
    border-top-right-radius: ${theme.space['0.5']};
  `,
)

const ChartTag = styled.div<{ $highlight?: boolean }>(({ theme, $highlight }) => [
  css`
    position: absolute;
    top: 100%;
    left: ${theme.space['0.5']};
    background: ${$highlight ? theme.colors.accent : theme.colors.white};
    padding: ${theme.space['1']};
    transform: translateX(-50%);
    height: ${theme.space['10']};
    line-height: ${theme.space['4']};
    font-size: ${theme.space['3']};
    border-radius: ${theme.space['1']};
    color: ${$highlight ? theme.colors.white : theme.colors.text};
    > div {
      white-space: nowrap;
      text-align: center;
    }
    > div:first-child {
      font-weight: ${theme.fontWeights.bold};
    }
  `,
  mq.sm.min(css`
    padding: ${theme.space['1']} ${theme.space['2']};
  `),
])

const ChartBottom = styled.div(
  ({ theme }) => css`
    display: flex;
    height: ${theme.space['10']};
  `,
)

type Props = {
  rentFee: number
  transactionFee: number
  message?: string
  year1?: string
  year5?: string
  year15?: string
  gasLabel?: string
}

export const RegistrationTimeComparisonBanner = ({
  message,
  rentFee,
  transactionFee,
  year1 = '1 year',
  year5 = '5 years',
  year15 = '15 years',
  gasLabel = 'gas',
}: Props) => {
  const oneYearGasPercentage = Math.round((transactionFee / (rentFee + transactionFee)) * 100)
  const fiveYearGasPercentage = Math.round((transactionFee / (rentFee * 5 + transactionFee)) * 100)
  const fifteenYearGasPercentage = Math.round(
    (transactionFee / (rentFee * 15 + transactionFee)) * 100,
  )

  const flex1 = 100 - oneYearGasPercentage
  const flex2 = 100 - fiveYearGasPercentage - flex1
  const flex3 = 100 - fifteenYearGasPercentage - flex2 - flex1
  const flex4 = fifteenYearGasPercentage

  return (
    <Container>
      <IconWrapper>
        <InfoSVG />
      </IconWrapper>
      {message && <Message>{message}</Message>}
      <ChartContainer>
        <ChartTop>
          <ChartBar $flex={flex1} $highlight />
          <ChartMarker>
            <ChartTag>
              <div>{year1}</div>
              <div>
                {oneYearGasPercentage}% {gasLabel}
              </div>
            </ChartTag>
          </ChartMarker>
          <ChartBar $flex={flex2} $highlight />
          <ChartMarker>
            <ChartTag>
              <div>{year5}</div>
              <div>
                {fiveYearGasPercentage}% {gasLabel}
              </div>
            </ChartTag>
          </ChartMarker>
          <ChartBar $flex={flex3} $highlight />
          <ChartMarker $highlight>
            <ChartTag $highlight>
              <div>{year15}</div>
              <div>
                {fifteenYearGasPercentage}% {gasLabel}
              </div>
            </ChartTag>
          </ChartMarker>
          <ChartBar $flex={flex4} />
        </ChartTop>
        <ChartBottom />
      </ChartContainer>
    </Container>
  )
}
