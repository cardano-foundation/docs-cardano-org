import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '@input-output-hk/front-end-core-components/components/Link'
import TinyColor from '@ctrl/tinycolor'

const ResultWrap = styled.li`
  &.item+&.item {
    border-top: 0.1rem solid ${({ theme }) => new TinyColor(theme.palette.text.primary).setAlpha(0.2).toString()};
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  &.item {
    margin: 0 0 2rem;

    .title {
      font-size:1.6rem;
      text-transform: uppercase;
      span span {
        background: ${({ theme }) => new TinyColor(theme.palette.text.primary).setAlpha(0.2).toString()};
      }
    }

    .body {
      font-size: 1.2rem;
      line-height: 1.7;
      p span strong {
        background: ${({ theme }) => new TinyColor(theme.palette.text.primary).setAlpha(0.2).toString()};
      }
    }
  }
`
const SearchResult = ({ result, query }) => {
  const highlightMatch = (text, query, { indexes = [], limit = null, surroundingContext = false } = {}) => {
    const startIndex = indexes[indexes.length - 1]
    const remainingText = text.substring(startIndex === undefined ? 0 : (startIndex + query.length))
    const matchIndex = remainingText.toLowerCase().indexOf(query.toLowerCase())
    if (matchIndex < 0 && indexes.length === 0) {
      return (surroundingContext && text.length > 200)
        ? `${text.substring(0, 500)} ...`
        : text
    }

    if (matchIndex >= 0 && (!limit || indexes.length + 1 <= limit)) return highlightMatch(text, query, { indexes: [ ...indexes, startIndex === undefined ? matchIndex : (matchIndex + startIndex + query.length) ], limit, surroundingContext })

    if (surroundingContext) {
      return (
        <Fragment>
          {indexes.map(i => {
            const startIndex = i - 200 + query.length
            let endIndex = i + 300
            if (startIndex < 0) endIndex += Math.abs(startIndex)
            return (
              <p key={`${text}_${query}_${i}`}>
                {startIndex > 0 && '... '}{highlightMatch(text.substring(startIndex, endIndex), query)}{endIndex < text.length - query.length + 1 && ' ...'}
              </p>
            )
          })}
        </Fragment>
      )
    } else {
      return (
        <span>
          {indexes.map((i, key) => (
            <Fragment key={`${text}_${query}_${i}`}>
              {text.substring(key === 0 ? 0 : indexes[key - 1] + query.length, i)}<strong>{text.substring(i, i + query.length)}</strong>
            </Fragment>
          ))}
          {text.substring(indexes[indexes.length - 1] + query.length)}
        </span>
      )
    }
  }

  return (
    <ResultWrap className='item' key={result.key}>
      <strong className='title'>
        <Link href={result.path}>
          {result.title && <span>{result.title}</span>}
        </Link>
      </strong>
      <div>
        <Link href={result.path}>
          <small>{result.path}</small>
        </Link>
      </div>
      <div className='body'>
        {highlightMatch(result.content, query, { surroundingContext: true, limit: 1 })}
      </div>
    </ResultWrap>
  )
}

SearchResult.propTypes = {
  query: PropTypes.string,
  result: PropTypes.object
}

export default SearchResult
