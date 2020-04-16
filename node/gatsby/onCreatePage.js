const config = require('../config')
const { addToSitemap } = require('./sitemap')

const defaultPagesToIgnore = [
  '/dev-404-page/',
  '/404.html',
  '/offline-plugin-app-shell-fallback/'
]

const pagesToIgnore = [
  ...defaultPagesToIgnore,
  ...((config.build && config.localization && config.localization.ignore) || [])
]

function createLocalized404Pages ({ createPage, page }) {
  return new Promise(resolve => {
    config.availableLanguages.forEach(({ key }) => {
      let createLocalizedPages = true
      if (config.localization && typeof config.localization.createLocalizedPages === 'boolean') {
        createLocalizedPages = config.localization.createLocalizedPages
      }

      if (createLocalizedPages) {
        const localizedPath = `/${key}${page.path}`
        createPage({
          ...page,
          path: localizedPath,
          matchPath: `/${key}/*`
        })
      }
    })

    resolve()
  })
}

module.exports = ({ page, actions }) => {
  const { createPage } = actions
  if (page.path === '/404/') return createLocalized404Pages({ createPage, page })
  if (pagesToIgnore.includes(page.path)) {
    if (!defaultPagesToIgnore.includes(page.path)) addToSitemap(page.path)
    return Promise.resolve()
  }

  return new Promise(resolve => {
    config.availableLanguages.forEach(({ key }, index) => {
      let createLocalizedPages = true
      if (config.localization && typeof config.localization.createLocalizedPages === 'boolean') {
        createLocalizedPages = config.localization.createLocalizedPages
      }

      if (createLocalizedPages) {
        const localizedPath = `/${key}${page.path}`
        createPage({
          ...page,
          context: {
            ...(page.context || {}),
            lang: key
          },
          path: localizedPath
        })

        addToSitemap(localizedPath)
      }

      let createDefaultPages = true
      if (config.localization && typeof config.localization.createDefaultPages === 'boolean') {
        createDefaultPages = config.localization.createDefaultPages
      }

      if (index === 0 && createDefaultPages) {
        createPage({
          ...page,
          context: {
            ...(page.context || {}),
            lang: key
          },
          path: page.path
        })

        addToSitemap(page.path)
      }
    })

    resolve()
  })
}
