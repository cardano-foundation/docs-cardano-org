import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Language from '@input-output-hk/front-end-core-components/components/Language'

const SearchPageQuery = ({ render }) => (
  <Language.Consumer>
    {({ key: lang }) => (
      <StaticQuery
        query={graphql`
          query {
            allFile(filter:{relativePath:{glob:"content/pages/search/*.md"}}) {
              nodes{
                relativePath,
                childMarkdownRemark{
                  frontmatter {
                    content {
                      title
                      showing_results
                      previous
                      next
                      no_results
                      last_updated
                    }
                  }
                }
              }
            }
          }
        `}
        render={({ allFile }) => {
          const content = allFile.nodes.filter(node => node.relativePath === `content/pages/search/search-${lang}.md`).shift()
          if (!content || !content.childMarkdownRemark) throw new Error(`No search translations found for language ${lang}`)
          return render(content.childMarkdownRemark.frontmatter.content)
        }}
      />
    )}
  </Language.Consumer>
)

SearchPageQuery.propTypes = {
  render: PropTypes.func.isRequired
}

export default SearchPageQuery
