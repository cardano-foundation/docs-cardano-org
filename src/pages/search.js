import React, { Fragment, useState, useEffect } from 'react'
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
  const [ query, setQuery ] = useState(getQuery(location))
  const [ page, setPage ] = useState(getPage(location))

  function getQuery ({ search }) {
    return getSearchParam(search, 'query') || ''
  }

  function getPage ({ search }) {
    const page = parseInt(getSearchParam(search, 'page') || '0')
    if (!page || isNaN(page) || page <= 0) return 1
    return page
  }

  useEffect(() => {
    const newQuery = getQuery(location)
    const newPage = getPage(location)
    if (newQuery !== query) setQuery(newQuery)
    if (newPage !== page) setPage(newPage)
  }, [ location, query, page ])

  function onSearch (newQuery) {
    navigate(`/${pageContext.lang}/search/?query=${encodeURIComponent(newQuery)}&page=${encodeURIComponent(page + 1)}`)
  }

  function onPageChange (newPage) {
    navigate(`/${pageContext.lang}/search/?query=${encodeURIComponent(query)}&page=${encodeURIComponent(newPage + 1)}`)
  }

  return (
    <Fragment>
      <Results
        lang={pageContext.lang}
        onSearch={onSearch}
        onPageChange={onPageChange}
        query={query}
        page={page - 1}
        resultsPerPage={10}
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
