const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const environment = require('./node/environment')
const config = require('./node/config')
const fm = require('front-matter')

const articles = {}
config.availableLanguages.forEach(({ key: language }) => {
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

const getRandomString = () => {
  let s = ''
  const characterRange = new Array(123 - 97).fill(null).map((_, i) => i + 97).concat(...new Array(58 - 48).fill(null).map((_, i) => i + 48)).map(n => String.fromCharCode(n))
  while (s.length < 16) {
    const index = Math.round(Math.random() * (characterRange.length - 1))
    s += characterRange[index]
  }

  return s
}

const bundleOutput = `netlify.bundle.${getRandomString()}.js`
const adminIndex = path.join(__dirname, 'public/admin/index.html')
const adminTemplate = path.join(__dirname, 'static/admin/index.html')
const adminContents = fs.readFileSync(adminTemplate, { encoding: 'utf8' })
fs.writeFileSync(adminIndex, adminContents.replace('{{bundle}}', bundleOutput), { encoding: 'utf8' })

module.exports = {
  entry: {
    netlify: path.join(__dirname, 'netlify/index.js')
  },
  output: {
    path: path.join(__dirname, 'public/admin'),
    filename: bundleOutput
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
  devtool: !environment.isProduction() && 'inline-source-map',
  mode: environment.isProduction() ? 'production' : 'development',
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      // Branch exposed by netlify build https://www.netlify.com/docs/continuous-deployment/#environment-variables
      HEAD: 'staging',
      UPLOADCARE_PUBLIC_KEY: 'demopublickey',
      GATSBY_IOHK_STARTER_CONFIG: JSON.stringify(config)
    })
  ]
}
