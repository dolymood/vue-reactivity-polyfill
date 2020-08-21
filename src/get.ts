// clone & update from:
// https://github.com/lodash/lodash
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/lodash
import { toRaw, track, TrackOpTypes } from '@vue/reactivity'
import { isArray, isString } from '@vue/shared'
import { memoize } from './util'

type Many<T> = T | ReadonlyArray<T>
type PropertyName = string | number
type PropertyPath = Many<PropertyName>

export function get<TObject extends object, TKey extends keyof TObject>(
  object: TObject,
  path: TKey | [TKey]
): TObject[TKey]

export function get<TObject extends object, TKey extends keyof TObject>(
  object: TObject | null | undefined,
  path: TKey | [TKey]
): TObject[TKey] | undefined

export function get<TObject extends object, TKey extends keyof TObject, TDefault>(
  object: TObject | null | undefined,
  path: TKey | [TKey],
  defaultValue: TDefault
): Exclude<TObject[TKey], undefined> | TDefault

export function get<TObject extends object, TKey1 extends keyof TObject, TKey2 extends keyof TObject[TKey1]>(
  object: TObject | null | undefined,
  path: [TKey1, TKey2]
): TObject[TKey1][TKey2] | undefined

export function get<TObject extends object, TKey1 extends keyof TObject, TKey2 extends keyof TObject[TKey1], TDefault>(
  object: TObject | null | undefined,
  path: [TKey1, TKey2],
  defaultValue: TDefault
): Exclude<TObject[TKey1][TKey2], undefined> | TDefault

export function get<TObject extends object, TKey1 extends keyof TObject, TKey2 extends keyof TObject[TKey1], TKey3 extends keyof TObject[TKey1][TKey2]>(
  object: TObject | null | undefined,
  path: [TKey1, TKey2, TKey3]
): TObject[TKey1][TKey2][TKey3] | undefined

export function get<TObject extends object, TKey1 extends keyof TObject, TKey2 extends keyof TObject[TKey1], TKey3 extends keyof TObject[TKey1][TKey2], TDefault>(
  object: TObject | null | undefined,
  path: [TKey1, TKey2, TKey3],
  defaultValue: TDefault
): Exclude<TObject[TKey1][TKey2][TKey3], undefined> | TDefault

export function get<TObject extends object, TKey1 extends keyof TObject, TKey2 extends keyof TObject[TKey1], TKey3 extends keyof TObject[TKey1][TKey2], TKey4 extends keyof TObject[TKey1][TKey2][TKey3]>(
  object: TObject | null | undefined,
  path: [TKey1, TKey2, TKey3, TKey4]
): TObject[TKey1][TKey2][TKey3][TKey4] | undefined

export function get<TObject extends object, TKey1 extends keyof TObject, TKey2 extends keyof TObject[TKey1], TKey3 extends keyof TObject[TKey1][TKey2], TKey4 extends keyof TObject[TKey1][TKey2][TKey3], TDefault>(
  object: TObject | null | undefined,
  path: [TKey1, TKey2, TKey3, TKey4],
  defaultValue: TDefault
): Exclude<TObject[TKey1][TKey2][TKey3][TKey4], undefined> | TDefault

export function get<T>(
  object: Array<T>,
  path: number
): T

export function get<T>(
  object: Array<T> | null | undefined,
  path: number
): T | undefined

export function get<T, TDefault>(
  object: Array<T> | null | undefined,
  path: number,
  defaultValue: TDefault
): T | TDefault

export function get<TDefault>(
  object: null | undefined,
  path: PropertyPath,
  defaultValue: TDefault
): TDefault

export function get(
  object: null | undefined,
  path: PropertyPath
): undefined

export function get(
  object: any,
  path: PropertyPath,
  defaultValue?: any
): any

/**
 * Get a property on an object.
 * Auto track deps.
 */
export function get (object: unknown, path: any, defaultVal?: unknown) {
  if (object === null || object === undefined) {
    return defaultVal
  }
  const proxy = object as any
  let target = toRaw(proxy)
  const paths = isKey(path, target) ? [path] : castPath(path)

  let index = 0
  const length = paths.length

  while (target && index < length) {
    const k = toKey(paths[index++])
    track(target, 'get' as TrackOpTypes, k)
    target = toRaw(target[k])
  }
  const result = (index && index === length) ? target : undefined
  return result === undefined ? defaultVal : result
}

export function getLength<T> (array: Array<T>) {
  const len = array.length
  track(toRaw(array), 'get' as TrackOpTypes, 'length')
  return len
}

const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
const reIsPlainProp = /^\w*$/
const reLeadingDot = /^\./
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g
const reEscapeChar = /\\(\\)?/g

function isKey(value: unknown, object: unknown): boolean {
  if (isArray(value)) {
    return false
  }
  var type = typeof value
  if (type == 'number' || type == 'boolean' || value === null || value === undefined) {
    return true
  }
  const strValue = String(value)
  return reIsPlainProp.test(strValue) || !reIsDeepProp.test(strValue) ||
    (object && strValue in Object(object))
}

const stringToPath = memoize(function (str: unknown) {
  const _str = String(str)

  const result = []
  if (reLeadingDot.test(_str)) {
    result.push('')
  }
  _str.replace(rePropName, (match, number, quote, str) => {
    result.push(quote ? str.replace(reEscapeChar, '$1') : (number || match))
    return str
  })
  return result
})

function castPath(value: [] | string): Array<string> {
  return isArray(value) ? value : stringToPath(value)
}

const INFINITY = 1 / 0
function toKey(value: string | number) {
  if (isString(value)) {
    return value
  }
  const result = String(value)
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}
