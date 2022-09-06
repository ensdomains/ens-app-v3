import CalendarSVG from '@app/assets/Calendar.svg'
import { makeDisplay } from '@app/utils/currency'
import { Button, Dropdown, Helper, Input, mq, Typography } from '@ensdomains/thorin'
import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link'
import {
  ChangeEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css, DefaultTheme } from 'styled-components'

const VAR_PREFIX = '--premium-chart-'
const startPrice = 100000050.0
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
  ({ theme }: { theme: DefaultTheme }) =>
    css`
      content: '';
      width: ${theme.space['3']};
      height: ${theme.space['3']};
      background-color: ${color};
      border-radius: ${theme.radii.full};

      position: absolute;
      left: calc(var(--premium-chart-${name}-x) - ${theme.space['1.5']});
      top: calc(var(--premium-chart-${name}-y) - ${extraY} - ${theme.space['1.5']});
    `

const ChartContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    --space: ${theme.space['0.5']};
    --dist: calc(calc(100% - calc(var(--space) * 21)) / 21);
    --color: ${theme.colors.accent};
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
      ${dotStyle({ name: 'selected', color: theme.colors.foreground })};
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

const ArrowContainer = styled.svg(() => css``)
const BoxContainer = styled.svg(() => css``)

const TooltipWrapper = styled.div(
  ({ theme }) => css`
    --x: var(--premium-chart-hover-x);
    --y: var(--premium-chart-hover-y);
    --d: var(--premium-chart-hover-display);
    position: relative;
    filter: drop-shadow(0px 0px 1px #e8e8e8) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));
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
        color: `rgba(${theme.shadesRaw.foreground}, 0.5)`,
        extraY: `calc(200px + ${theme.space['0.5']})`,
      })}
    }
  `,
)

const Tooltip = () => {
  return (
    <>
      <TooltipWrapper>
        <ArrowContainer viewBox="81.89 0 14.22 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M92.2 64.4C90.6 66.5333 87.4 66.5333 85.8 64.4L81 58H97L92.2 64.4Z"
            fill="white"
          />
        </ArrowContainer>
        <BoxContainer viewBox="0 0 178 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g>
            <rect x="4" y="2" width="170" height="56" rx="8" fill="white" />
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

    ${mq.md.min(css`
      flex-direction: row;
    `)}
  `,
)

const inputStyle = ({ theme }: { theme: DefaultTheme }) => css`
  background-color: ${theme.colors.background};
  border-radius: ${theme.radii.large};
  border-color: ${theme.colors.background};
  height: ${theme.space['11']};
`

const TimezoneText = styled(Typography)(
  ({ theme }) => css`
    margin-top: -${theme.space['2']};
    color: ${theme.colors.textTertiary};
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
  const bgRef = useRef<HTMLDivElement>(null)
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

  const { nowPoint, maxDate, nowDate } = useMemo(() => {
    const _nowDate = new Date()
    const now = _nowDate.getTime()
    const relativeDate = now - startDate.getTime()
    const _nowPoint = Math.floor((relativeDate / duration) * chartResolution)
    const _maxDate = new Date(startDate.getTime() + duration)
    return { nowPoint: _nowPoint, maxDate: _maxDate, nowDate: _nowDate }
  }, [startDate])
  const [selectedPoint, setSelectedPoint] = useState(-1)
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 })

  const getPos = useCallback(
    (i: number) => {
      const yChunk = startPrice / (height - padding * 2)
      const resAsDay = i / resolutionPerDay
      const x = (i * (width - padding * 2)) / chartResolution + padding
      const price = Math.max(startPrice * FACTOR ** resAsDay - 50, 0)
      const y = (price / yChunk) * -1 + height - padding

      return { x, y, price }
    },
    [width, height],
  )

  const getPointFromPrice = useCallback((price: number) => {
    const realX = Math.log((price + 50) / startPrice) / Math.log(FACTOR)
    return Math.floor(realX * resolutionPerDay)
  }, [])
  const getPointFromDate = useCallback(
    (date: Date) => {
      const relativeDate = date.getTime() - startDate.getTime()
      return Math.floor((relativeDate / duration) * chartResolution)
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
  const makePosition = useCallback(
    (point: number) => {
      if (point === -1) return undefined
      return { ...getPos(point), date: getDateFromPoint(point) }
    },
    [getPos, getDateFromPoint],
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

  const [selectedPrice, setSelectedPrice] = useState(nowPosition.price)
  const [selectedDate, setSelectedDate] = useState(nowDate)

  const getPointFromX = useCallback(
    (x: number) => {
      let point = Math.round((x / (width - padding * 2)) * chartResolution)
      if (x < padding || x > width - padding * 2) {
        if (x < padding) point = 0
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
      setHoverProperty('price', makeDisplay(price, 2, 'usd'), true)
    },
    [getPointFromX, getPos, setProperty, getDateFromPoint],
  )

  const handleClick = useCallback(
    (e) => {
      const x = e.nativeEvent.offsetX
      const point = getPointFromX(x)
      const toSelect = nowPoint > point ? nowPoint : point
      setSelectedPoint(toSelect)
      const { price, date } = makePosition(toSelect)!
      setSelectedPrice(price)
      setSelectedDate(date)
    },
    [getPointFromX, nowPoint, makePosition],
  )

  const handleMouseEnter = useCallback(() => {
    setProperty('hover')('display', 'block')
  }, [setProperty])

  const handleMouseLeave = useCallback(() => {
    setProperty('hover')('display', 'none')
  }, [setProperty])

  const handleCurrencyInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const position = e.target.selectionStart || 0
      let parsed = parseFloat(e.target.value.replace(/,/g, ''))
      if (parsed > nowPosition.price) parsed = nowPosition.price
      if (parsed < 0) parsed = 0
      const currValue = makeDisplay(selectedPrice, 2, 'usd').split('$')[1].replace(/[0-9]/g, '')
      const nextValue = makeDisplay(parsed, 2, 'usd').split('$')[1].replace(/[0-9]/g, '')
      const diff = nextValue.length - currValue.length
      setSelectedPrice(parsed)
      setSelectedPoint(getPointFromPrice(parsed))
      window.requestAnimationFrame(() => {
        e.target.setSelectionRange(position + diff, position + diff)
      })
    },
    [nowPosition.price, selectedPrice, getPointFromPrice],
  )

  const handleDateInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      let date = new Date(e.target.value.replace(/T/g, ' ').replace(/-/g, '/'))
      if (date.getTime() < nowDate.getTime()) date = nowDate
      else if (date.getTime() > maxDate.getTime()) date = maxDate
      setSelectedDate(date)
      setSelectedPoint(getPointFromDate(date))
    },
    [getPointFromDate, setSelectedDate, setSelectedPoint, nowDate, maxDate],
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

  return (
    <Helper type="info">
      <Container>
        <HeadingContainer>
          <Typography weight="bold">This name has a temporary premium</Typography>
          <Typography>
            To give fair opportunity to recently expired names, the premium starts at $100,000,000
            and reduces to $0 over 21 days. You can calculate the premium on a date below.
          </Typography>
        </HeadingContainer>
        <InputContainer>
          <Input
            label="Target price"
            value={makeDisplay(selectedPrice, 2, 'usd').split('$')[1]}
            onChange={handleCurrencyInput}
            type="text"
            prefix="$"
            size="medium"
            parentStyles={inputStyle as any}
          />
          <Input
            size="medium"
            label="Target date"
            value={dateToInput(selectedDate)}
            min={dateToInput(nowDate)}
            step={60}
            max={dateToInput(maxDate)}
            onChange={handleDateInput}
            type="datetime-local"
            parentStyles={inputStyle as any}
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
          Date and time shown in local time zone (
          {nowDate.toLocaleString(undefined, { timeZoneName: 'longOffset' }).replace(/.* /g, '')})
        </TimezoneText>
        <div>
          <Dropdown
            shortThrow
            keepMenuOnTop
            items={calendarOptions.map((opt) => ({
              label: opt.label,
              onClick: () => window.open(opt.function(makeEvent()), '_blank'),
              color: 'text',
            }))}
          >
            <Button prefix={<CalendarIcon as={CalendarSVG} />} shadowless>
              Remind Me
            </Button>
          </Dropdown>
        </div>
      </Container>
    </Helper>
  )
}

export default TemporaryPremium
