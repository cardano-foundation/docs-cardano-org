const fs = require('fs')
const path = require('path')
const config = require('../node/config')
const onPreInit = require('../node/gatsby/onPreInit')
const data = require('../node/gatsby/data')

const redirects = {}

function addRedirect (staticPath, content, status = 200, to = null, useGlob = true) {
  if (redirects[staticPath]) return content
  const withRedirect = `${content}
[[redirects]]
  from = "${staticPath}${useGlob ? '*' : ''}"
  to = "${to || staticPath}"
  status = ${status}
`

  redirects[staticPath] = true
  return withRedirect
}

async function buildNetlifyToml () {
  const baseTomlPath = path.join(__dirname, '..', '.netlify.toml')
  let content = ''
  if (fs.existsSync(baseTomlPath) && fs.statSync(baseTomlPath).isFile) {
    content = fs.readFileSync(path.join(__dirname, '..', '.netlify.toml'), { encoding: 'utf-8' })
  }

  config.routes.forEach(({ path: routePath }) => {
    const staticPath = routePath.split(':').shift()
    config.availableLanguages.forEach(({ key: lang }, index) => {
      if (config.localization.createDefaultPages && index === 0) content = addRedirect(staticPath, content)
      if (config.localization.createLocalizedPages) content = addRedirect(`/${lang}${staticPath}`, content)
    })
  })

  config.availableLanguages.forEach(({ key: lang }) => {
    if (config.localization.createLocalizedPages) content = addRedirect(`/${lang}/`, content, 404, `/${lang}/404/index.html`)
  })

  await onPreInit({ store: { getState: () => ({ program: { host: 'localhost', port: '8000' } }) } })
  const articles = data.get('articles')

  const createArticleRedirects = (lang, articles) => {
    articles.forEach((article) => {
      if (article.content) {
        if (article.redirects) {
          article.redirects.forEach((redirect) => {
            content = addRedirect(`/${lang}${redirect}`, content, 301, `/${lang}${article.path}`, false)
          })
        }
      }

      if (article.children.length > 0) createArticleRedirects(lang, article.children)
    })
  }

  Object.keys(articles).forEach((lang) => {
    createArticleRedirects(lang, articles[lang])
  })

  fs.writeFileSync(path.join(__dirname, '..', 'netlify.toml'), content, { encoding: 'utf-8' })
}

buildNetlifyToml()
