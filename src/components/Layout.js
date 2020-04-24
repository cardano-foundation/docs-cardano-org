import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Head from '@input-output-hk/front-end-core-components/components/Head'
import Language from '@input-output-hk/front-end-core-components/components/Language'
import Theme from '@input-output-hk/front-end-core-components/components/Theme'
import { Location } from '@reach/router'
import Main from '../templates/Main'

const Layout = ({ children, headData = {}, template = Main }) => {
  const Template = template
  return (
    <Theme.Consumer>
      {({ theme }) => (
        <Location>
          {({ location }) => (
            <Language.Consumer>
              {({ key: lang, locale, availableLanguages }) => (
                <Fragment>
                  <StaticQuery
                    query={graphql`
                      query {
                        siteHeadData: allFile(filter:{relativePath:{glob:"content/meta/__site.*.md"}}) {
                          nodes{
                            relativePath,
                            childMarkdownRemark{
                              frontmatter {
                                head {
                                  title
                                  meta {
                                    name
                                    content
                                    file
                                  }
                                }
                              }
                            }
                          }
                        }
                        pageHeadData: allFile(filter:{relativePath:{regex:"/^content\/meta\/.*\\.md$/"}}) {
                          nodes{
                            relativePath,
                            childMarkdownRemark{
                              frontmatter {
                                head {
                                  title
                                  meta {
                                    name
                                    content
                                    file
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    `}
                    render={({ siteHeadData, pageHeadData }) => {
                      function getURIPathWithoutLang () {
                        return location.pathname.replace(new RegExp(`^\\/${lang}`), '')
                      }

                      const uriPathWithoutLang = getURIPathWithoutLang()
                      const pageContentPath = uriPathWithoutLang === '/'
                        ? 'index'
                        : uriPathWithoutLang.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '___')

                      const page = pageHeadData.nodes.filter(node => node.relativePath === `content/meta/${pageContentPath}-${lang}.md`).shift()
                      const site = siteHeadData.nodes.filter(node => node.relativePath === `content/meta/__site-${lang}.md`).shift()

                      console.log({ headData })
                      return (
                        <Head
                          site={{
                            title: (site &&
                              site.childMarkdownRemark &&
                              site.childMarkdownRemark.frontmatter &&
                              site.childMarkdownRemark.frontmatter.head &&
                              site.childMarkdownRemark.frontmatter.head.title) || '',
                            meta: (site &&
                              site.childMarkdownRemark &&
                              site.childMarkdownRemark.frontmatter &&
                              site.childMarkdownRemark.frontmatter.head &&
                              site.childMarkdownRemark.frontmatter.head.meta) || []
                          }}
                          page={{
                            title: (page &&
                              page.childMarkdownRemark &&
                              page.childMarkdownRemark.frontmatter &&
                              page.childMarkdownRemark.frontmatter.head &&
                              page.childMarkdownRemark.frontmatter.head.title) || '',
                            meta: (page &&
                              page.childMarkdownRemark &&
                              page.childMarkdownRemark.frontmatter &&
                              page.childMarkdownRemark.frontmatter.head &&
                              page.childMarkdownRemark.frontmatter.head.meta) || []
                          }}
                          component={{
                            title: headData.title,
                            meta: headData.meta
                          }}
                          locale={locale}
                          availableLocales={availableLanguages.map(({ locale }) => locale).filter(locale => Boolean(locale))}
                          lang={lang}
                          url={process.env.GATSBY_URL}
                        >
                          {theme.typography.googleFontsURL && <link rel='stylesheet' type='text/css' href={theme.typography.googleFontsURL} />}
                        </Head>
                      )
                    }}
                  />
                  <Template>
                    {children}
                  </Template>
                </Fragment>
              )}
            </Language.Consumer>
          )}
        </Location>
      )}
    </Theme.Consumer>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  headData: PropTypes.shape({
    title: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      content: PropTypes.string,
      file: PropTypes.string
    }))
  }),
  template: PropTypes.func
}

export default Layout
