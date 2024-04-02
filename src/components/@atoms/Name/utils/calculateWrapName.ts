export const findNumbersAddingUpToSum = (numbers: number[], sum: number) => {
  let index = 0
  let total = 0
  while (index < numbers.length) {
    const num = numbers[index]
    if (total + num > sum) break
    total += num
    index += 1
  }
  return numbers.slice(0, index)
}

export const sliceStringByNumbers = (numbers: number[], str: string): string[] => {
  const result = []
  let startIdx = 0
  for (let i = 0; i < numbers.length; i += 1) {
    const sliceLength = numbers[i]
    const slice = str.slice(startIdx, startIdx + sliceLength)
    if (slice.length > 0) result.push(slice)
    startIdx += sliceLength
  }

  return result
}

export const calculateWrapName = ({
  name,
  node,
  ellipsisWidth,
  maxWidth,
  initialWidth: minWidth,
  lines = Infinity,
}: {
  name: string
  node: HTMLSpanElement | null
  ellipsisWidth: number
  maxWidth?: number
  initialWidth?: number
  lines?: number
}): string => {
  if (!node) return name

  const _maxWidth = maxWidth || node.parentElement?.offsetWidth || Infinity
  const initialWidth =
    minWidth || _maxWidth - (node.parentElement?.offsetLeft || 0) - node.offsetLeft

  let currentGroup: number[] = []
  let currentGroupTotal = 0
  let result: number[][] = []

  const children = node?.children || []
  for (let index = 0; index < children.length; index += 1) {
    const element = children[index] as HTMLSpanElement
    const charWidth = element.offsetWidth
    currentGroupTotal += charWidth
    const breakpoint = result.length === 0 ? initialWidth : _maxWidth
    if (currentGroupTotal + ellipsisWidth > breakpoint) {
      result.push(currentGroup)
      currentGroup = [charWidth]
      currentGroupTotal = charWidth
    } else {
      currentGroup.push(charWidth)
    }
  }
  if (currentGroup.length) result.push(currentGroup)

  console.log(result.length, lines)
  if (result.length > lines) {
    const left = result.slice(0, lines - 1)
    const right = result
      .slice(lines - 1)
      .reverse()
      .flat()
    console.log('left', left, right)
    const filteredRight = findNumbersAddingUpToSum(right, _maxWidth)
    result = [...left, filteredRight]
  }

  const slices = result.map((group) => group.length)
  const [last, ...reversedFirstSegments] = slices.reverse()
  const firstSegments = reversedFirstSegments.reverse()
  const firstNames = sliceStringByNumbers(firstSegments, name)
  const lastSegment = name.slice(-last)
  return [...firstNames, lastSegment].join('\u2026\u200B')
}
