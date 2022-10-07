'use strict'

const assert = require('assert')
const uts46 = require('../uts46')

suite('toASCII', function () {
  test('Convert method tests', function () {
    const d = String.fromCodePoint(0xd0000)
    assert.strict.deepEqual(uts46.convert(d), { IDN: d, PC: d })
    assert.strict.deepEqual(uts46.convert('öbb.at'), { IDN: 'öbb.at', PC: 'xn--bb-eka.at' })
    assert.strict.deepEqual(uts46.convert(['öbb.at', 'faß.de']), { IDN: ['öbb.at', 'faß.de'], PC: ['xn--bb-eka.at', 'xn--fa-hia.de'] })
  })
  test('Basic tests', function () {
    assert.strict.equal(uts46.toAscii('öbb.at'), 'xn--bb-eka.at')
    assert.strict.equal(uts46.toAscii('xn--bb-eka.at'), 'xn--bb-eka.at')
    assert.strict.equal(uts46.toAscii('XN--BB-EKA.AT'), 'xn--bb-eka.at')
    assert.strict.equal(uts46.toAscii('faß.de', {
      transitional: true
    }), 'fass.de')
    assert.strict.equal(uts46.toAscii('faß.de', {
      transitional: false
    }), 'xn--fa-hia.de')
    assert.strict.equal(uts46.toAscii('xn--fa-hia.de', {
      transitional: true
    }), 'xn--fa-hia.de')
    // Default to not processing STD3 rules (that's what URL.domainToASCII
    // is specifying).
    assert.strict.equal(uts46.toAscii('not=std3'), 'not=std3')
    assert.throws(function () {
      uts46.toAscii('not=std3', {
        useStd3ASCII: true
      })
    })
    assert.throws(function () {
      uts46.toAscii(String.fromCodePoint(0xd0000))
    })
    // Check verify DNS length
    assert.strict.equal(uts46.toAscii('', {
      verifyDnsLength: false
    }), '')
    assert.throws(function () {
      uts46.toAscii('', {
        verifyDnsLength: true
      })
    })
  })
  test('Verify DNS length parameter', function () {
    assert.throws(function () {
      uts46.toAscii('this..is.almost.right', {
        verifyDnsLength: true
      })
    })
    assert.throws(function () {
      uts46.toAscii('a.'.repeat(252 / 2) + 'aa', {
        verifyDnsLength: true
      })
    })
    assert.doesNotThrow(function () {
      // Exactly 253 characters.
      uts46.toAscii('a.'.repeat(252 / 2) + 'a', {
        verifyDnsLength: true
      })
    })
    assert.throws(function () {
      uts46.toAscii('a'.repeat(64), {
        verifyDnsLength: true
      })
    })
    assert.doesNotThrow(function () {
      uts46.toAscii('a'.repeat(63), {
        verifyDnsLength: true
      })
    })
    // Default is to not verify it.
    assert.strict.equal(uts46.toAscii(''), '')
  })
  test('Defaults to transitional', function () {
    assert.strict.equal('fass.de', uts46.toAscii('faß.de'))
  })
  test('Non-BMP characters', function () {
    assert.strict.equal(uts46.toAscii('\ud83d\udca9'), 'xn--ls8h')
    // This non-BMP character gets mapped to another non-BMP character.
    assert.strict.equal(uts46.toAscii('\ud87e\udcca'), 'xn--w60j')
    // ... and let's throw in a variant selector before it (which gets ignored)!
    assert.strict.equal(uts46.toAscii('\udb40\udd00\ud87e\udcca'), 'xn--w60j')
  })
})

suite('toUnicode', function () {
  test('Basic tests', function () {
    assert.strict.equal(uts46.toUnicode('öbb.at'), 'öbb.at')
    assert.strict.equal(uts46.toUnicode('Öbb.at'), 'öbb.at')
    assert.strict.equal(uts46.toUnicode('O\u0308bb.at'), 'öbb.at')
    assert.strict.equal(uts46.toUnicode('xn--bb-eka.at'), 'öbb.at')
    assert.strict.equal(uts46.toUnicode('faß.de'), 'faß.de')
    assert.strict.equal(uts46.toUnicode('fass.de'), 'fass.de')
    assert.strict.equal(uts46.toUnicode('xn--fa-hia.de'), 'faß.de')
    // Default to not processing STD3 rules (that's what URL.domainToASCII
    // is specifying).
    assert.strict.equal(uts46.toUnicode('not=std3'), 'not=std3')
    assert.throws(function () {
      uts46.toUnicode('not=std3', {
        useStd3ASCII: true
      })
    })
    assert.throws(function () {
      uts46.toUnicode(String.fromCodePoint(0xd0000))
    })
  })
  test('Non-BMP characters', function () {
    assert.strict.equal(uts46.toUnicode('\ud83d\udca9'), '\ud83d\udca9')
    // This non-BMP character gets mapped to another non-BMP character.
    assert.strict.equal(uts46.toUnicode('\ud87e\udcca'), '\ud84c\udc0a')
    // ... and let's throw in a variant selector before it (which gets ignored)!
    assert.strict.equal(uts46.toUnicode('\udb40\udd00\ud87e\udcca'), '\ud84c\udc0a')
  })
})

suite('unicode.org', function () {
  test('Unicode Utilities: Internationalized Domain Names (IDN)', function () { // http://unicode.org/cldr/utility/idna.jsp
    // NOTE: some of the results below need further research as they are marked
    // as error cases on the web page but working here (or otherwise)

    // fass.de
    assert.strict.equal(uts46.toUnicode('fass.de'), 'fass.de')
    assert.strict.equal(uts46.toAscii('fass.de', {
      transitional: true
    }), 'fass.de')
    assert.strict.equal(uts46.toAscii('fass.de', {
      transitional: false
    }), 'fass.de')

    // faß.de
    assert.strict.equal(uts46.toUnicode('faß.de'), 'faß.de')
    assert.strict.equal(uts46.toAscii('faß.de', {
      transitional: true
    }), 'fass.de')
    assert.strict.equal(uts46.toAscii('faß.de', {
      transitional: false
    }), 'xn--fa-hia.de')

    // fäß.de
    assert.strict.equal(uts46.toUnicode('fäß.de'), 'fäß.de')
    assert.strict.equal(uts46.toAscii('fäß.de', {
      transitional: true
    }), 'xn--fss-qla.de')
    assert.strict.equal(uts46.toAscii('fäß.de', {
      transitional: false
    }), 'xn--f-qfao.de')

    // xn--fa-hia.de
    assert.strict.equal(uts46.toUnicode('xn--fa-hia.de'), 'faß.de')
    assert.strict.equal(uts46.toAscii('xn--fa-hia.de', {
      transitional: true
    }), 'xn--fa-hia.de')
    assert.strict.equal(uts46.toAscii('xn--fa-hia.de', {
      transitional: false
    }), 'xn--fa-hia.de')

    // ₹.com
    assert.strict.equal(uts46.toUnicode('₹.com'), '₹.com') // no error thrown
    assert.strict.equal(uts46.toAscii('₹.com', {
      transitional: true
    }), 'xn--yzg.com')
    assert.strict.equal(uts46.toAscii('₹.com', {
      transitional: false
    }), 'xn--yzg.com') // no error thrown

    // 𑀓.com
    assert.strict.equal(uts46.toUnicode('𑀓.com'), '𑀓.com') // no error thrown
    assert.strict.equal(uts46.toAscii('𑀓.com', {
      transitional: true
    }), 'xn--n00d.com')
    assert.strict.equal(uts46.toAscii('𑀓.com', {
      transitional: false
    }), 'xn--n00d.com')

    // \u0080.com
    assert.throws(function () {
      uts46.toUnicode('\u0080.com')
    })
    assert.throws(function () {
      uts46.toAscii('\u0080.com', {
        transitional: true
      })
    })
    assert.throws(function () {
      uts46.toAscii('\u0080.com', {
        transitional: false
      })
    })

    // xn--a.com [might be wrong one compare results in web]
    assert.throws(function () {
      uts46.toUnicode('xn--a.com')
    })
    assert.throws(function () {
      uts46.toAscii('xn--a.com', {
        transitional: true
      })
    })
    assert.throws(function () {
      uts46.toAscii('xn--a.com', {
        transitional: false
      })
    })

    /* jshint -W100 */
    // a‌b
    assert.strict.equal(uts46.toUnicode('a‌b'), 'a\u200Cb') // no error thrown
    assert.strict.equal(uts46.toAscii('a‌b', {
      transitional: true
    }), 'ab')
    assert.strict.equal(uts46.toAscii('a‌b', {
      transitional: false
    }), 'xn--ab-j1t')
    /* jshint +W100 */

    // xn--ab-j1t
    assert.strict.equal(uts46.toUnicode('xn--ab-j1t'), 'a\u200Cb') // no error thrown
    assert.strict.equal(uts46.toAscii('xn--ab-j1t', { // no error thrown
      transitional: true
    }), 'xn--ab-j1t')
    assert.strict.equal(uts46.toAscii('xn--ab-j1t', {
      transitional: false
    }), 'xn--ab-j1t')

    // öbb.at
    assert.strict.equal(uts46.toUnicode('öbb.at'), 'öbb.at')
    assert.strict.equal(uts46.toAscii('öbb.at', {
      transitional: true
    }), 'xn--bb-eka.at')
    assert.strict.equal(uts46.toAscii('öbb.at', {
      transitional: false
    }), 'xn--bb-eka.at')

    // ÖBB.at
    assert.strict.equal(uts46.toUnicode('ÖBB.at'), 'öbb.at')
    assert.strict.equal(uts46.toAscii('ÖBB.at', {
      transitional: true
    }), 'xn--bb-eka.at')
    assert.strict.equal(uts46.toAscii('ÖBB.at', {
      transitional: false
    }), 'xn--bb-eka.at')

    // ȡog.de
    assert.strict.equal(uts46.toUnicode('ȡog.de'), 'ȡog.de')
    assert.strict.equal(uts46.toAscii('ȡog.de', {
      transitional: true
    }), 'xn--og-09a.de')
    assert.strict.equal(uts46.toAscii('ȡog.de', {
      transitional: false
    }), 'xn--og-09a.de')

    // ☕.de
    assert.strict.equal(uts46.toUnicode('☕.de'), '☕.de')
    assert.strict.equal(uts46.toAscii('☕.de', {
      transitional: true
    }), 'xn--53h.de')
    assert.strict.equal(uts46.toAscii('☕.de', {
      transitional: false
    }), 'xn--53h.de')

    // I♥NY.de
    assert.strict.equal(uts46.toUnicode('I♥NY.de'), 'i♥ny.de')
    assert.strict.equal(uts46.toAscii('I♥NY.de', {
      transitional: true
    }), 'xn--iny-zx5a.de')
    assert.strict.equal(uts46.toAscii('I♥NY.de', {
      transitional: false
    }), 'xn--iny-zx5a.de')

    // ＡＢＣ・日本.co.jp
    assert.strict.equal(uts46.toUnicode('ＡＢＣ・日本.co.jp'), 'abc・日本.co.jp')
    assert.strict.equal(uts46.toAscii('ＡＢＣ・日本.co.jp', {
      transitional: true
    }), 'xn--abc-rs4b422ycvb.co.jp')
    assert.strict.equal(uts46.toAscii('ＡＢＣ・日本.co.jp', {
      transitional: false
    }), 'xn--abc-rs4b422ycvb.co.jp')

    // 日本｡co｡jp
    assert.strict.equal(uts46.toUnicode('日本｡co｡jp'), '日本.co.jp')
    assert.strict.equal(uts46.toAscii('日本｡co｡jp', {
      transitional: true
    }), 'xn--wgv71a.co.jp')
    assert.strict.equal(uts46.toAscii('日本｡co｡jp', {
      transitional: false
    }), 'xn--wgv71a.co.jp')

    // 日本｡co．jp
    assert.strict.equal(uts46.toUnicode('日本｡co．jp'), '日本.co.jp')
    assert.strict.equal(uts46.toAscii('日本｡co．jp', {
      transitional: true
    }), 'xn--wgv71a.co.jp')
    assert.strict.equal(uts46.toAscii('日本｡co．jp', {
      transitional: false
    }), 'xn--wgv71a.co.jp')

    // 日本⒈co．jp
    assert.throws(function () {
      uts46.toUnicode('日本⒈co．jp')
    })
    assert.throws(function () {
      uts46.toAscii('日本⒈co．jp', {
        transitional: true
      })
    })
    assert.throws(function () {
      uts46.toAscii('日本⒈co．jp', {
        transitional: false
      })
    })

    // x\u0327\u0301.de
    assert.strict.equal(uts46.toUnicode('x\u0327\u0301.de'), 'x̧́.de')
    assert.strict.equal(uts46.toAscii('x\u0327\u0301.de', {
      transitional: true
    }), 'xn--x-xbb7i.de')
    assert.strict.equal(uts46.toAscii('x\u0327\u0301.de', {
      transitional: false
    }), 'xn--x-xbb7i.de')

    // x\u0301\u0327.de
    assert.strict.equal(uts46.toUnicode('x\u0301\u0327.de'), 'x̧́.de')
    assert.strict.equal(uts46.toAscii('x\u0301\u0327.de', {
      transitional: true
    }), 'xn--x-xbb7i.de')
    assert.strict.equal(uts46.toAscii('x\u0301\u0327.de', {
      transitional: false
    }), 'xn--x-xbb7i.de')

    // σόλος.gr
    assert.strict.equal(uts46.toUnicode('σόλος.gr'), 'σόλος.gr')
    assert.strict.equal(uts46.toAscii('σόλος.gr', {
      transitional: true
    }), 'xn--wxaikc6b.gr')
    assert.strict.equal(uts46.toAscii('σόλος.gr', {
      transitional: false
    }), 'xn--wxaijb9b.gr')

    // Σόλος.gr
    assert.strict.equal(uts46.toUnicode('Σόλος.gr'), 'σόλος.gr')
    assert.strict.equal(uts46.toAscii('Σόλος.gr', {
      transitional: true
    }), 'xn--wxaikc6b.gr')
    assert.strict.equal(uts46.toAscii('Σόλος.gr', {
      transitional: false
    }), 'xn--wxaijb9b.gr') // might be wrong

    // ΣΌΛΟΣ.grﻋﺮﺑﻲ.de
    assert.strict.equal(uts46.toUnicode('ΣΌΛΟΣ.grﻋﺮﺑﻲ.de'), 'σόλοσ.grعربي.de')
    assert.strict.equal(uts46.toAscii('ΣΌΛΟΣ.grﻋﺮﺑﻲ.de', {
      transitional: true
    }), 'xn--wxaikc6b.xn--gr-gtd9a1b0g.de')
    assert.strict.equal(uts46.toAscii('ΣΌΛΟΣ.grﻋﺮﺑﻲ.de', {
      transitional: false
    }), 'xn--wxaikc6b.xn--gr-gtd9a1b0g.de') // might be wrong

    // عربي.de
    assert.strict.equal(uts46.toUnicode('عربي.de'), 'عربي.de')
    assert.strict.equal(uts46.toAscii('عربي.de', {
      transitional: true
    }), 'xn--ngbrx4e.de')
    assert.strict.equal(uts46.toAscii('عربي.de', {
      transitional: false
    }), 'xn--ngbrx4e.de')

    // نامهای.de
    assert.strict.equal(uts46.toUnicode('نامهای.de'), 'نامهای.de')
    assert.strict.equal(uts46.toAscii('نامهای.de', {
      transitional: true
    }), 'xn--mgba3gch31f.de')
    assert.strict.equal(uts46.toAscii('نامهای.de', {
      transitional: false
    }), 'xn--mgba3gch31f.de')

    // نامه\u200Cای.de
    /* jshint -W100 */
    assert.strict.equal(uts46.toUnicode('نامه\u200Cای.de'), 'نامه‌ای.de')
    assert.strict.equal(uts46.toAscii('نامه\u200Cای.de', {
      transitional: true
    }), 'xn--mgba3gch31f.de')
    assert.strict.equal(uts46.toAscii('نامه\u200Cای.de', {
      transitional: false
    }), 'xn--mgba3gch31f060k.de')
    /* jshint +W100 */
  })
})
