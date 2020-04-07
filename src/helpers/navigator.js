const window = global.window || { navigator: {} }

export const getNavigatorLanguage = () => window.navigator.language || ''
