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
            allFile(filter:{relativePath:{glob:"content/header/*.md"}}) {
              nodes{
                relativePath,
                childMarkdownRemark{
                  frontmatter {
                    select_language
                  }
                }
              }
            }
          }
        `}
        render={({ allFile }) => {
          const content = allFile.nodes.filter(node => node.relativePath === `content/header/header-${lang}.md`).shift()
          if (!content || !content.childMarkdownRemark) throw new Error(`No picker translations found for language ${lang}`)
          return render(content.childMarkdownRemark.frontmatter)
        }}
      />
    )}
  </LanguageConsumer>
)

Query.propTypes = {
  render: PropTypes.func.isRequired
}

export default Query
