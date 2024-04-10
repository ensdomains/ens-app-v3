import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

import { StyledLink } from '../StyledLink'
import { calculateInlineName } from './utils/calculateInlineName'
import { calculateWrapName } from './utils/calculateWrapName'

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
  containerWidth?: number
  containerLeft?: number
}

type InlineProps = {
  type: 'inline'
  containerWidth: number
  wrapLines?: never
  containerLeft?: never
}

type WrapProps = {
  type: 'wrap'
  wrapLines: number
  containerWidth: number
  containerLeft: number
}

type Props = BaseProps & (InlineProps | WrapProps)

export const Name = ({
  type = 'inline',
  wrapLines,
  children,
  containerWidth,
  containerLeft,
}: Props) => {
  const charArray = children.split('')

  const [name, setName] = useState(children)

  const ref = useRef<HTMLDivElement>(null)
  const hiddenRef = useRef<HTMLSpanElement>(null)
  const ellipsisRef = useRef<HTMLSpanElement>(null)

  const updateLayout = (node: HTMLSpanElement | null) => {
    if (!node) return
    const _name = match(type)
      .with('wrap', () => {
        // console.log('wrapper offsets', ref.current?.offsetWidth, ref.current?.offsetLeft)
        const nodeRect = node.getBoundingClientRect()
        const initialWidth = containerWidth + containerLeft! - nodeRect.left
        const ellipsisWidth = ellipsisRef.current?.offsetWidth || 0
        return calculateWrapName({
          name: children,
          node,
          ellipsisWidth,
          maxWidth: containerWidth,
          initialWidth,
          lines: wrapLines,
        })
      })
      .otherwise(() => {
        console.log('containerWidth', containerWidth)
        const ellipsisWidth = ellipsisRef.current?.offsetWidth || 0
        return calculateInlineName({
          name: children,
          node,
          ellipsisWidth,
          maxWidth: containerWidth,
        })
      })
    // console.log('name', _name)
    setName(_name)
  }

  useEffect(() => {
    updateLayout(hiddenRef.current)
  }, [containerWidth, containerLeft])

  useEffect(() => {
    const updateLayoutCallback = () => updateLayout(hiddenRef?.current)
    window.addEventListener('resize', updateLayoutCallback)
    return () => {
      window.removeEventListener('resize', updateLayoutCallback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container ref={ref}>
      <HiddenSpan ref={ellipsisRef}>…</HiddenSpan>
      <HiddenSpan ref={hiddenRef}>
        {charArray.map((char, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={`${i}`}>{char}</span>
        ))}
      </HiddenSpan>
      <VisibleSpan type={type}>{name}</VisibleSpan>
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
  const name = children?.[0] || ''
  const baseComponent = <Name {...props}>{name}</Name>
  return href ? <StyledLink href={href}>{baseComponent}</StyledLink> : baseComponent
}
