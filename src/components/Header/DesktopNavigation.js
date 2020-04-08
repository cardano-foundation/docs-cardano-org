/* eslint-disable */
import React, { useState, Fragment } from 'react'
import styled from 'styled-components'
import Query from './Query'
import TabNav from './TabNav'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'

const Container = styled.div`
  max-width: 100vw;
  /* flex: 2;
  display: flex;
  justify-content: flex-start;
  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    flex: 1 100%;
  } */
`

const Nav = styled(Container)`
  div {
    background: transparent;
    box-shadow: none;
  }
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
      &.active {
        border:none;
      }
    }
`

function getPath(path) {
   let rootPath = path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .split('/').slice(0, 2).join('/')

  rootPath = `/${rootPath}/`

  return rootPath
}

const DesktopNavigation = () => {

  const [value, setValue] = useState(getPath(location.pathname))
  
  const handleChange = (e, value) => {
    setValue(value)
  }

  return (
    <Location>
      {({ location }) => (
        <Fragment>
          <Nav>
            <Query
              render={items => (
                <TabNav
                  tabItems={items}
                  selectedTab={value}
                  onChange={handleChange}
                />
              )}
            />
          </Nav>
        </Fragment>
      )}
    </Location >
  )

}

DesktopNavigation.propTypes = {
  className: PropTypes.string
}

export default DesktopNavigation
