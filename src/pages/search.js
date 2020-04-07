import React, { Fragment, useState } from 'react'
import { graphql, navigate } from 'gatsby'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { getSearchParam } from '../helpers/url'
import { Results } from '../components/Search'

export const query = graphql`
  query($lang:String) {
    allCardanoDocsArticle(filter: {lang: {eq: $lang}}) {
      edges {
        node {
          title
          path
          lang
          content
        }
      }
    }
  }
`

const SearchPageInner = ({ data, pageContext, location }) => {
  const [ query, setQuery ] = useState(getSearchParam(location.search, 'query') || '')
  return (
    <Fragment>
      <Results
        lang={pageContext.lang}
        onSearch={value => {
          setQuery(value)
          navigate(`/${pageContext.lang}/search/?query=${encodeURIComponent(value)}`)
        }}
        query={query}
        searchData={
          data.allCardanoDocsArticle.edges.map(({ node: { title, path, content } }) => ({
            title,
            path: `/${pageContext.lang}${path}`,
            content
          }))
        }
      />
    </Fragment>
  )
}

const SearchPage = ({ data, pageContext }) => (
  <Location>
    {({ location }) => (
      <SearchPageInner data={data} pageContext={pageContext} location={location} />
    )}
  </Location>
)

SearchPage.propTypes = {
  pageContext: PropTypes.shape({
    lang: PropTypes.string.isRequired
  }).isRequired,
  data: PropTypes.object
}

SearchPageInner.propTypes = {
  pageContext: PropTypes.shape({
    lang: PropTypes.string.isRequired
  }).isRequired,
  data: PropTypes.object,
  location: PropTypes.object
}

export default SearchPage
