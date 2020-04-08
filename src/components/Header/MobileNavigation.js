import React, { useState, Fragment, useEffect } from 'react'
import styled from 'styled-components'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Query from './Query'
import PropTypes from 'prop-types'
import Link from '../Link'
import { MdMenu, MdClose } from 'react-icons/md'
import {
  addEventListener,
  removeEventListener,
  getScrollOffset,
  scrollTo
} from '../../helpers/dom'
import { SearchField } from '../Search'
import PickerContainer from '../PickerContainer'

const MobilePicker = styled.div`
  > div {
    position: static;
    right: unset;
    transform: translateX(0);
  }
`

const Container = styled.div`
  position: absolute;
  width: 100%;
  z-index: 4;
  left: 0;
  top: 0;

  .toggle-menu {
    position: absolute;
    z-index: 5;
    top: 2rem;
    right: 1rem;
    height: 3.2rem;
    color: ${({ theme }) => theme.colors.interactive};
    font-size: 3.4rem;
  }

  @media (min-width: ${({ theme }) => theme.dimensions.mobileBreakpoint - 1}px) {
    display: none;
  }
`

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 6rem;
  height: 100vh;
  width: 100%;
  position: relative;
  transform: translate(0, 0);
  background-color: ${({ theme }) => theme.colors.primary};
  z-index: 2;
  width: 100%;
  padding: 0 1rem;
  position: absolute;
  overflow: scroll;

  > ul {
    margin-top: 5rem;
    list-style: none;

    > li {
      margin: 2rem 0;

      &:first-of-type {
        margin-top: 0;
      }

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    a {
      flex: 1;
      font-weight: 600;
      letter-spacing: 0.1em;

      &:hover,
      &.active,
      &:focus {
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }

  &.mobileNav-enter {
    transition: transform 0.5s ease-in-out;
    transform: translate(0, -100vh);
  }

  &.mobileNav-leave {
    transition: transform 0.35s ease-in;
    transform: translate(0, 0);
  }

  &.mobileNav-enter-active {
    transform: translate(0, 0);
  }

  &.mobileNav-leave-active {
    transform: translate(0, -100vh);
  }
`

const MobileNavigation = ({ className }) => {
  const [scrollPosition, setScrollPosition] = useState(getScrollOffset())
  const [mobileNavVisible, setMobileNavVisible] = useState(false)

  const toggleMobileNav = e => {
    e.preventDefault()
    setMobileNavVisible(!mobileNavVisible)
  }

  const closeNav = e => {
    setMobileNavVisible(false)
  }

  const onScroll = () => {
    if (!mobileNavVisible) setScrollPosition(getScrollOffset())
    if (mobileNavVisible) scrollTo(scrollPosition)
  }

  const addEventListeners = () => {
    addEventListener('touchmove', onScroll)
    addEventListener('scroll', onScroll)
  }

  const removeEventListeners = () => {
    removeEventListener('touchmove', onScroll)
    removeEventListener('scroll', onScroll)
  }

  useEffect(() => {
    removeEventListeners()
    addEventListeners()

    return () => {
      removeEventListeners()
    }
  }, [mobileNavVisible])

  return (
    <Container className={`text-align-center ${className}`}>
      <Query
        render={items => (
          <Fragment>
            <Link
              href='/'
              onClick={toggleMobileNav}
              className='toggle-menu'
              tracking={{
                label: `mobile_navigation_${mobileNavVisible ? 'close' : 'open'}`
              }}
            >
              {!mobileNavVisible && <MdMenu />}
              {mobileNavVisible && <MdClose />}
            </Link>
            <ReactCSSTransitionGroup
              transitionName='mobileNav'
              transitionEnterTimeout={500}
              transitionLeaveTimeout={350}
            >
              {mobileNavVisible && (
                <Nav key='nav' className='text-transform-uppercase'>
                  <ul>
                    {items.map((item, i) => (
                      <li key={i}>
                        <Link
                          href={item.path}
                          onClick={closeNav}
                          activeClassName='active'
                          tracking={{
                            label: `desktop_navigation_${item.path}`
                          }}
                          title={item.label}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li className='search-input'>
                      <SearchField />
                    </li>
                    <li>
                      <MobilePicker>
                        <PickerContainer />
                      </MobilePicker>
                    </li>
                  </ul>
                </Nav>
              )}
            </ReactCSSTransitionGroup>
          </Fragment>
        )}
      />
    </Container>
  )
}

MobileNavigation.propTypes = {
  className: PropTypes.string
}

export default MobileNavigation
