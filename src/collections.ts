// @ts-ignore
import _Symbol from 'core-js/es/symbol'
// @ts-ignore
import _Reflect from 'core-js/es/reflect'
// @ts-ignore
import _Set from 'core-js/es/set'
// @ts-ignore
import _Map from 'core-js/es/map'
// @ts-ignore
import _WeakSet from 'core-js/es/weak-set'
// @ts-ignore
import _WeakMap from 'core-js/es/weak-map'

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
