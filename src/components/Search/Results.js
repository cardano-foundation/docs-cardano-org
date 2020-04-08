/* eslint-disable */
import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../Button'
import { Helmet } from 'react-helmet'
import showdown from 'showdown'
import FullWidthSection from '../FullWidthSection'
import { SearchField, Result } from '../Search'
import FlexSearch from 'flexsearch'

const Wrapper = styled.div`
  padding: 0 0 6rem 0;
  .content {
    margin-top:3rem;
    width:100%;
    border-left:0.1rem solid ${({ theme }) => theme.colors.subtleAccent};
    @media (min-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px){
      padding:3rem 0 0 3rem;
    }
    .items {
      list-style-type:none;
    }
    @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px){
      > div p, > div ul li {
        padding-left:2rem;
      }
    }
  }
  .section-title{
    line-height:1;
    margin:3rem 0;
    font-weight:200;
    color:${({ theme }) => theme.colors.secondaryText};
  }
`

const HeadingWrap = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    justify-content: space-around;
    flex-flow: wrap;
  }
  h1 {
    flex:3;
    
  }
  form {
    flex:1;
  }
  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    h1 {
      text-align:center;
    }
    h1, form {
      flex: 100%;
    }
  }
`
const NavWrap = styled.div`
  width:100%;
  display:flex;
  justify-content:space-between;    
`

const SearchContainer = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    display: block;
  }
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
    <FullWidthSection>
      <Helmet title={`Searching - Cardano Documentation`} />
      <Wrapper>
        <HeadingWrap>
          <h1 className='section-title'>Search</h1>
          <SearchContainer>
            <SearchField />
          </SearchContainer>
        </HeadingWrap>
        <div className='content'>
          {results && results.length > 0 &&
            <div>
              <p>Showing {page * resultsPerPage + 1} - {Math.min(page * resultsPerPage + resultsPerPage, results.length)} of {results.length} results for <em>{query}</em>.</p>
              <ul className='items'>
                {results.slice(page * resultsPerPage, page * resultsPerPage + resultsPerPage).map((post, i) => (
                  <Result key={i} result={post} query={query} />
                ))}
              </ul>
              <NavWrap>
                <div>
                  {page > 0 &&
                    <Button
                      onClick={e => {
                        e.preventDefault()
                        onPageChange(page - 1)
                      }}
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
                    >
                      Next
                    </Button>
                  }
                </div>
              </NavWrap>
            </div>
          }
          {results && results.length === 0 &&
            <div className='empty'><h2>No matching results</h2><br /><br /><br /></div >
          }
          {!results &&
            <p>Loading...</p>
          }
        </div>
      </Wrapper>
    </FullWidthSection>
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