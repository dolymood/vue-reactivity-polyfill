import 'proxy-polyfill/src/index'
import './proxy'
import './array'

export { getLength } from './array'
export { set } from './set'
export { get } from './get'
export { del } from './del'
export * from '@vue/reactivity'
