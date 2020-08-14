import 'proxy-polyfill/src/index'
import './collections'
import './array'
import './proxy'

export { getLength } from './array'
export { set } from './set'
export { del } from './del'
export * from '@vue/reactivity'
