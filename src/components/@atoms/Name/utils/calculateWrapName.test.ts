import { describe, it, expect } from 'vitest'
import { calculateWrapName, findNumbersAddingUpToSum, insertSpecialSymbols, sliceStringByNumbers } from './calculateWrapName'
import { insertZeroWidthNonJoinerAtLabel } from './sharedFunctions'
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const longName = 'areallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallylongname.eth'

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

const removeSpecialCharacters = (str: string) => str.replace(/[\u2026\u200B\u200C]/g, '')

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

describe('injectSpecialSymbols', () => {
  const label = 'onetwothreefourfivesixseveneightnine'
  const name = `${label}.eth`
  const subname = `${label}.${name}`

  it('should return name if array is slices is single value', () => {
    const nameWithZWNJ = insertZeroWidthNonJoinerAtLabel(name)
    const result = insertSpecialSymbols(nameWithZWNJ, [name.length])
    expect(result).toEqual(nameWithZWNJ)
  })

  it('should return correct an ellipsis string ', () => {
    const nameWithZWNJ = insertZeroWidthNonJoinerAtLabel(name)
    const result = insertSpecialSymbols(nameWithZWNJ, [5,5])
    expect(result).toEqual('onetw\u2026\u200Be\u200C.eth')
  })

  it('should return correct an ellipsis string ', () => {
    const nameWithZWNJ = insertZeroWidthNonJoinerAtLabel(name)
    const result = insertSpecialSymbols(nameWithZWNJ, [5,5,5])
    expect(result).toEqual('onetw\u2026\u200Bothre\u2026\u200Be\u200C.eth')
  })

  it('should return correct an ellipsis string ', () => {
    const nameWithZWNJ = insertZeroWidthNonJoinerAtLabel(name)
    const result = insertSpecialSymbols(nameWithZWNJ, [10,10,10,10])
    expect(result).toEqual('onetwothre\u2026\u200Befourfives\u2026\u200Bixseveneig\u2026\u200Bhtnine\u200C.eth')
  })

  it('should return correct result if ZWNJ is on left side', () => {
    const nameWithZWNJ = insertZeroWidthNonJoinerAtLabel(`123.${name}`)
    const result = insertSpecialSymbols(nameWithZWNJ, [5,5])
    expect(result).toEqual('123\u200C.o\u2026\u200Be.eth')
  })

  it('should return correct result if ZWNJ is in middle side', () => {
    const nameWithZWNJ = insertZeroWidthNonJoinerAtLabel(subname)
    const result = insertSpecialSymbols(nameWithZWNJ, [5,5])
    expect(result).toEqual('onetw\u2026\u200B\u200Ce.eth')
  })

})

describe('calculateWrapName', () => {
  it('should return the correct result', () => {
    const result = calculateWrapName({
      name: longName,
      node: createNode(longName),
      ellipsisWidth: 5,
      initialWidth: 100,
      maxWidth: 500,
      maxLines: Infinity
    })
    expect(result).toEqual('areallyreallyreally…​reallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyrea…​llyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreally…​reallylongname.eth')
    console.log('areallyreallyreally…​reallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyrea…​llyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreally…​eallylongname‌.eth')
    const resultParts = result.split('…​')
    expect(resultParts[0]).toHaveLength(19)
    expect(resultParts[1]).toHaveLength(99)
    expect(resultParts[2]).toHaveLength(99)
    expect(resultParts[3]).toHaveLength(longName.length - 19 - 99 - 99)
  })

  it.only('should return the correct result', () => {
    const result = calculateWrapName({
      name: longName,
      node: createNode(longName),
      ellipsisWidth: 5,
      initialWidth: 100,
      maxWidth: 500,
      maxLines: 2,
      debug: true
    })
    expect(result).toEqual('areallyreallyreall…​allyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallylongname\u200C.eth')
    const resultParts = result.split('…​')
    expect(resultParts[0]).toHaveLength(19)
    expect(resultParts[1]).toHaveLength(100)
  })
})
