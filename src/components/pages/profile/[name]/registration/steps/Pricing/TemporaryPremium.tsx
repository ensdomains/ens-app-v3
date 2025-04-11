import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link'
import {
  ChangeEventHandler,
  MouseEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css, DefaultTheme } from 'styled-components'

import { Button, Dropdown, Helper, Input, Typography } from '@ensdomains/thorin'

import CalendarSVG from '@app/assets/Calendar.svg'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import useCurrentBlockTimestamp from '@app/hooks/chain/useCurrentBlockTimestamp'
import { makeDisplay } from '@app/utils/currency'

const VAR_PREFIX = '--premium-chart-'
const startPrice = 100000000.0
const offset = 47.6837158203125
const duration = 21 * 24 * 60 * 60 * 1000
const FACTOR = 0.5
const chartResolution = 65536
const resolutionPerDay = chartResolution / 21
const padding = 10
const calendarOptions = [
  {
    value: 'google',
    label: 'Google',
    function: google,
  },
  {
    value: 'outlook',
    label: 'Outlook',
    function: outlook,
  },
  {
    value: 'office365',
    label: 'Office 365',
    function: office365,
  },
  {
    value: 'yahoo',
    label: 'Yahoo',
    function: yahoo,
  },
  {
    value: 'ics',
    label: 'iCal',
    function: ics,
  },
]

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};
    width: 100%;
  `,
)

const dotStyle =
  ({ name, extraY = '0px', color }: { name: string; extraY?: string; color: string }) =>
  ({ theme }: { theme: DefaultTheme }) => css`
    content: '';
    width: ${theme.space['3']};
    height: ${theme.space['3']};
    background: ${color};
    border-radius: ${theme.radii.full};

    position: absolute;
    left: calc(var(--premium-chart-${name}-x) - ${theme.space['1.5']});
    top: calc(var(--premium-chart-${name}-y) - ${extraY} - ${theme.space['1.5']});
  `

const ChartContainer = styled.div(
  ({ theme }) => css`
    --space: ${theme.space['0.5']};
    --dist: calc(calc(100% - calc(var(--space) * 21)) / 21);
    --color: ${theme.colors.accent};

    position: relative;
    width: 100%;
    height: 200px;
    border-radius: ${theme.radii.large};
    background: repeating-linear-gradient(
      90deg,
      ${theme.colors.background} 0%,
      ${theme.colors.background} var(--dist),
      transparent var(--dist) calc(var(--dist) + var(--space))
    );
    background-size: calc(100% + var(--space)) 100%;

    & > svg:first-of-type {
      stroke: ${theme.colors.accent};
      stroke-width: ${theme.space['1']};
      stroke-linecap: round;
      fill: transparent;
      width: 100%;
    }

    &::before {
      ${dotStyle({ name: 'now', color: theme.colors.accent })};
      z-index: 1;
    }

    &::after {
      ${dotStyle({ name: 'selected', color: theme.colors.textPrimary })};
      z-index: 2;
      display: var(--premium-chart-selected-display);
    }
  `,
)

const InnerTooltip = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: ${theme.fontSizes.small};

    & > div:first-child::after {
      content: var(--premium-chart-hover-date);
    }

    & > div:last-child::after {
      content: var(--premium-chart-hover-price);
    }
  `,
)

const ArrowContainer = styled.svg(
  ({ theme }) => css`
    path {
      fill: ${theme.colors.background};
    }
  `,
)
const BoxContainer = styled.svg(
  ({ theme }) => css`
    g > rect {
      fill: ${theme.colors.background};
    }
  `,
)

const TooltipWrapper = styled.div(
  ({ theme }) => css`
    --x: var(--premium-chart-hover-x);
    --y: var(--premium-chart-hover-y);
    --d: var(--premium-chart-hover-display);
    position: relative;
    filter: drop-shadow(0 0 1px #e8e8e8) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    pointer-events: none;
    display: var(--d);
    z-index: 3;

    ${ArrowContainer}, ${BoxContainer} {
      height: 64px;
      position: absolute;
      top: calc(var(--y) - 200px - 68px);
    }

    ${ArrowContainer} {
      width: 14.22px;
      left: calc(var(--x) - 7.11px);
    }

    ${BoxContainer} {
      width: 170px;
      left: calc(clamp(60px, var(--x), calc(100% - 60px)) - 85px);
    }

    &::before {
      ${dotStyle({
        name: 'hover',
        color: `hsla(0, 0%, 15%, 0.5)`,
        extraY: `calc(200px + ${theme.space['1.25']})`,
      })}
    }
  `,
)

const Tooltip = () => {
  return (
    <>
      <TooltipWrapper>
        <ArrowContainer viewBox="81.89 0 14.22 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M92.2 64.4C90.6 66.5333 87.4 66.5333 85.8 64.4L81 58H97L92.2 64.4Z" />
        </ArrowContainer>
        <BoxContainer viewBox="0 0 178 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g>
            <rect x="4" y="2" width="170" height="56" rx="8" />
            <foreignObject x="4" y="2" width="170" height="56">
              <InnerTooltip>
                <Typography />
                <Typography />
              </InnerTooltip>
            </foreignObject>
          </g>
        </BoxContainer>
      </TooltipWrapper>
    </>
  )
}

const HeadingContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
)

const InputContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['2']};
    margin-bottom: -${theme.space['2']};
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
    }
  `,
)

// const inputStyle = ({ theme }: { theme: DefaultTheme }) => css`
//   background-color: ${theme.colors.background};
//   border-radius: ${theme.radii.large};
//   border-color: ${theme.colors.background};
//   height: ${theme.space['11']};
// `

const TimezoneText = styled(Typography)(
  ({ theme }) => css`
    margin-top: -${theme.space['2']};
    color: ${theme.colors.grey};
  `,
)

const CalendarIcon = styled.svg(
  ({ theme }) => css`
    color: ${theme.colors.background};
    width: ${theme.space['4']};
    height: ${theme.space['4']};
    display: block;
  `,
)

const dateToInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .replace(/:[0-9][0-9]\..*/g, '')

type PropertyFunc = (name: string) => (property: string, value: any, toString?: boolean) => void

const usePointVars = (
  chartPos: number | undefined,
  getPos: (i: number) => { x: number; y: number },
  name: string,
  setProperty: PropertyFunc,
  ref: RefObject<HTMLDivElement>,
) => {
  useEffect(() => {
    const set = setProperty(name)
    if (ref.current) {
      if (chartPos !== undefined && chartPos !== -1) {
        const { x, y } = getPos(chartPos)
        set('x', x)
        set('y', y)
        set('display', 'block')
      } else {
        set('x', undefined)
        set('y', undefined)
        set('display', 'none')
      }
      return () => {
        set('x', undefined)
        set('y', undefined)
        set('display', undefined)
      }
    }
  }, [chartPos, getPos, name, setProperty, ref])
}

type Props = {
  startDate: Date
  name: string
}

const TemporaryPremium = ({ startDate, name }: Props) => {
  const { t } = useTranslation('register')

  const bgRef = useRef<HTMLDivElement>(null)
  const priceInputRef = useRef<HTMLInputElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const setProperty: PropertyFunc = useCallback(
    (cname) => (property, value, toString) => {
      const bg = bgRef.current
      let str = value
      if (toString) {
        str = `"${str}"`
      } else if (typeof str === 'number') {
        str = `${str}px`
      }
      const propertyName = `${VAR_PREFIX}${cname}-${property}`
      if (bg) {
        if (value === undefined) {
          bg.style.removeProperty(propertyName)
        } else {
          bg.style.setProperty(propertyName, str)
        }
      }
    },
    [],
  )

  const currentBlockTimestamp = useCurrentBlockTimestamp()

  const { nowPoint, maxDate, nowDate } = useMemo(() => {
    const _nowDate = new Date(
      currentBlockTimestamp ? Number(currentBlockTimestamp) * 1000 : Date.now(),
    )
    const now = _nowDate.getTime()
    const relativeDate = now - startDate.getTime()
    const _nowPoint = (((relativeDate * 1e18) / duration) * chartResolution) / 1e18
    const _maxDate = new Date(startDate.getTime() + duration)
    return { nowPoint: _nowPoint, maxDate: _maxDate, nowDate: _nowDate }
  }, [currentBlockTimestamp, startDate])
  const [selectedPoint, setSelectedPoint] = useState(-1)
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 })

  const getPos = useCallback(
    (i: number) => {
      const yChunk = startPrice / (height - padding * 2)
      const resAsDay = i / resolutionPerDay
      const x = (i * (width - padding * 2)) / chartResolution + padding
      const price = Math.max(startPrice * FACTOR ** resAsDay - offset, 0)
      const y = (price / yChunk) * -1 + height - padding

      return { x, y, price }
    },
    [width, height],
  )

  const getPointFromPrice = useCallback((price: number) => {
    const realX = Math.log((price + offset) / startPrice) / Math.log(FACTOR)
    return Math.floor(realX * resolutionPerDay)
  }, [])
  const getPointFromDate = useCallback(
    (date: Date) => {
      const relativeDate = date.getTime() - startDate.getTime()
      return Math.round((relativeDate / duration) * chartResolution)
    },
    [startDate],
  )
  const getDateFromPoint = useCallback(
    (point: number) => {
      const relativeDate = (point / resolutionPerDay) * 24 * 60 * 60 * 1000
      return new Date(startDate.getTime() + relativeDate)
    },
    [startDate],
  )

  const makeEvent: () => CalendarEvent = useCallback(
    () => ({
      title: `Register ${name}`,
      start: getDateFromPoint(selectedPoint),
      duration: [10, 'minute'],
      url: window.location.href,
    }),
    [getDateFromPoint, name, selectedPoint],
  )

  const nowPosition = useMemo(() => getPos(nowPoint), [getPos, nowPoint])

  const path = useMemo(() => {
    let _path = `M ${padding} ${padding}`

    for (let i = 0; i < chartResolution; i += 500) {
      const { x, y } = getPos(i)
      _path += `L ${x} ${y} `
    }

    return _path
  }, [getPos])

  const handleResize = useCallback(() => {
    const bg = bgRef.current
    if (bg) {
      const _width = bg.clientWidth
      const _height = bg.clientHeight
      setDimensions({ width: _width, height: _height })
    }
  }, [])

  const { selectedDate, selectedPrice } = useMemo(() => {
    const { price } = getPos(selectedPoint)
    return {
      selectedPrice: price,
      selectedDate: getDateFromPoint(selectedPoint),
    }
  }, [getDateFromPoint, getPos, selectedPoint])

  const setSelectedPrice = useCallback(
    (price: number) => setSelectedPoint(getPointFromPrice(price)),
    [setSelectedPoint, getPointFromPrice],
  )
  const setSelectedDate = useCallback(
    (date: Date) => setSelectedPoint(getPointFromDate(date)),
    [setSelectedPoint, getPointFromDate],
  )

  const getPointFromX = useCallback(
    (x: number) => {
      let point = Math.round((x / (width - padding * 2)) * chartResolution)
      if (x < 0 || x > width - padding * 2) {
        if (x < 0) point = 0
        else point = chartResolution
      }
      return point
    },
    [width],
  )

  const handleMouseMove: React.MouseEventHandler = useCallback(
    (e) => {
      const x = e.nativeEvent.offsetX
      const point = getPointFromX(x)
      const { x: newX, y: newY, price } = getPos(point)
      const setHoverProperty = setProperty('hover')
      setHoverProperty('x', newX)
      setHoverProperty('y', newY)
      setHoverProperty(
        'date',
        getDateFromPoint(point).toLocaleString(undefined, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          hourCycle: 'h12',
          minute: '2-digit',
        }),
        true,
      )
      setHoverProperty('price', makeDisplay({ value: price, symbol: 'usd' }), true)
    },
    [getPointFromX, getPos, setProperty, getDateFromPoint],
  )

  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const x = e.nativeEvent.offsetX
      const point = getPointFromX(x)
      const toSelect = nowPoint > point ? nowPoint : point
      setSelectedPoint(toSelect)
    },
    [getPointFromX, nowPoint],
  )

  const handleMouseEnter = useCallback(() => {
    setProperty('hover')('display', 'block')
  }, [setProperty])

  const handleMouseLeave = useCallback(() => {
    setProperty('hover')('display', 'none')
  }, [setProperty])

  const [priceInput, setPriceInput] = useState(() => '0.00')

  const handleCurrencyInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setPriceInput(e.target.value.replace(/[^0-9.]/g, ''))
      let parsed = parseFloat(e.target.value)
      if (parsed > nowPosition.price) parsed = nowPosition.price
      if (parsed < 0 || Number.isNaN(parsed)) parsed = 0
      setSelectedPrice(parsed)
    },
    [nowPosition.price, setSelectedPrice],
  )

  const handleDateInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      let date = new Date(e.target.value.replace(/T/g, ' ').replace(/-/g, '/'))
      if (date.getTime() < nowDate.getTime()) date = nowDate
      else if (date.getTime() > maxDate.getTime()) date = maxDate
      setSelectedDate(date)
    },
    [setSelectedDate, nowDate, maxDate],
  )

  usePointVars(nowPoint, getPos, 'now', setProperty, bgRef)
  usePointVars(selectedPoint, getPos, 'selected', setProperty, bgRef)

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  useEffect(() => {
    if (bgRef.current) {
      setProperty('hover')('display', 'none')
    }
  }, [bgRef, setProperty])

  useEffect(() => {
    setPriceInput(makeDisplay({ value: getPos(nowPoint).price, symbol: 'usd' }).split('$')[1])
  }, [getPos, nowPoint])

  useEffect(() => {
    const priceInputEl = priceInputRef.current
    if (priceInputEl && document.activeElement !== priceInputEl && selectedPoint !== -1) {
      setPriceInput(makeDisplay({ value: selectedPrice, symbol: 'usd' }).split('$')[1])
    }
  }, [selectedPoint, selectedPrice])

  return (
    <Helper style={{ overflow: 'hidden' }} alert="info">
      <Container>
        <HeadingContainer>
          <Typography weight="bold">{t('steps.pricing.premium.heading')}</Typography>
          <Typography>{t('steps.pricing.premium.subheading')}</Typography>
        </HeadingContainer>
        <InputContainer>
          <Input
            label={t('steps.pricing.premium.targetPrice')}
            value={priceInput}
            onFocus={(e) => {
              e.target.placeholder = selectedPrice.toFixed(2)
              setPriceInput('')
            }}
            onChange={handleCurrencyInput}
            onBlur={() => {
              setPriceInput(makeDisplay({ value: selectedPrice, symbol: 'usd' }).split('$')[1])
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur()
              }
            }}
            ref={priceInputRef}
            type="text"
            prefix="$"
            size="medium"
            clearable={false}
          />
          <Input
            size="medium"
            label={t('steps.pricing.premium.targetDate')}
            value={dateToInput(selectedDate)}
            min={dateToInput(nowDate)}
            step={60}
            max={dateToInput(maxDate)}
            onChange={handleDateInput}
            clearable={false}
            type="datetime-local"
          />
          <input ref={dateInputRef} style={{ display: 'none' }} type="date" />
        </InputContainer>
        <ChartContainer
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          ref={bgRef}
        >
          <svg width="100%" height="200px">
            <path d={path} />
          </svg>
          <Tooltip />
        </ChartContainer>
        <TimezoneText>
          {t('steps.pricing.premium.timezone', {
            timezone: nowDate
              .toLocaleString(undefined, { timeZoneName: 'longOffset' })
              .replace(/.* /g, ''),
          })}
        </TimezoneText>
        <MobileFullWidth>
          <Dropdown
            shortThrow
            keepMenuOnTop
            items={calendarOptions.map((opt) => ({
              label: opt.label,
              onClick: () => window.open(opt.function(makeEvent()), '_blank'),
              color: 'text',
            }))}
          >
            <Button prefix={() => <CalendarIcon as={CalendarSVG} />}>
              {t('action.remindMe', { ns: 'common' })}
            </Button>
          </Dropdown>
        </MobileFullWidth>
      </Container>
    </Helper>
  )
}

export default TemporaryPremium
