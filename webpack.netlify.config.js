const config = require('./site.config.json')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const fm = require('front-matter')

const articles = {}
Object.keys(config.availableLanguages).forEach(language => {
  articles[language] = fs
    .readdirSync(
      path.join(__dirname, `resources/content/articles/${language}`),
      { encoding: 'utf8' }
    )
    .map(filename => {
      const data = fs.readFileSync(
        path.join(
          __dirname,
          `resources/content/articles/${language}`,
          filename
        ),
        { encoding: 'utf8' }
      )
      const content = fm(data)
      const slug = filename.replace(new RegExp(`^(.*?)-${language}.md$`), '$1')

      return {
        label: content.attributes.title,
        value: slug
      }
    })
})
process.env.IOHK_AVAILABLE_ARTICLES = JSON.stringify(articles)

const isProduction = () => process.env.NODE_ENV === 'production'
module.exports = {
  entry: {
    netlify: path.join(__dirname, 'netlify/index.js')
  },
  output: {
    path: path.join(__dirname, 'public/admin'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader'
      }
    ]
  },
  devtool: !isProduction() && 'inline-source-map',
  mode: isProduction() ? 'production' : 'development',
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      // Branch exposed by netlify build https://www.netlify.com/docs/continuous-deployment/#environment-variables
      HEAD: 'staging',
      IOHK_AVAILABLE_ARTICLES: ''
    })
  ]
}
