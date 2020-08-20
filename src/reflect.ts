import { isNativeProxy } from './proxy'
// @ts-ignore
import anObject from 'core-js/internals/an-object'
// @ts-ignore
import isObject from 'core-js/internals/is-object'
// @ts-ignore
import has from 'core-js/internals/has'
// @ts-ignore
// import definePropertyModule from 'core-js/internals/object-define-property'
// @ts-ignore
import getOwnPropertyDescriptorModule from 'core-js/internals/object-get-own-property-descriptor'
// @ts-ignore
import getPrototypeOf from 'core-js/internals/object-get-prototype-of'
// @ts-ignore
import createPropertyDescriptor from 'core-js/internals/create-property-descriptor'

if (!isNativeProxy) {
  // hack reflect
  // because patch-pkg cannot patch peer deps core-js
  const _Reflect = self.Reflect
  _Reflect.set = function (target: any, propertyKey: string | number | symbol, V: any /* , receiver */) {
    const receiver: any = arguments.length < 4 ? target : arguments[3]
    let ownDescriptor = getOwnPropertyDescriptorModule.f(anObject(target), propertyKey)
    // let existingDescriptor
    let prototype
    if (!ownDescriptor) {
      if (isObject(prototype = getPrototypeOf(target))) {
        return _Reflect.set(prototype, propertyKey, V, receiver);
      }
      ownDescriptor = createPropertyDescriptor(0)
    }
    if (has(ownDescriptor, 'value')) {
      if (ownDescriptor.writable === false || !isObject(receiver)) return false
      // just set value
      target[propertyKey] = V;
      // if (existingDescriptor = getOwnPropertyDescriptorModule.f(receiver, propertyKey)) {
      //   if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      //   existingDescriptor.value = V;
      //   definePropertyModule.f(receiver, propertyKey, existingDescriptor);
      // } else definePropertyModule.f(receiver, propertyKey, createPropertyDescriptor(0, V));
      return true
    }
    return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true)
  }
}
