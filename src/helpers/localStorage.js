const window = global.window || { localStorage: {} }

const isSupported = typeof global.Storage !== 'undefined'

export const getLocalStorageValue = (key) => isSupported ? window.localStorage[key] : undefined
export const setLocalStorageValue = (key, value) => isSupported && (window.localStorage[key] = value)
