export function def(obj: any, key: string, attrs: object) {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    ...attrs
  })
}

export function isPolyfillProxy (proxy: any) {
  const getter = proxy['___@getter___']
  return !!getter
}
