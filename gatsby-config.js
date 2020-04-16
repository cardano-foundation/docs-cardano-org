module.exports = {
  plugins: [
    '@rhysforyou/gatsby-plugin-react-helmet-async',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `resources`,
        path: `${__dirname}/resources`
      }
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        // Remove dead code
        pure: true
      }
    },
    'gatsby-transformer-remark',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'IOHK Gatsby Starter',
        short_name: 'IOHK Starter',
        start_url: '/',
        background_color: '#131325',
        theme_color: '#131325',
        display: 'minimal-ui',
        icon_options: {
          purpose: 'maskable'
        }
      }
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true
        }
      }
    },
    'gatsby-plugin-offline'
  ]
}
