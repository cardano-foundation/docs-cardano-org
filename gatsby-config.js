module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `resources`,
        path: `${__dirname}/resources`
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
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        // Remove dead code
        pure: true
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-transformer-remark',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Gatsby IOHK Starter',
        short_name: 'IOHK Starter',
        start_url: '/',
        background_color: '#131325',
        theme_color: '#131325',
        display: 'minimal-ui',
        icon: 'resources/images/icon.png', // This path is relative to the root of the site.
        icon_options: {
          purpose: 'maskable'
        }
      }
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/config/typography.js`
      }
    }
  ]
}
