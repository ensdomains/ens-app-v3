import { insertZeroWidthNonJoinerAtLabel } from './sharedFunctions'

export const calculateInlineName = ({
  name,
  node,
  ellipsisWidth,
  maxWidth,
  tolerance = 5,
  debug = false,
}: {
  name: string
  node: HTMLSpanElement | null
  ellipsisWidth: number
  maxWidth: number
  tolerance?: number
  debug?: boolean
}) => {
  const _name = insertZeroWidthNonJoinerAtLabel(name)
  if (debug) console.log('calculateInlineName', _name, node, ellipsisWidth, maxWidth)
  if (!node) return _name

  const _maxWidth = maxWidth ?? node.parentElement?.offsetWidth ?? Infinity
  const nodeWidth = node.offsetWidth || Infinity

  if (debug) console.log('nodeWidth', nodeWidth, 'parentElementWidth', _maxWidth)
  if (nodeWidth <= _maxWidth) return _name

  // We use a tolerance because the offsetWidth of the individual characters are rounded to the nearest integer, which creates a potential for inaccuracies.
  const _tolerance = 1 - Math.max(0, Math.min(100, tolerance)) / 100
  const maxWidthWithTolerance = _maxWidth * _tolerance

  const children = node?.children || []
  let slice = 0
  let total = ellipsisWidth
  for (let index = 0; index < Math.floor((children.length - 1) / 2); index += 1) {
    const element = children[index] as HTMLSpanElement
    const matchElement = children[children.length - 1 - index] as HTMLSpanElement
    total += element.offsetWidth + matchElement.offsetWidth
    if (total >= maxWidthWithTolerance) {
      const right = _name.slice(_name.length - slice)
      if (right.includes('\u200C'))
        return `${_name.slice(0, slice)}\u2026\u200B${_name.slice(_name.length - slice - 1)}`
      const left = _name.slice(0, slice)
      if (left.includes('\u200C'))
        return `${_name.slice(0, slice + 1)}\u2026\u200B${_name.slice(_name.length - slice)}`
      return `${left}\u2026\u200C\u200B${right}`
    }
    slice += 1
  }
  if (debug) console.log('name', _name)
  return _name
}
