const config = require('../../site.config.json')
const { addToSitemap } = require('./sitemap')

const pagesToIgnore = [
  '/dev-404-page/',
  '/404/',
  '/404.html',
  '/offline-plugin-app-shell-fallback/'
]

module.exports = ({ page, actions }) => {
  const { createPage } = actions
  if (pagesToIgnore.includes(page.path)) return Promise.resolve()

  return new Promise(resolve => {
    Object.keys(config.availableLanguages).forEach(lang => {
      const path = `/${lang}${page.path}`
      createPage({
        ...page,
        path,
        context: { lang }
      })

      addToSitemap(path)
    })

    resolve()
  })
}
