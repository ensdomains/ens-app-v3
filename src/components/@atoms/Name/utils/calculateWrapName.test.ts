import { describe, it, expect } from 'vitest'
import { calculateWrapName, findNumbersAddingUpToSum, sliceStringByNumbers } from './calculateWrapName'
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const createNode = (str: string) => {
  const innerHtml = str.split('').map((char) => `<span>${char}</span>`).join('')
  const dom =  new JSDOM(`<span id="root">${innerHtml}</span>`)

  Object.defineProperties(dom.window.HTMLSpanElement.prototype, {
    offsetWidth: {
      get() {
        return 5
      }
    },
    offsetLeft: {
      get() {
        return 10
      }
    }
  })

  return dom.window.document.getElementById('root')
}

describe('findNumbersAddingUpToSum', () => {
  it('should return numbers that add up just below the sum', () => {
    const result = findNumbersAddingUpToSum([1, 2, 3, 4, 5], 7)
    expect(result).toEqual([1, 2, 3])
  })

  it('should return numbers that add up exactly to the sum', () => {
    const result = findNumbersAddingUpToSum([1, 2, 3, 4, 5], 10)
    expect(result).toEqual([1, 2, 3, 4])
  })

  it('should return all the numbers if they do not add up to the sum', () => {
    const result = findNumbersAddingUpToSum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 700)
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('should return an empty array if the sum is 0', () => {
    const result = findNumbersAddingUpToSum([1, 2, 3, 4, 5], 0)
    expect(result).toEqual([])
  })
})

describe('sliceStringByNumbers', () => {
  it('should fill in the array with characters as long as there is a number available', () => {
    const result = sliceStringByNumbers([1, 2, 3, 4, 5], 'helloworld!')
    expect(result).toEqual(['h', 'el', 'low', 'orld', '!'])
  })

  it('should stop splitting the array once it has run out of characters', () => {
    const result = sliceStringByNumbers([1, 2, 3, 4, 5, 6, 7], 'helloworld!')
    expect(result).toEqual(['h', 'el', 'low', 'orld', '!'])
  })

  it('should stop splitting the array once it has run out of numbers', () => {
    const result = sliceStringByNumbers([1], 'helloworld!')
    expect(result).toEqual(['h'])
  })
})

describe('calculateWrapName', () => {
  it('should return the correct result', () => {
    const result = calculateWrapName({
      name: 'helloworld!',
      node: createNode('helloworld!'),
      ellipsisWidth: 5,
      initialWidth: 10,
      maxWidth: 20,
      lines: Infinity
    })
    expect(result).toEqual('h…​ell…​owo…​rld…​!')
  })

  it('should return the correct result', () => {
    const result = calculateWrapName({
      name: 'helloworld!',
      node: createNode('helloworld!'),
      ellipsisWidth: 5,
      initialWidth: 10,
      maxWidth: 20,
      lines: 2
    })
    expect(result).toEqual('h…​rld!')
  })
})
