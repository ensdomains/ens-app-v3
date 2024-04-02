import { describe, it, expect } from 'vitest';
import { calculateInlineName } from './calculateInlineName';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

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

describe('calculateInlineName', () => {
  it('should return null if the node is null', () => {
    const result = calculateInlineName({
      name: 'helloworld!',
      node: createNode('helloworld!'),
      ellipsisWidth: 5,
      maxWidth: 30,
    })
    expect(result).toBe('he…​d!')
  })
})