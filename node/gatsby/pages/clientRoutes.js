const path = require('path')
const config = require('../../config')

module.exports = async ({ graphql, createPage }) => {
  const fallbackRoute = path.join(__dirname, '..', '..', '..', 'src', 'routes', 'Fallback.js')
  config.routes.forEach(({ path: routePath }) => {
    const staticPath = routePath.split(':').shift()

    config.availableLanguages.forEach(({ key: lang }, index) => {
      if (config.localization.createDefaultPages && index === 0) {
        createPage({
          path: staticPath,
          component: fallbackRoute,
          context: { routePath },
          matchPath: `${staticPath}*`
        })
      }

      if (config.localization.createLocalizedPages) {
        createPage({
          path: `/${lang}${staticPath}`,
          component: fallbackRoute,
          context: { routePath },
          matchPath: `/${lang}${staticPath}*`
        })
      }
    })
  })
}
