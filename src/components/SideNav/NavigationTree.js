import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '../Link'
import Accordion from './Accordion'

const Nav = styled.ul`
  list-style: none;
  margin:0;
  @media (min-width: ${({ theme }) => theme.dimensions.screenSizes.medium}px){
    div ul {
      margin-left: 2rem;
    }
  }
  li {
    padding: 2rem 0;
  }
  p {
    font-weight:600;
  }
  a {
    &.active {
      font-weight:600;
    }
  }
  @media(max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    text-align: center;
    padding:0;
    background: ${({ theme }) => theme.colors.subtle};
  }
`

const NavigationTree = ({ items, lang, path, currentPathname }) => {
  return (
    <Nav key={path}>
      {items.map((item) => (
        <li key={item.path}>
          {item.children.length === 0 &&
            <Link
              href={`${item.path}`}
              activeClassName='active'
              tracking={{ label: `desktop_navigation_${item.path}` }}
              title={item.title}
              partiallyActive
            >
              {item.title}
            </Link>
          }

          {item.children.length > 0 &&
            <Accordion
              item={item}
              lang={lang}
              currentPathname={currentPathname}
            />
          }
        </li>
      ))}
    </Nav>
  )
}

NavigationTree.propTypes = {
  items: PropTypes.array.isRequired,
  lang: PropTypes.string.isRequired,
  currentPathname: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired
}

export default NavigationTree
