import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { Card, DownChevronSVG, Typography, mq } from '@ensdomains/thorin'

import { SectionItem } from './SectionItem'

const DISPLAY_INTERVAL = 2

type Color = 'blue' | 'green' | 'yellow'

const StyledCard = styled(Card)(
  () => css`
    width: 100%;
    display: block;
  `,
)

const ContentWrapper = styled.div(({ theme }) => [
  css`
    margin: -${theme.space['4']};
    display: flex;
    flex-direction: column;
  `,
  mq.sm.min(css`
    margin: -${theme.space['6']};
  `),
])

const Content = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    padding: ${theme.space['8']} ${theme.space['6']};
  `,
  mq.sm.min(css`
    gap: ${theme.space['8']};
    padding: ${theme.space['8']};
  `),
])

const RotatableIcon = styled(DownChevronSVG)<{ $direction: 'more' | 'less' }>(
  ({ $direction }) => css`
    transform: rotate(0deg);
    transition: transform 0.3s ease-in-out;
    ${$direction === 'less' && `transform: rotate(180deg);`}
  `,
)

const DisplayMore = styled.div<{ $color: Color }>(({ theme, $color = 'green' }) => [
  css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${theme.space['2']};
    border-top: 1px solid ${theme.colors.border};
    padding: ${theme.space['2']};
    color: ${theme.colors[`${$color}Primary`]};
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    svg {
      width: 12px;
      height: 12px;
    }

    :hover {
      background: ${theme.colors[`${$color}Surface`]};
      transform: translateY(-1px);
    }
  `,
  mq.sm.min(css``),
])

type Props = {
  title: string
  description: string
  color: Color
  items: {
    title: string
    description: string
    icon: string
    tag?: string
  }[]
}

export const SectionCard = ({ title, description, color = 'blue', items = [] }: Props) => {
  const [displayCount, setDisplayCount] = useState(DISPLAY_INTERVAL)
  const displayedItems = useMemo(() => {
    return items.slice(0, displayCount)
  }, [items, displayCount])
  const showShowMore = items.length > DISPLAY_INTERVAL
  const expandDirection = displayedItems.length < items.length ? 'more' : 'less'
  return (
    <StyledCard>
      <ContentWrapper>
        <Content>
          <div>
            <Typography fontVariant="headingTwo">{title}</Typography>
            <Typography fontVariant="small" color="grey">
              {description}
            </Typography>
          </div>
          {displayedItems.map((props) => (
            <SectionItem color={color} {...props} />
          ))}
        </Content>
        {showShowMore && (
          <DisplayMore
            $color={color}
            onClick={() => {
              if (expandDirection === 'more')
                return setDisplayCount((prev) => prev + DISPLAY_INTERVAL)
              setDisplayCount(DISPLAY_INTERVAL)
            }}
          >
            <span>See {expandDirection}</span>
            <RotatableIcon $direction={expandDirection} />
          </DisplayMore>
        )}
      </ContentWrapper>
    </StyledCard>
  )
}
