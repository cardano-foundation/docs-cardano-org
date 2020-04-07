const onPostBootstrap = require('./node/gatsby/onPostBootstrap')
const createPages = require('./node/gatsby/createPages')
const sourceNodes = require('./node/gatsby/sourceNodes.js')
const onCreateWebpackConfig = require('./node/gatsby/onCreateWebpackConfig')
const onCreatePage = require('./node/gatsby/onCreatePage')
const onPreInit = require('./node/gatsby/onPreInit')

module.exports.onPreInit = onPreInit
module.exports.onCreatePage = onCreatePage
module.exports.createPages = createPages
module.exports.sourceNodes = sourceNodes
module.exports.onCreateWebpackConfig = onCreateWebpackConfig
module.exports.onPostBootstrap = onPostBootstrap
