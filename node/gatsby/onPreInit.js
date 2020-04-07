const config = require('../../site.config.json')
const fs = require('fs')
const path = require('path')
const data = require('./data')
const fm = require('front-matter')

const setupEnvironment = ({ program }) => {
  if (!process.env.GATSBY_URL) {
    // https://www.netlify.com/docs/continuous-deployment/#environment-variables
    if (process.env.CONTEXT && ['production', 'deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT)) {
      process.env.GATSBY_URL = process.env.DEPLOY_URL.replace(/\/$/, '')
    } else if (process.env.NODE_ENV === 'development') {
      process.env.GATSBY_URL = `http://${program.host}:${program.port}`
    } else {
      // Otherwise assume production
      const CNAME = fs.readFileSync(path.join(__dirname, '../../static/CNAME'), { encoding: 'utf8' }).trim()
      process.env.GATSBY_URL = `https://${CNAME.replace(/\/$/, '')}`
    }
  }
}

const buildArticles = (markdownArticles, { key, baseURL = '/' } = {}) => {
  const articles = []
  let filteredArticles
  if (!key) {
    filteredArticles = markdownArticles.filter(({ content }) => !content.attributes.parent)
  } else {
    filteredArticles = markdownArticles.filter(({ content }) => content.attributes.parent === key)
  }

  filteredArticles.forEach(({ key, content }) => {
    articles.push({
      title: content.attributes.title,
      content: content.body,
      key,
      path: `${baseURL}${key}/`,
      order: content.attributes.order || 1,
      redirects: content.attributes.redirects,
      children: buildArticles(markdownArticles, { key, baseURL: `${baseURL}${key}/` })
    })
  })

  articles.sort((a, b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0)
  return articles
}

const getArticles = (lang) => {
  const basePath = path.join(__dirname, '../../resources/content/articles', lang)
  if (!fs.existsSync(basePath)) return []

  const items = fs.readdirSync(basePath, { encoding: 'utf8' })
  const articlesMarkdown = []
  items.forEach((item) => {
    const key = item.replace(new RegExp(`-${lang}\\.md$`), '')
    articlesMarkdown.push({
      content: fm(fs.readFileSync(path.join(basePath, item), { encoding: 'utf8' })),
      key
    })
  })

  return buildArticles(articlesMarkdown)
}

module.exports = async ({ store }) => {
  setupEnvironment(store.getState())

  const articles = {}
  Object.keys(config.availableLanguages).forEach(lang => {
    const languageArticles = getArticles(lang)
    if (languageArticles) articles[lang] = getArticles(lang)
  })

  data.set('articles', articles)
}
