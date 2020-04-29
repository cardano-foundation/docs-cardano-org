const fs = require('fs')
const path = require('path')
const fm = require('front-matter')
const moment = require('moment')
require('moment/locale/en-gb')
require('moment/locale/zh-cn')
const config = require('../config')
const data = require('./data')

const setupEnvironment = ({ program }) => {
  if (!process.env.GATSBY_URL) {
    // https://www.netlify.com/docs/continuous-deployment/#environment-variables
    if (process.env.CONTEXT && [ 'production', 'deploy-preview', 'branch-deploy' ].includes(process.env.CONTEXT)) {
      process.env.GATSBY_URL = process.env.DEPLOY_URL.replace(/\/$/, '')
    } else if (process.env.NODE_ENV === 'development') {
      process.env.GATSBY_URL = `http://${program.host}:${program.port}`
    } else if (fs.existsSync(path.join(__dirname, '../../static/CNAME'))) {
      const CNAME = fs.readFileSync(path.join(__dirname, '../../static/CNAME'), { encoding: 'utf8' }).trim()
      process.env.GATSBY_URL = `https://${CNAME.replace(/\/$/, '')}`
    } else {
      process.env.GATSBY_URL = 'http://127.0.0.1:1234'
    }
  }

  if (!process.env.GATSBY_IOHK_STARTER_CONFIG) process.env.GATSBY_IOHK_STARTER_CONFIG = JSON.stringify(config)
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
    const lastUpdated = moment(content.attributes.last_updated, 'YYYY-MM-DDTHH:mm:ssZ')
    lastUpdated.utcOffset(0)

    articles.push({
      title: content.attributes.title,
      content: content.body,
      lastUpdatedFormatted: lastUpdated.format('MMMM D, YYYY HH:mm [UTC]'),
      lastUpdated: content.attributes.last_updated,
      key,
      path: `${baseURL}${key}/`,
      order: content.attributes.order || 1,
      redirects: content.attributes.redirects,
      externalHref: content.attributes.external_href || '',
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
  config.availableLanguages.forEach(({ key: lang }) => {
    moment.locale(lang)
    const languageArticles = getArticles(lang)
    if (languageArticles) articles[lang] = getArticles(lang)
  })

  data.set('articles', articles)
}
