import 'proxy-polyfill/src/index'
import './proxy'
import './collections'
import './array'

export { getLength } from './array'
export { set } from './set'
export { del } from './del'
export * from '@vue/reactivity'
