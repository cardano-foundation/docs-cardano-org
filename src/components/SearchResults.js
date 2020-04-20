import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import showdown from 'showdown'
import FlexSearch from 'flexsearch'
import TinyColor from '@ctrl/tinycolor'
import SearchField from './SearchField'
import SearchResult from './SearchResult'

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
const NavWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;    
`

const SearchContainer = styled.div`
  display: none;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: block;
  }
`

const Items = styled.ul`
  list-style: none;
`

const Content = styled.div`
  margin-top: 2rem;
  padding-left: 2rem;
  border-left: 0.1rem solid ${({ theme }) => new TinyColor(theme.palette.text.primary).setAlpha(0.2).toString()};
`

const Results = ({ query, onPageChange, searchData, page, resultsPerPage }) => {
  const [ results, setResults ] = useState(null)

  const sanitizeContent = (content) => {
    const converter = new showdown.Converter()
    const htmlContent = converter.makeHtml(content)
    const div = document.createElement('div')
    div.innerHTML = htmlContent.replace(/\n/g, ' ')
    return div.innerText
  }

  const loadResults = async () => {
    try {
      const posts = searchData
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

      setResults(results)
    } catch (err) {
      console.error('Error loading blog search results', err)
    }
  }

  useEffect(() => {
    loadResults()
  }, [ query ])

  return (
    <Fragment>
      <HeadingWrap>
        <h1>Search</h1>
        <SearchContainer>
          <SearchField />
        </SearchContainer>
      </HeadingWrap>
      <Content>
        {results && results.length > 0 &&
          <div>
            <p>Showing {page * resultsPerPage + 1} - {Math.min(page * resultsPerPage + resultsPerPage, results.length)} of {results.length} results for <em>{query}</em>.</p>
            <Items>
              {results.slice(page * resultsPerPage, page * resultsPerPage + resultsPerPage).map((post, i) => (
                <SearchResult key={i} result={post} query={query} />
              ))}
            </Items>
            <NavWrap>
              <div>
                {page > 0 &&
                  <Button
                    onClick={e => {
                      e.preventDefault()
                      onPageChange(page - 1)
                    }}
                    color='primary'
                    variant='contained'
                  >
                    Previous
                  </Button>
                }
              </div>
              <div>
                {page < Math.floor(results.length / resultsPerPage) && page * resultsPerPage + resultsPerPage < results.length &&
                  <Button
                    onClick={e => {
                      e.preventDefault()
                      onPageChange(page + 1)
                    }}
                    color='primary'
                    variant='contained'
                  >
                    Next
                  </Button>
                }
              </div>
            </NavWrap>
          </div>
        }
        {results && results.length === 0 &&
          <div><h2>No matching results</h2><br /><br /><br /></div>
        }
        {!results &&
          <p>Loading...</p>
        }
      </Content>
    </Fragment>
  )
}

Results.propTypes = {
  query: PropTypes.string,
  onPageChange: PropTypes.func.isRequired,
  searchData: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.number.isRequired,
  resultsPerPage: PropTypes.number.isRequired
}

export default Results
