const { addToSitemap } = require('./sitemap')
const createArticlePages = require('./pages/articles')

module.exports = ({ graphql, actions }) => {
  const { createPage } = actions
  function createPageAction () {
    addToSitemap(arguments[0].path)
    createPage.apply(createPage, arguments)
  }

  // Create dynamic pages here
  createArticlePages({ graphql, createPage: createPageAction })
}
