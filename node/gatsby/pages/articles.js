const path = require('path')
const data = require('../data')
const moment = require('moment')
require('moment/locale/en-gb')
require('moment/locale/zh-cn')

function cleanNavigationContext (context) {
  context.hasContent = Boolean(context.content)
  delete context.content
  context.children.forEach(child => {
    cleanNavigationContext(child)
  })

  return context
}

function getContext (article) {
  return JSON.parse(JSON.stringify(article))
}

module.exports = ({ createPage }) => {
  const articleTemplate = path.join(__dirname, '../../../src/templates/Article.js')
  function createChildPages (lang, articles, { context = null } = {}) {
    articles.forEach((article) => {
      const navigationContext = context || cleanNavigationContext(getContext(article))
      if (article.content) {
        const lastUpdated = moment(article.lastUpdated, 'YYYY-MM-DDTHH:mm:ssZ')
        lastUpdated.utcOffset(0)
        createPage({
          path: `/${lang}${article.path}`,
          component: articleTemplate,
          context: {
            pageTitle: article.title,
            navigationContext,
            content: article.content,
            lastUpdated: lastUpdated.format('MMMM D, YYYY HH:mm [UTC]'),
            lang
          }
        })
      }

      if (article.children.length > 0) createChildPages(lang, article.children, { context: navigationContext })
    })
  }

  const articles = data.get('articles')
  Object.keys(articles).forEach((lang) => {
    moment.locale(lang)
    createChildPages(lang, articles[lang])
  })
}
