import { useRef, useSyncExternalStore } from 'react'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

import { calculateInlineName } from '../Name/utils/calculateInlineName'
import { calculateWrapName } from '../Name/utils/calculateWrapName'
import { StyledLink } from '../StyledLink'

const Container = styled.span(
  () => css`
    word-break: keep-all;
    overflow-wrap: normal;
    /* display: flex; */
    overflow: hidden;
    justify-content: left;
    position: relative;
  `,
)

const HiddenSpan = styled.span(
  () => css`
    position: absolute;
    pointer-events: none;
    visibility: hidden;
    white-space: nowrap;
    font-weight: bold;
  `,
)

const VisibleSpan = styled.span<{ type: 'wrap' | 'inline' }>(
  ({ type }) => css`
    ${type === 'inline' && 'white-space: nowrap;'}
  `,
)

const LeadSpan = styled.span(
  () => css`
    /* font-weight: bold; */
  `,
)

const TrailingSpan = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    /* font-weight: bold; */
  `,
)

type BaseProps = {
  children: string
  type: 'wrap' | 'inline'
  wrapLines?: number
  maxWidth?: number
  initialWidth?: number
  minInitialWidth?: number
  rootRef?: React.RefObject<HTMLDivElement>
  nextTick?: boolean
  debug?: boolean
  tolerance?: number
}

type InlineProps = {
  type: 'inline'
  maxWidth: number
  wrapLines?: never
  initialWidth?: never
}

type WrapProps = {
  type: 'wrap'
  wrapLines: number
  maxWidth: number
  initialWidth: number
  minInitialWidth?: number
}

type Props = BaseProps & (InlineProps | WrapProps)

export const Name = ({
  type = 'inline',
  wrapLines,
  children,
  maxWidth,
  initialWidth,
  minInitialWidth,
  rootRef,
  nextTick,
  tolerance,
  debug,
}: Props) => {
  if (debug)
    console.log(
      'Name',
      children,
      'type',
      type,
      'maxWidth',
      maxWidth,
      'initialWidth',
      initialWidth,
      'minInitialWidth',
      minInitialWidth,
      'wrapLines',
      wrapLines,
      'rootRef',
      rootRef,
      'debug',
      debug,
    )
  const name = children
  const charArray = name.split('')

  const ref = useRef<HTMLDivElement>(null)
  const hiddenRef = useRef<HTMLSpanElement>(null)
  const ellipsisRef = useRef<HTMLSpanElement>(null)

  const rootOrComponentRef = rootRef || ref

  const updateLayout = () => {
    return match(type)
      .with('wrap', () => {
        console.log(rootOrComponentRef)
        const ellipsisWidth = ellipsisRef.current?.offsetWidth || 0
        const maxWidth_ =
          maxWidth ?? rootOrComponentRef.current?.offsetParent?.offsetWidth ?? Infinity
        const hiddenLeft = hiddenRef.current?.getBoundingClientRect().left ?? 0
        const rootLeft = rootOrComponentRef.current?.offsetParent?.getBoundingClientRect().left ?? 0
        const initialWidth_ = initialWidth ?? maxWidth_ - hiddenLeft + rootLeft

        console.log('maxWidth_', maxWidth_, initialWidth_)
        return calculateWrapName({
          name: children,
          node: hiddenRef.current,
          ellipsisWidth,
          maxWidth: maxWidth_,
          initialWidth: initialWidth_,
          minInitialWidth,
          maxLines: wrapLines,
          tolerance,
          debug,
        })
      })
      .otherwise(() => {
        const ellipsisWidth = ellipsisRef.current?.offsetWidth || 0
        return calculateInlineName({
          name: children,
          node: hiddenRef.current,
          ellipsisWidth,
          maxWidth,
          tolerance,
          debug,
        })
      })
  }

  const name2 = useSyncExternalStore(
    (onStoreChange) => {
      console.log('SUBSCRIBE')
      window.addEventListener('resize', onStoreChange)
      if (nextTick)
        process.nextTick(() => {
          onStoreChange()
        })
      return () => {
        window.removeEventListener('resize', onStoreChange)
      }
    },
    () => updateLayout(),
    () => '',
  )

  const nameParts = name2?.split('\u200C')
  return (
    <Container ref={ref}>
      <HiddenSpan ref={ellipsisRef}>…</HiddenSpan>
      <HiddenSpan ref={hiddenRef}>
        {charArray.map((char, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={`${i}`}>{char}</span>
        ))}
      </HiddenSpan>
      <VisibleSpan type={type}>
        <LeadSpan>{nameParts?.[0]}</LeadSpan>
        <TrailingSpan>{nameParts?.[1]}</TrailingSpan>
      </VisibleSpan>
    </Container>
  )
}

export const TransComponentName = ({
  children,
  href,
  ...props
}: {
  href?: string
  children?: string[]
} & Omit<Props, 'children'>) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const name = Array.isArray(children) ? children[0] : children
  console.log('TRANS COMPONENT NAME', 'name', name, 'children', children)
  if (href) {
    return (
      <StyledLink href={href} ref={rootRef}>
        <Name {...props} rootRef={rootRef}>
          {name}
        </Name>
      </StyledLink>
    )
  }
  return <Name {...props}>{name}</Name>
}
