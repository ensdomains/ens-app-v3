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
  `,
)

const VisibleSpan = styled.span<{ type: 'wrap' | 'inline' }>(
  ({ type }) => css`
    ${type === 'inline' && 'white-space: nowrap;'}
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
  const charArray = children.split('')

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

        return calculateWrapName({
          name: children,
          node: hiddenRef.current,
          ellipsisWidth,
          maxWidth: Math.round(maxWidth_ * 0.95),
          initialWidth: Math.round(initialWidth_ * 0.95),
          minInitialWidth,
          lines: wrapLines,
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

  console.log('name2', name2)
  return (
    <Container ref={ref}>
      <HiddenSpan ref={ellipsisRef}>…</HiddenSpan>
      <HiddenSpan ref={hiddenRef}>
        {charArray.map((char, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={`${i}`}>{char}</span>
        ))}
      </HiddenSpan>
      <VisibleSpan type={type}>{name2}</VisibleSpan>
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
  const name = children?.[0] || ''
  console.log('TRANS COMPONENT NAME', name, children)
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
