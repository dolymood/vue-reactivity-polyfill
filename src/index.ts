import 'proxy-polyfill/src/index'
import './patches'
import './proxy'

export { set } from './set'
export { get, getLength } from './get'
export { del } from './del'
export * from '@vue/reactivity'
