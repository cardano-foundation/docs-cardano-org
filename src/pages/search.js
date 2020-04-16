import React, { Fragment, useState, useEffect } from 'react'
import { graphql, navigate } from 'gatsby'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import Container from '@material-ui/core/Container'
import Layout from '../components/Layout'
// import SearchPageQuery from '../queries/SearchPageQuery'
import SearchResults from '../components/SearchResults'

function getSearchParam (search, key) {
  const params = (search || '').replace(/^\?/, '').split('&')
  while (params.length > 0) {
    const [ k, v ] = params.shift().split('=')
    if (k === key) return decodeURIComponent(v)
  }

  return null
}

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

  function onPageChange (newPage) {
    navigate(`/${pageContext.lang}/search/?query=${encodeURIComponent(query)}&page=${encodeURIComponent(newPage + 1)}`)
  }

  return (
    <Fragment>
      <Container maxWidth='xl'>
        <SearchResults
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
      </Container>
    </Fragment>
  )
}

const SearchPage = ({ data, pageContext }) => (
  <Layout>
    {console.log({ pageContext })}
    <Location>
      {({ location }) => (
        <SearchPageInner data={data} pageContext={pageContext} location={location} />
      )}
    </Location>
  </Layout>
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
