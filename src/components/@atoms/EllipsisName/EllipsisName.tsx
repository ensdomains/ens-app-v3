import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { StyledLink } from '../StyledLink'

const Container = styled.span(
  () => css`
    word-break: keep-all;
    overflow-wrap: normal;
    /* display: flex; */
    overflow: hidden;
    justify-content: left;
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

const VisibleSpan = styled.span(
  () => css`
    white-space: nowrap;
  `,
)

type Props = {
  children: string
  padding?: number
  containerRef?: React.RefObject<HTMLElement>
}

const calculateSlice = ({
  node,
  ellipsisWidth,
  maxWidth,
}: {
  node: HTMLSpanElement | null
  ellipsisWidth: number
  maxWidth?: number
}): number | null => {
  if (!node) return null

  const parentElementWidth = maxWidth || node.parentElement?.offsetWidth || Infinity
  const nodeWidth = node.offsetWidth || Infinity
  if (nodeWidth <= parentElementWidth) return null

  const children = node?.children || []
  let slice = 0
  let total = ellipsisWidth
  for (let index = 0; index < Math.floor((children.length - 1) / 2); index += 1) {
    const element = children[index] as HTMLSpanElement
    const matchElement = children[children.length - 1 - index] as HTMLSpanElement
    total += element.offsetWidth + matchElement.offsetWidth
    if (total > parentElementWidth) return slice
    slice += 1
  }

  return null
}

export const EllipsisName = ({ children, padding = 0, containerRef }: Props) => {
  const charArray = children.split('')

  const [name, setName] = useState(children)

  const ref = useRef<HTMLSpanElement>(null)
  const ellipsisRef = useRef<HTMLSpanElement>(null)

  const guide = (node: HTMLSpanElement) => {
    const maxWidth = (containerRef?.current?.offsetWidth || Infinity) - padding
    const ellipsisWidth = ellipsisRef.current?.offsetWidth || 0
    const slice = calculateSlice({ node, ellipsisWidth, maxWidth })
    const _name =
      slice !== null
        ? `${children.slice(0, slice)}\u2026${children.slice(children.length - slice!)}`
        : name
    setName(_name)
  }

  useEffect(() => {
    const updateName = () => {
      if (ref.current) {
        guide(ref.current)
      }
    }
    updateName()
    window.addEventListener('resize', updateName)
    return () => {
      window.removeEventListener('resize', updateName)
    }
  }, [])

  const dots = '\u2026'

  return (
    <Container>
      <HiddenSpan ref={ellipsisRef}>{dots}</HiddenSpan>
      <HiddenSpan ref={ref}>
        {charArray.map((char, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={`${i}`}>{char}</span>
        ))}
      </HiddenSpan>
      <VisibleSpan>{name}</VisibleSpan>
    </Container>
  )
}

export const TransComponentEllipsisName = ({
  children,
  href,
  ...props
}: {
  href?: string
  containerRef?: React.RefObject<HTMLElement>
  padding?: number
  children?: string[]
}) => {
  const name = children?.[0] || ''
  const baseComponent = <EllipsisName {...props}>{name}</EllipsisName>
  return href ? <StyledLink href={href}>{baseComponent}</StyledLink> : baseComponent
}
