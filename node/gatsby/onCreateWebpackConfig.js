const { isProduction } = require('./environment')

module.exports = ({ stage, getConfig, actions }) => {
  if (stage === 'build-javascript' && isProduction()) {
    // Disable source maps on production
    actions.setWebpackConfig({ devtool: false })
  }

  // https://github.com/gatsbyjs/gatsby/issues/7003#issuecomment-426739031
  if (stage === 'build-javascript') {
    const config = getConfig()
    const app = typeof config.entry.app === 'string'
      ? [ config.entry.app ]
      : config.entry.app

    config.entry.app = [ '@babel/polyfill', ...app ]
    actions.replaceWebpackConfig(config)
  }
}
