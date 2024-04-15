import { describe, it, expect } from 'vitest';
import { calculateInlineName } from './calculateInlineName';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const longLabel = 'areallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallylonglabel'
const longName = 'areallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallylongname.eth'
const longSubname = `${longLabel}.${longName}`

const createNode = (str: string) => {
  const chars = str.split('');
  const innerHtml = chars.map((char) => `<span>${char}</span>`).join('')
  const dom =  new JSDOM(`<div id="root">${innerHtml}</div>`)
  const root = dom.window.document.getElementById('root')

  Object.defineProperties(dom.window.HTMLDivElement.prototype, {
    offsetWidth: {
      get() {
        return chars.length * 5
      }
    },
    offsetLeft: {
      get() {
        return 10
      }
    }
  })

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

const removeNonNameSymbols = (str: string) => str.replace(/[\u2026\u200B\u200C]/g, '')

describe('calculateInlineName', () => {
  it('should return the correct result if the first label ends on the right side', () => {
    const result = calculateInlineName({
      name: longName,
      node: createNode(longName),
      ellipsisWidth: 5,
      maxWidth: 100,
    })
    expect(result).toBe('areallyre…​gname‌.eth')
    const ZWNJSplit = result.split('\u200C')
    expect(ZWNJSplit).toHaveLength(2)
    const ZWSSplit = result.split('\u200B')
    console.log(removeNonNameSymbols(ZWSSplit[0]), removeNonNameSymbols(ZWSSplit[1]))
    expect(removeNonNameSymbols(ZWSSplit[0]).length).toBe(removeNonNameSymbols(ZWSSplit[1]).length)
  })

  it('should return the correct result if the first label ends on the left side', () => {
    const shortSubname = `test.${longName}`
    const result = calculateInlineName({
      name: shortSubname,
      node: createNode(shortSubname),
      ellipsisWidth: 5,
      maxWidth: 100,
    })
    expect(result).toBe('test\u200C.area…​gname.eth')
    const ZWNJSplit = result.split('\u200C')
    expect(ZWNJSplit).toHaveLength(2)
    const ZWSSplit = result.split('\u200B')
    console.log(removeNonNameSymbols(ZWSSplit[0]), removeNonNameSymbols(ZWSSplit[1]))
    expect(removeNonNameSymbols(ZWSSplit[0]).length).toBe(removeNonNameSymbols(ZWSSplit[1]).length)
  })

  it('should return the correct result if the first label ends in the middle', () => {
    const result = calculateInlineName({
      name: longSubname,
      node: createNode(longSubname),
      ellipsisWidth: 5,
      maxWidth: 100,
    })
    expect(result).toBe('areallyre…\u200C\u200Bgname.eth')
    const ZWNJSplit = result.split('\u200C')
    expect(ZWNJSplit).toHaveLength(2)
    const ZWSSplit = result.split('\u200B')
    expect(removeNonNameSymbols(ZWSSplit[0]).length).toBe(removeNonNameSymbols(ZWSSplit[1]).length)
  })
})