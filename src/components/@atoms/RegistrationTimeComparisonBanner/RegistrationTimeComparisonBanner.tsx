import styled, { css } from 'styled-components'
import { InfoSVG } from '@ensdomains/thorin'
import mq from '@app/mediaQuery'
import { BigNumber } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useRef, useEffect, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'

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
    position: relative;
    height: ${theme.space['6']};
  `,
)

const BarChart = styled.div<{
  $flex: number
  $highlight?: boolean
}>(
  ({ theme, $flex, $highlight }) => css`
    flex: ${$flex};
    background: ${$highlight ? theme.colors.accent : theme.colors.red};
    height: ${theme.space['4']};
    border-radius: ${theme.space['0.5']};
    margin-top: ${theme.space['1']};
  `,
)

const MarkerOverlay = styled.div(
  () => css`
    position: relative;
    width: 100%;
    display: flex;
  `,
)

const ChartMarkerContainer = styled.div(
  () => css`
    position: relative;
    width: 0;
  `,
)

const ChartTickBackground = styled.div(
  ({ theme }) => css`
    position: relative;
    background: rgb(229, 240, 255);
    width: ${theme.space['2']};
    height: ${theme.space['6']};
    border-top-left-radius: ${theme.space['0.5']};
    border-top-right-radius: ${theme.space['0.5']};
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
  `,
)

const ChartTick = styled.div<{ $highlight?: boolean }>(
  ({ theme, $highlight }) => css`
    position: relative;
    background: ${$highlight ? theme.colors.accent : theme.colors.white};
    width: ${theme.space['1']};
    height: ${theme.space['6']};
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
    padding: ${theme.space['1']} ${theme.space['2']};
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

type ChartMarkerProps = {
  highlight: boolean
  duration: number
  gasPercentage: number
  shorten: boolean
}

const ChartMarker = ({ highlight, duration, gasPercentage, shorten }: ChartMarkerProps) => {
  const { t } = useTranslation('common')

  return (
    <ChartMarkerContainer>
      <ChartTickBackground>
        <ChartTick $highlight={highlight}>
          <ChartTag $highlight={highlight}>
            <div>
              {shorten ? t('unit.yrs', { count: duration }) : t('unit.years', { count: duration })}
            </div>
            <div>
              {shorten ? `${gasPercentage}%` : t('unit.gas', { value: `${gasPercentage}%` })}
            </div>
          </ChartTag>
        </ChartTick>
      </ChartTickBackground>
    </ChartMarkerContainer>
  )
}

const ChartBottom = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: flex-end;
    gap: ${theme.space['1']};
    height: ${theme.space['10']};
  `,
)

const getYearForGasPercentage = (
  transactionFee: BigNumber,
  rentFee: BigNumber,
  gasPercentage: number,
): number => {
  // years = (1 - gas%) * transactionFee / (rentFee * gas%)
  return transactionFee
    .mul(100 - gasPercentage)
    .div(rentFee)
    .div(gasPercentage)
    .toNumber()
}

const getGasPercentage = (transactionFee: BigNumber, rentFee: BigNumber, years: number): number => {
  // gas% = transactionFee / (transactionFee + rentFee * years)
  const denominator = rentFee.mul(years).add(transactionFee)
  return transactionFee.mul(100).div(denominator).toNumber()
}

type Marker = {
  type: 'marker'
  key: string
  highlight: boolean
  shorten: boolean
  duration: number
  gasPercentage: number
}

type Flex = {
  type: 'flex'
  key: string
  value: number
  highlight: boolean
}

type Props = {
  rentFee: BigNumber
  transactionFee: BigNumber
  gasPrice: BigNumber
  message?: string
}

export const RegistrationTimeComparisonBanner = ({
  message,
  gasPrice,
  rentFee,
  transactionFee,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [shortenMarkers, setShortenMarkers] = useState(false)
  const [shortenTags, setShortenTags] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      const gp = parseInt(formatUnits(gasPrice, 'gwei'))

      console.log('resize', containerRef.current?.clientWidth)
      console.log('gp', gp)

      if (containerRef.current?.clientWidth && !Number.isNaN(gp)) {
        const width = containerRef.current.clientWidth
        if (gp >= 25) {
          setShortenMarkers(false)
          setShortenTags(width < 440)
        } else if (gp >= 20) {
          setShortenMarkers(width < 376)
          setShortenTags(width < 480)
        } else if (gp >= 15) {
          setShortenMarkers(width < 410)
          setShortenTags(width < 520)
        } else {
          setShortenMarkers(true)
          setShortenTags(width < 400)
        }
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const markersAndFlex = (
    shortenMarkers ? [1, getYearForGasPercentage(transactionFee, rentFee, 10)] : [1, 5, 15]
  )
    .map(
      (duration, index) =>
        ({
          type: 'marker',
          key: `marker-${index}`,
          duration,
          gasPercentage: getGasPercentage(transactionFee, rentFee, duration),
          highlight: false,
          shorten: shortenTags,
        } as Marker),
    )
    .map((marker, index, markers) => {
      const set = []
      const gasPct = marker.gasPercentage
      if (index === 0)
        set.push({
          type: 'flex',
          key: `flex-start`,
          value: 100 - gasPct,
          highlight: true,
        } as Flex)
      else
        set.push({
          type: 'flex',
          key: `flex-${index}`,
          position: 'middle',
          value: markers[index - 1].gasPercentage - gasPct,
          highlight: true,
        } as Flex)
      if (index === markers.length - 1) {
        set.push({
          ...marker,
          highlight: true,
        })
        set.push({
          type: 'flex',
          key: 'flex-end',
          position: 'end',
          value: gasPct,
          highlight: false,
        } as Flex)
      } else {
        set.push(marker)
      }
      return set
    })
    .flat()

  return (
    <Container ref={containerRef}>
      <IconWrapper>
        <InfoSVG />
      </IconWrapper>
      {message && <Message>{message}</Message>}
      <ChartContainer>
        <ChartTop>
          <MarkerOverlay>
            {markersAndFlex.map((item) => {
              if (item.type === 'flex')
                return <BarChart key={item.key} $flex={item.value} $highlight={item.highlight} />
              if (item.type === 'marker')
                return (
                  <ChartMarker
                    key={item.key}
                    duration={item.duration}
                    gasPercentage={item.gasPercentage}
                    highlight={item.highlight}
                    shorten={item.shorten}
                  />
                )
              return null
            })}
          </MarkerOverlay>
        </ChartTop>
        <ChartBottom />
      </ChartContainer>
    </Container>
  )
}
