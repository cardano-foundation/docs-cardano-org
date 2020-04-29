import React, { useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import TinyColor from '@ctrl/tinycolor'
import showdown from 'showdown'
import FlexSearch from 'flexsearch'
import Markdown from '@input-output-hk/front-end-core-components/components/Markdown'
import Link from '@input-output-hk/front-end-core-components/components/Link'
import Layout from '../components/Layout'
import SearchPageQuery from '../queries/SearchPageQuery'
import SearchField from '../components/SearchField'
import SearchResult from '../components/SearchResult'
import Container from '../components/Container'

const HeadingWrap = styled.div`
  display: flex;
  align-items: center;

  h1 {
    flex: 3;
  }

  form {
    flex: 1;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    justify-content: space-around;
    flex-flow: wrap;

    h1 {
      text-align: center;
    }
    h1, form {
      flex: 100%;
    }
  }
`

const SearchContainer = styled.div`
  display: none;
  margin: 2rem 0;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: block;
  }
`

const Content = styled.div`
  margin-top: 2rem;
  padding-left: 2rem;
  border-left: 0.1rem solid ${({ theme }) => new TinyColor(theme.palette.text.primary).setAlpha(0.2).toString()};
`

function getSearchParam (search, key) {
  const params = (search || '').replace(/^\?/, '').split('&')
  while (params.length > 0) {
    const [ k, v ] = params.shift().split('=')
    if (k === key) return decodeURIComponent(v)
  }

  return null
}

const NavWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  
  span {
    opacity: 0.5;
    cursor: default;
  }
`

const Items = styled.ul`
  list-style: none;
`

const LoadingWrapper = styled.div`
  display: inline-block;
  position: relative;
  height: 20rem;
`

const LoadingContainer = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`

export const query = graphql`
  query($lang:String) {
    allCardanoDocsArticle(filter: {lang: {eq: $lang}}) {
      edges {
        node {
          title
          path
          lang
          content
          lastUpdatedFormatted
        }
      }
    }
  }
`

const RESULTS_PER_PAGE = 10

const SearchPageInner = ({ data, pageContext, location }) => {
  const [ query, setQuery ] = useState(getQuery(location))
  const [ page, setPage ] = useState(getPage(location))
  const [ results, setResults ] = useState({ query: null, results: null })

  function getQuery ({ search }) {
    return getSearchParam(search, 'query') || ''
  }

  function getPage ({ search }) {
    const page = parseInt(getSearchParam(search, 'page') || '0')
    if (!page || isNaN(page) || page <= 0) return 0
    return page - 1
  }

  const sanitizeContent = (content) => {
    const converter = new showdown.Converter()
    const htmlContent = converter.makeHtml(content)
    const div = document.createElement('div')
    div.innerHTML = htmlContent.replace(/\n/g, ' ')
    return div.innerText
  }

  const loadResults = () => {
    try {
      const posts = data.allCardanoDocsArticle.edges.map(({ node: { title, path, content, lastUpdatedFormatted } }) => ({
        title,
        path: `/${pageContext.lang}${path}`,
        content,
        lastUpdatedFormatted
      }))

      const index = new FlexSearch({
        encode: 'icase',
        tokenize: 'full',
        threshold: 7,
        depth: 3,
        doc: {
          id: 'path',
          field: [
            'content',
            'title'
          ]
        }
      })

      index.add(posts.map(post => ({
        ...post,
        content: sanitizeContent(post.content)
      })))

      const results = index.search(query, {
        sort: 'publishTimestampDiff'
      })

      setResults({ results, query })
    } catch (err) {
      console.error('Error loading search results', err)
    }
  }

  useEffect(() => {
    const newQuery = getQuery(location)
    const newPage = getPage(location)
    if (newQuery !== query) setQuery(newQuery)
    if (!results.query || results.query !== query) loadResults()
    if (newPage !== page) setPage(newPage)
  }, [ location, query, page, results ])

  function getPageURL (newPage) {
    return `/${pageContext.lang}/search/?query=${encodeURIComponent(query)}&page=${encodeURIComponent(newPage + 1)}`
  }

  function canNavigateToPreviousPage () {
    return page > 0
  }

  function canNavigateToNextPage () {
    return page < Math.floor(results.results.length / RESULTS_PER_PAGE) && page * RESULTS_PER_PAGE + RESULTS_PER_PAGE < results.results.length
  }

  function renderTemplate (template, data) {
    return template.replace(/{{\s?([a-zA-Z0-9_]+)\s?}}/g, (out, name) => data[name] || out)
  }

  function showingResults (template) {
    const templateData = {
      from: page * RESULTS_PER_PAGE + 1,
      to: Math.min(page * RESULTS_PER_PAGE + RESULTS_PER_PAGE, results.results.length),
      total: results.results.length,
      query: `_${query}_`
    }

    return renderTemplate(template, templateData)
  }

  function noMatchingResults (template) {
    const templateData = {
      query: `_${query}_`
    }

    console.log('no', renderTemplate(template, templateData))
    return renderTemplate(template, templateData)
  }

  return (
    <SearchPageQuery
      render={pageContent => (
        <Layout headData={{ title: `Cardano Docs - Search: ${query}` }}>
          <Container>
            <HeadingWrap>
              <h1>{pageContent.title}</h1>
              <SearchContainer>
                <SearchField />
              </SearchContainer>
            </HeadingWrap>
            <Content>
              {results.results && results.results.length > 0 &&
                <div>
                  <Markdown source={showingResults(pageContent.showing_results)} />
                  <Items>
                    {results.results.slice(page * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE + RESULTS_PER_PAGE).map((post, i) => (
                      <Fragment key={post.path}>
                        <SearchResult result={post} query={query} />
                      </Fragment>
                    ))}
                  </Items>
                  <NavWrap>
                    <div>
                      <p>
                        {canNavigateToPreviousPage() &&
                          <Link
                            href={getPageURL(page - 1)}
                            tracking={{ category: 'search_navigation', label: 'previous' }}
                          >
                            {pageContent.previous}
                          </Link>
                        }
                        <span>{!canNavigateToPreviousPage() && pageContent.previous}</span>
                      </p>
                    </div>
                    <div>
                      <p>
                        {canNavigateToNextPage() &&
                          <Link
                            href={getPageURL(page + 1)}
                            tracking={{ category: 'search_navigation', label: 'next' }}
                          >
                            {pageContent.next}
                          </Link>
                        }
                        <span>{!canNavigateToNextPage() && pageContent.next}</span>
                      </p>
                    </div>
                  </NavWrap>
                </div>
              }
              {results.results && results.results.length === 0 &&
                <Box marginBottom={10}>
                  <Markdown source={noMatchingResults(`## ${pageContent.no_results}`)} />
                </Box>
              }
              {!results.results &&
                <Box marginBottom={10}>
                  <LoadingWrapper>
                    <LoadingContainer>
                      <CircularProgress />
                    </LoadingContainer>
                  </LoadingWrapper>
                </Box>
              }
            </Content>
          </Container>
        </Layout>
      )}
    />
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
