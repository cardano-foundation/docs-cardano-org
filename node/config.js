const packageConfig = require('../package.json')

function mergeConfig (base, custom) {
  const config = {}
  Object.keys(base).forEach(key => {
    if (typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
      config[key] = mergeConfig(base[key], custom[key] || {})
    } else {
      if (typeof custom[key] === 'undefined') {
        config[key] = base[key]
      } else {
        config[key] = custom[key]
      }
    }
  })

  return config
}

function getConfig () {
  const defaultConfig = {
    availableLanguages: [
      {
        key: 'en',
        label: 'English',
        flag: '🇺🇸',
        locale: 'en_US'
      }
    ],
    alternativeLanguages: [],
    themes: [ 'cardano' ],
    ga: { trackingId: null },
    localization: {
      createLocalizedPages: true,
      ignore: [],
      createDefaultPages: true,
      useURL: true,
      useNavigator: true,
      persistLang: true
    },
    routes: []
  }

  const customConfig = packageConfig['gatsby-starter-iohk-default'] || {}

  return mergeConfig(defaultConfig, customConfig)
}

module.exports = getConfig()
