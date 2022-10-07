'use strict'

const assert = require('assert')
const fs = require('fs')
const uts46 = require('../uts46')

function matchInaneIDNARules (result, tooLong) {
  let labels = result.split('.')

  // Ignore empty leading tokens because... we have to do this to pass? But we
  // can't ignore stuff in the middle!
  while (labels[0].length === 0) { labels.shift() }

  // Match too short labels or too long labels (this is verify DNS length).
  // Except don't error out on an empty final label (this rule is actually in
  // the algorithm!).
  labels = labels.map(function (label, i) {
    if (label.length < 1 && i !== labels.length - 1) { throw new Error('Too short label: ' + label) } else if (tooLong && label.length > 63) { throw new Error('Too long label: ' + label) }
    return label
  })
  result = labels.join('.')

  // This validates for the DNS length. Note that while the prose says this only
  // needs to be done for ToASCII, ToUnicode checks the min (but not max!)
  // length.
  if (result.length < 1) { throw new Error('Too short DNS string: ' + result) } else if (tooLong && result.length > 253 &&
    !(result.length === 254 && result[253] === '.')) { throw new Error('Too long DNS string: ' + result) }
  return result
}

function toAscii (input, transitional) {
  let result = uts46.toAscii(input, {
    transitional: transitional,
    useStd3ASCII: true
  })
  result = matchInaneIDNARules(result, true)
  return result
}

function toUnicode (input) {
  let result = uts46.toUnicode(input, {
    useStd3ASCII: true
  })
  // ToUnicode isn't supposed to verify DNS length, but the test vectors seem to
  // think that means we aren't supposed to verify overlength.
  result = matchInaneIDNARules(result, false)
  return result
}

function handleEscapes (string) {
  return string.replace(/\\u([0-9a-fA-F]{4})/g, function (whole, num) {
    return String.fromCharCode(parseInt(num, 16))
  })
}

function handleIdnaTestLine (line) {
  // Ignore comments and empty lines.
  line = line.split('#')[0]
  if (line.length === 0 || line.trim() === '') { return }

  const fields = line.split(/;/g).map(function (s) {
    return s.trim()
  })

  const mode = fields[0]
  const testVector = handleEscapes(fields[1])
  const unicodeData = handleEscapes(fields[2]) || testVector
  const asciiData = handleEscapes(fields[3]) || unicodeData

  function handleMode (func, expected) {
    // If this is true, we are expecting an error. However, if the only errors
    // would be bidi or contextual errors, ignore it.
    const expectError = expected.startsWith('[')
    if (expectError && !(/[AVP]/.exec(expected))) { return }

    if (expectError) {
      test(func.name + ' ' + line, function () {
        if (mode === 'T' || mode === 'B') {
          assert.throws(function () {
            func(testVector, true)
          })
        }
        if (mode === 'N' || mode === 'B') {
          assert.throws(function () {
            func(testVector, false)
          })
        }
      })
    } else {
      test(func.name + ' ' + line, function () {
        if (expected.includes('[')) { console.log(expected) }

        if (mode === 'T' || mode === 'B') { assert.strict.equal(func(testVector, true), expected) } else if (mode === 'N' || mode === 'B') { assert.strict.equal(func(testVector, false), expected) }
      })
    }
  }

  handleMode(toAscii, asciiData)
  handleMode(toUnicode, unicodeData)
}

suite('IDNA test files', function () {
  const data = fs.readFileSync('test/IdnaTest.txt', {
    encoding: 'UTF-8'
  })
  data.split('\n').forEach(handleIdnaTestLine)
})
