import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { LanguageConsumer } from '../../state'

const Query = ({ render }) => (
  <LanguageConsumer>
    {({ lang }) => (
      <StaticQuery
        query={graphql`
          query{
            allContent: allFile(filter:{relativePath:{glob:"content/pages/generated/**/*.md"}}) {
              nodes{
                relativePath,
                childMarkdownRemark{
                  html
                  frontmatter {
                    title
                  }
                }
              }
            }
          }
        `}
        render={({ allContent }) => {
          return render({
            frontmatter: allContent.nodes
          })
        }}
      />
    )}
  </LanguageConsumer>
)

Query.propTypes = {
  render: PropTypes.func.isRequired
}

export default Query
