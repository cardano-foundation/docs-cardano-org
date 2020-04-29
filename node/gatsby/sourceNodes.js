const data = require('./data')
const crypto = require('crypto')

module.exports = ({ actions }) => {
  const { createNode } = actions
  const articles = data.get('articles')

  function findNextLink (children, basePath) {
    let path
    const childrenValues = [ ...children ]
    while (!path && childrenValues.length > 0) {
      const next = childrenValues.shift()
      if (next.content) {
        path = `${basePath}/${next.key}/`
      } else {
        path = findNextLink(next.children, `${basePath}/${next.key}`)
      }
    }

    return path
  }

  function getHeaderLinks (articles, lang) {
    const headerLinks = []
    articles.forEach(article => {
      let path = `/${lang}`
      if (article.content) {
        path += `/${article.key}/`
      } else {
        path += findNextLink(article.children, `/${article.key}`)
      }

      headerLinks.push({
        path,
        label: article.title
      })
    })

    return headerLinks
  }

  createNode({
    mainNavigationLinks: Object.keys(articles).map(lang => ({
      lang,
      items: getHeaderLinks(articles[lang], lang)
    })),
    id: `iohk-main-navigation-links`,
    parent: null,
    children: [],
    internal: {
      type: 'IOHKMainNavigationLinks',
      description: 'IOHK main navigation links taken from documentation',
      contentDigest: crypto
        .createHash(`md5`)
        .update(JSON.stringify(articles))
        .digest(`hex`)
    }
  })

  function createArticleNodes (articles, lang) {
    articles.forEach(article => {
      createNode({
        path: article.path,
        id: `document-id-${article.path}-${lang}`,
        content: article.content,
        title: article.title,
        lastUpdatedFormatted: article.lastUpdatedFormatted,
        lang,
        parent: null,
        children: [],
        internal: {
          type: 'CardanoDocsArticle',
          description: 'Cardano Docs article',
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify({ ...article, lang }))
            .digest(`hex`)
        }
      })

      if (article.children.length > 0) {
        createArticleNodes(article.children, lang)
      }
    })
  }

  Object.keys(articles).forEach(lang => {
    createArticleNodes(articles[lang], lang)
  })
}
