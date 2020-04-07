import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import NavigationTree from './NavigationTree'
import { LanguageConsumer } from '../../state'

const Container = styled.div`
  width: 100%;
  margin: 0 0 6rem 0;
  padding: 0 2rem 0 0;
`

const Nav = styled.nav`
  text-transform: uppercase;
  > ul > li {
    position: relative;
    @media (min-width:${({ theme }) => theme.dimensions.screenSizes.medium}px) {
      &:after {
        content: '';
        position: absolute;
        bottom:0;
        left:0;
        height:1px;
        width: 5rem;
        background:#fff;
        opacity:0.1;
      }
    }
  }
`

const SideNav = ({ items, path }) => (
  <LanguageConsumer>
    {({ lang }) => (
      <Location>
        {({ location }) => (
          <Container>
            <Nav>
              <NavigationTree lang={lang} items={items} path={path} currentPathname={location.pathname} />
            </Nav>
          </Container>
        )}
      </Location>
    )}
  </LanguageConsumer>
)

SideNav.propTypes = {
  items: PropTypes.array,
  path: PropTypes.string
}

export default SideNav
