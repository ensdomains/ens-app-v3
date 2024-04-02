export const calculateInlineName = ({
  name,
  node,
  ellipsisWidth,
  maxWidth,
}: {
  name: string
  node: HTMLSpanElement | null
  ellipsisWidth: number
  maxWidth: number
}) => {
  if (!node) return name

  const parentElementWidth = maxWidth || node.parentElement?.offsetWidth || Infinity
  const nodeWidth = node.offsetWidth || Infinity
  if (nodeWidth <= parentElementWidth) return name

  const children = node?.children || []
  let slice = 0
  let total = ellipsisWidth
  for (let index = 0; index < Math.floor((children.length - 1) / 2); index += 1) {
    const element = children[index] as HTMLSpanElement
    const matchElement = children[children.length - 1 - index] as HTMLSpanElement
    total += element.offsetWidth + matchElement.offsetWidth
    if (total > parentElementWidth)
      return `${name.slice(0, slice)}\u2026\u200B${name.slice(name.length - slice)}`
    slice += 1
  }

  return name
}
