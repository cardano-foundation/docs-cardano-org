import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { LanguageConsumer } from '../../state'

const Query = ({ render }) => (
  <LanguageConsumer>
    {({ lang }) => (
      <StaticQuery
        query={graphql`
          query {
            iohkMainNavigationLinks {
              mainNavigationLinks {
                lang
                items {
                  label
                  path
                }
              }
            }
          }
        `}
        render={({ iohkMainNavigationLinks }) => {
          const items = (iohkMainNavigationLinks.mainNavigationLinks.filter((itemSet) => itemSet.lang === lang).shift() || {}).items
          if (!items) throw new Error(`No header links for language ${lang}`)
          return render(items)
        }}
      />
    )}
  </LanguageConsumer>
)

Query.propTypes = {
  render: PropTypes.func.isRequired
}

export default Query
