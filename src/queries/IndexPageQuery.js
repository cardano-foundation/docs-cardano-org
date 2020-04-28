import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Language from '@input-output-hk/front-end-core-components/components/Language'

const IndexPageQuery = ({ render }) => (
  <Language.Consumer>
    {({ key: lang }) => (
      <StaticQuery
        query={graphql`
          query {
            allFile(filter:{relativePath:{glob:"content/pages/index/*.md"}}) {
              nodes{
                relativePath,
                childMarkdownRemark{
                  frontmatter {
                    content {
                      title
                      hero {
                        hero_title
                        hero_subtitle
                        hero_body
                        hero_cta
                        hero_cta_link
                      }
                      ouroboros {
                        ouroboros_lead
                        ouroboros_body
                        ouroboros_resilient
                        ouroboros_scalable
                      }
                      cardano_topic {
                        topic_title
                        topic_link
                        topic_body
                      }
                      stake_pool_topic {
                        topic_title
                        topic_link
                        topic_body
                      }
                      exchange_topic {
                        topic_title
                        topic_link
                        topic_body
                      }
                    }
                  }
                }
              }
            }
          }
        `}
        render={({ allFile }) => {
          const content = allFile.nodes.filter(node => node.relativePath === `content/pages/index/index-${lang}.md`).shift()
          if (!content || !content.childMarkdownRemark) throw new Error(`No index translations found for language ${lang}`)
          return render(content.childMarkdownRemark.frontmatter.content)
        }}
      />
    )}
  </Language.Consumer>
)

IndexPageQuery.propTypes = {
  render: PropTypes.func.isRequired
}

export default IndexPageQuery
