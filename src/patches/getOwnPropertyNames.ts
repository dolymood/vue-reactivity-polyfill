import { isFunction } from '@vue/shared'
import { def } from '../lang'

const nativeGetOwnPropertyNames = Object.getOwnPropertyNames
function getOwnPropertyNames (o: any): string[] {
  const _isFunction = isFunction(o)
  let result = nativeGetOwnPropertyNames(o)
  if (_isFunction) {
    const IEKeys = ['caller', 'arguments']
    // fix IE Object.getOwnPropertyNames returns caller and arguments in strict mode for function instance
    // https://github.com/zloirock/core-js/issues/825
    result = result.filter((k: string) => IEKeys.indexOf(k) === -1)
  }
  return result
}

getOwnPropertyNames.toString = function () {
  return 'function getOwnPropertyNames() { [native code] }'
}

def(Object, 'getOwnPropertyNames', {
  value: getOwnPropertyNames,
  writable: true
})
