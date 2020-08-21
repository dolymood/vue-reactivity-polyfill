export const NativeProxy = self.Proxy
export const isNativeProxy = NativeProxy && /native code/.test(NativeProxy.toString())
