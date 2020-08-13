const __Set = self.Set
// @ts-ignore
global.Proxy = undefined
// @ts-ignore
self.Symbol = undefined
// @ts-ignore
self.Reflect = undefined
// @ts-ignore
self.Set = undefined
// @ts-ignore
self.Map = undefined
// @ts-ignore
self.WeakSet = undefined
// @ts-ignore
self.WeakMap = undefined

// @ts-ignore
const _Symbol = require('core-js/es/symbol')
// @ts-ignore
const _Reflect = require('core-js/es/reflect')
// @ts-ignore
const _Set = require('core-js/es/set')
// @ts-ignore
const _Map = require('core-js/es/map')
// @ts-ignore
const _WeakSet = require('core-js/es/weak-set')
// @ts-ignore
const _WeakMap = require('core-js/es/weak-map')

if (!self.Symbol) {
  self.Symbol = _Symbol
}
if (!self.Reflect) {
  self.Reflect = _Reflect
}
if (!self.Set) {
  self.Set = _Set
}
if (!self.Map) {
  self.Map = _Map
}
if (!self.WeakSet) {
  self.WeakSet = _WeakSet
}
if (!self.WeakMap) {
  self.WeakMap = _WeakMap
}

expect.extend({
  toHaveBeenWarned(received: string) {
    asserted.add(received)
    const passed = warn.mock.calls.some(args => args[0].indexOf(received) > -1)
    if (passed) {
      return {
        pass: true,
        message: () => `expected "${received}" not to have been warned.`
      }
    } else {
      const msgs = warn.mock.calls.map(args => args[0]).join('\n - ')
      return {
        pass: false,
        message: () =>
          `expected "${received}" to have been warned.\n\nActual messages:\n\n - ${msgs}`
      }
    }
  },

  toHaveBeenWarnedLast(received: string) {
    asserted.add(received)
    const passed =
      warn.mock.calls[warn.mock.calls.length - 1][0].indexOf(received) > -1
    if (passed) {
      return {
        pass: true,
        message: () => `expected "${received}" not to have been warned last.`
      }
    } else {
      const msgs = warn.mock.calls.map(args => args[0]).join('\n - ')
      return {
        pass: false,
        message: () =>
          `expected "${received}" to have been warned last.\n\nActual messages:\n\n - ${msgs}`
      }
    }
  },

  toHaveBeenWarnedTimes(received: string, n: number) {
    asserted.add(received)
    let found = 0
    warn.mock.calls.forEach(args => {
      if (args[0].indexOf(received) > -1) {
        found++
      }
    })

    if (found === n) {
      return {
        pass: true,
        message: () => `expected "${received}" to have been warned ${n} times.`
      }
    } else {
      return {
        pass: false,
        message: () =>
          `expected "${received}" to have been warned ${n} times but got ${found}.`
      }
    }
  }
})

let warn: jest.SpyInstance
const asserted = new __Set()

beforeEach(() => {
  asserted.clear()
  warn = jest.spyOn(console, 'warn')
  warn.mockImplementation(() => {})
})

afterEach(() => {
  const assertedArray = Array.from(asserted)
  const nonAssertedWarnings = warn.mock.calls
    .map(args => args[0])
    .filter(received => {
      return !assertedArray.some(assertedMsg => {
        return received.indexOf(assertedMsg) > -1
      })
    })
  warn.mockRestore()
  if (nonAssertedWarnings.length) {
    throw new Error(
      `test case threw unexpected warnings:\n - ${nonAssertedWarnings.join(
        '\n - '
      )}`
    )
  }
})
