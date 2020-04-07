/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import Query from './Query'
import Link from '../Link'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'

const Container = styled.div`
  width:100%;
  flex: 2;
  display: flex;
  justify-content: flex-start;
  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    flex: 1 100%;
  }
`

const Nav = styled.nav`
  margin-left: -2rem;
  a {
    font-weight: 600;
    letter-spacing: 0.1em;
    position:relative;
      &:hover,
      &:focus {
        color: ${({ theme }) => theme.colors.interactiveHighlight};
        background: ${({ background, theme }) =>
    background || theme.colors.subtle}
      }
      &.active:after {
        position:absolute;
        content: ' ';
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background: ${({ theme }) => theme.colors.interactiveHighlight};
        height:4px;
        width: 50%;
        bottom:0;
        left:25%;
        opacity: 0.5;
      }
    }
  > ul {
    margin: 0;

    > li {
      margin: 0;
      display: inline-block;
      position: relative;
      a {
        padding: 2rem;
        display: inline-block;

        &.active {
          color: ${({ theme }) => theme.colors.text};
        }
      }
    }
  }
`

function isActive (path, currentPathname) {
  let rootPath = path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .split('/').slice(0, 2).join('/')
  
  rootPath = `/${rootPath}/`
  return currentPathname.substring(0, rootPath.length) === rootPath
}

const DesktopNavigation = ({ className }) => (
  <Location>
    {({ location }) => (
      <Container className={`${className}`}>
        <Query
          render={items => (
            <Nav className='text-transform-uppercase'>
              <ul>
                {items.map(item => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={isActive(item.path, location.pathname) ? 'active' : ''}
                      tracking={{ label: 'desktop_navigation_' + item.path }}
                      title={item.label}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Nav>
          )}
        />
      </Container>
    )}
  </Location>
)

DesktopNavigation.propTypes = {
  className: PropTypes.string
}

export default DesktopNavigation
