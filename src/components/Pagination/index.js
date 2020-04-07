import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Link from '../Link'

const Container = styled.div`
  text-align: center;
  margin: 2rem 0;

  a,
  p {
    display: inline-block;
    vertical-align: middle;
    padding: 0.8rem;
    font-size: 2.4rem;
    margin: 0;
  }

  p {
    font-weight: 600;
  }
`

const Pagination = ({ totalPages, currentPage, getHref }) => {
  const pages = []
  let start = currentPage - 2
  while (pages.length < Math.min(totalPages, 3)) {
    if (start >= 1) pages.push(start)
    start++
  }

  return (
    <Container>
      {currentPage > 1 &&
        <Link href={getHref(currentPage - 1)}>
          <FaChevronLeft />
        </Link>
      }
      {pages[0] > 1 &&
        <Link href={getHref(1)}>
          1...
        </Link>
      }
      {pages.length > 1 && pages.map(page => (
        <Fragment key={page}>
          {page === currentPage &&
            <p>
              {page}
            </p>
          }
          {page !== currentPage &&
            <Link href={getHref(page)}>
              {page}
            </Link>
          }
        </Fragment>
      ))}
      {pages[pages.length - 1] < totalPages &&
        <Link href={getHref(totalPages)}>
          ...{totalPages}
        </Link>
      }
      {currentPage < totalPages &&
        <Link href={getHref(currentPage + 1)}>
          <FaChevronRight />
        </Link>
      }
    </Container>
  )
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  getHref: PropTypes.func.isRequired
}

export default Pagination
