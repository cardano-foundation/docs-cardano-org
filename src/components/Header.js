import React, { Fragment, useState, forwardRef, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Link from '@input-output-hk/front-end-core-components/components/Link'
import { Location } from '@reach/router'
import TinyColor from '@ctrl/tinycolor'
import { MdMenu, MdClose, MdSearch } from 'react-icons/md'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import SearchField from './SearchField'
import SelectLanguage from './SelectLanguage'
import CardanoLogo from '../../resources/images/cardano-logo.svg'
import GlobalContentQuery from '../queries/GlobalContentQuery'
import { APP_BAR_OFFSET, NAV_OFFSET } from '../constants'

const Bar = styled(AppBar)`
  background-color: ${({ theme }) => new TinyColor(theme.palette.background.default).lighten(5).toString()};
  color: ${({ theme }) => theme.palette.text.primary};

  a,
  a:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`

const MobileSearchBar = styled.div`
  position: fixed;
  top: 5.2rem;
  z-index: 10;
  padding: 1.6rem 0 0.8rem;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.palette.background.default};
  transform: translate(0, 0);
  transition: transform 0.3s ease-in-out;

  &.mobile-search-bar-enter {
    transform: translate(0, -100%);
  }

  &.mobile-search-bar-enter-active {
    transform: translate(0, 0);
  }

  &.mobile-search-bar-exit {
    transform: translate(0, 0);
  }

  &.mobile-search-bar-exit-active {
    transform: translate(0, -100%);
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: none;
  }
`

const Column = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Logo = styled(Column)`
  img {
    width: 4rem;
  }

  a {
    display: flex;
  }
`

const MobileLogo = styled(Column)`
  padding-top: 4rem;
  padding-bottom: 4rem;

  img {
    width: 6rem;
  }

  a {
    display: flex;
    justify-content: center;
  }

  ${({ theme }) => theme.breakpoints.down('xs')} {
    padding-top: 0;
    padding-bottom: 1rem;

    a {
      flex-direction: column;
      text-align: center;
    }

    img {
      display: block;
      margin: 0 auto 2rem;
    }
  }
`

const SiteTitle = styled(Column)`
  ${({ theme }) => theme.breakpoints.down('xs')} {
    display: none;
  }
`

const MobileSiteTitle = styled(Column)`
  font-size: 180%;

  ${({ theme }) => theme.breakpoints.down('xs')} {
    font-size: 140%;
  }
`

const SearchFieldContainer = styled(Column)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

const MobileNavContainer = styled(Column)`
  font-size: 160%;


  a {
    display: flex;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: none;
  }
`

const MobileSearchIconContainer = styled(Column)`
  font-size: 160%;


  a {
    display: flex;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: none;
  }
`

const BarOffset = styled.div`
  margin-top: ${APP_BAR_OFFSET / 10}rem;
`

const NavigationFixedCompensator = styled.div`
  &.active {
    display: block;
    height: ${NAV_OFFSET / 10}rem;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;

    &.active {
      display: none;
    }
  }
`

const TabsContainer = styled(Box)`
  .MuiTabs-root {
    .MuiTabs-scrollButtons {
      &:not([aria-disabled="false"]) {
        position: relative;

        &:after {
          content: '<';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%) scaleX(0.5);
          font-weight: 900;
          opacity: 0.42;
        }
      }

      &:last-of-type {
        &:not([aria-disabled="false"]) {
          &:after {
            content: '>';
          }
        }
      }
    }

    .MuiTabs-flexContainer {
      a {
        padding-left: 0;
        padding-right: 0;
        margin-left: 1.2rem;
        margin-right: 1.2rem;
        min-width: 0;

        &:first-of-type {
          margin-left: 0;
        }

        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
`

const PageTitleContainer = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.default};
  z-index: 7;

  h1 {
    margin: 0;
    padding: 1.8rem 0
  }
`

const Navigation = styled.nav`
  border-bottom: 0.1rem solid ${({ theme }) => new TinyColor(theme.palette.text.primary).setAlpha(0.2).toString()};
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.default};
  z-index: 7;

  &.position-fixed {
    margin-top: ${APP_BAR_OFFSET / 10}rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

const MobileMenu = styled.div`
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => new TinyColor(theme.palette.background.default).lighten(5).toString()};
  transform: translate(0, 0);
  transition: transform 0.4s ease-in-out;
  overflow: hidden;

  &.mobile-menu-enter {
    transform: translate(0, -100%);
  }

  &.mobile-menu-enter-active {
    transform: translate(0, 0);
  }

  &.mobile-menu-exit {
    transform: translate(0, 0);
  }

  &.mobile-menu-exit-active {
    transform: translate(0, -100%);
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: none;
  }
`

const MobileMenuInner = styled.div`
  position: absolute;
  top: 8rem;
  left: 0;
  right: 0;
  bottom: 2rem;
`

const MobileMenuScrollContainer = styled.div`
  padding: 0 2rem 2rem;
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  a,
  a:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  ul {
    margin-top: 2rem;
    list-style: none;
    width: 100%;
    text-align: center;
    font-size: 140%;

    li {
      margin: 1.75rem 0;

      a {
        padding-bottom: 0.5rem;
      }

      &.active {
        a {
          border-bottom: 0.1rem solid ${({ theme }) => theme.palette.text.primary};
        }
      }

      &:first-of-type {
        margin-top: 0;
        padding-top: 0;
      }

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }

  ${({ theme }) => theme.breakpoints.down('xs')} {
    ul {
      font-size: 100%;
    }
  }
`

export default () => {
  const navigationRef = useRef(null)
  const mobileSearchBarRef = useRef(null)
  const rootRef = useRef(null)
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)
  const [ mobileSearchBarOpen, setMobileSearchBarOpen ] = useState(false)
  const [ navigationPosition, setNavigationPosition ] = useState('static')

  const toggleMobileMenu = (e) => {
    e.preventDefault()
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleMobileSearchBar = (e) => {
    e.preventDefault()
    setMobileSearchBarOpen(!mobileSearchBarOpen)
  }

  const bodyClickHandler = useCallback((event) => {
    const mobileSearchBarEl = mobileSearchBarRef.current
    if (!mobileSearchBarEl) return
    const { bottom } = mobileSearchBarEl.getBoundingClientRect()
    if (event.clientY > bottom) setMobileSearchBarOpen(false)
  }, [ mobileSearchBarRef ])

  const onScroll = useCallback(() => {
    if (!navigationRef.current) return
    const { bottom: parentBottom } = navigationRef.current.parentElement.getBoundingClientRect()
    const { top } = navigationRef.current.getBoundingClientRect()
    if (navigationPosition === 'static' && top <= 0 + APP_BAR_OFFSET) {
      setNavigationPosition('fixed')
    } else if (top <= parentBottom) {
      setNavigationPosition('static')
    }
  }, [ navigationRef, navigationPosition ])

  /**
   * All of this is for accessibility to ensure when the mobile menu is open that
   * only the header and mobile menu elements can be focussed
   */
  const onKeyDown = useCallback((e) => {
    const mobileMenu = rootRef.current && rootRef.current.querySelector('#mobile-menu')
    if (e.keyCode === 9 && window.getComputedStyle(mobileMenu).display !== 'none') {
      const filteredInteractibleElements = []
      rootRef.current.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select').forEach(el => {
        if (el.offsetParent !== null) filteredInteractibleElements.push(el)
      })

      const firstElement = filteredInteractibleElements[0]
      const lastElement = filteredInteractibleElements[filteredInteractibleElements.length - 1]

      if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus()
        return e.preventDefault()
      }

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    }
  }, [ rootRef ])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    window.addEventListener('touchmove', onScroll)
    if (mobileSearchBarOpen) window.document.body.addEventListener('click', bodyClickHandler)
    if (mobileMenuOpen) window.addEventListener('keydown', onKeyDown)
    return () => {
      window.document.body.removeEventListener('click', bodyClickHandler)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchmove', onScroll)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [ mobileSearchBarOpen, mobileSearchBarRef, navigationRef, navigationPosition, mobileMenuOpen, rootRef ])

  function getActiveIndex ({ navigation, path }) {
    let activeIndex = false
    let index = 0
    while (activeIndex === false && index < navigation.length) {
      const nextItem = navigation[index]
      const nextItemResolvedPath = `/${nextItem.path.replace(/^\//, '').replace(/\/$/, '').split('/').slice(0, 2).join('/')}/`
      if (nextItemResolvedPath === path || path.substring(0, nextItemResolvedPath.length) === nextItemResolvedPath) activeIndex = index
      index++
    }

    return activeIndex
  }

  function renderMobileNavLinks (navigation, path) {
    const activeIndex = getActiveIndex({ navigation, path })
    return (
      <ul>
        {navigation.map(({ label, path }, index) => (
          <li key={path} className={activeIndex === index ? 'active' : ''}>
            <Link tracking={{ category: 'mobile_navigation', label: path }} onClick={() => setMobileMenuOpen(false)} href={path}>{label}</Link>
          </li>
        ))}
      </ul>
    )
  }

  function renderPageTitle (navigation, path) {
    const activeIndex = getActiveIndex({ navigation, path })
    if (activeIndex === false || !navigation[activeIndex]) return null
    return (
      <PageTitleContainer>
        <Container maxWidth='xl'>
          <Box paddingTop={1}>
            <h1>{navigation[activeIndex].label}</h1>
          </Box>
        </Container>
      </PageTitleContainer>
    )
  }

  return (
    <GlobalContentQuery
      render={(content, navigation) => (
        <div ref={rootRef}>
          <Bar position='fixed'>
            <Container maxWidth='xl'>
              <Box paddingTop={0.8} paddingBottom={0.8} display='flex'>
                <Box display='flex'>
                  <Logo>
                    <Link href='/' aria-label={content.main_title_aria_label} tracking={{ label: 'header_cardano_logo' }}>
                      <Column>
                        <img alt='Cardano Logo' aria-hidden='true' src={CardanoLogo} />
                      </Column>
                      <SiteTitle marginLeft={1}>
                        <span>{content.main_title}</span>
                      </SiteTitle>
                    </Link>
                  </Logo>
                </Box>
                <Box flex={1} display='flex' justifyContent='flex-end'>
                  <SearchFieldContainer marginRight={2}>
                    <SearchField />
                  </SearchFieldContainer>
                  <Column>
                    <SelectLanguage />
                  </Column>
                  <MobileSearchIconContainer>
                    <Link
                      href='#'
                      tracking={{ label: 'header_toggle_mobile_search_bar' }}
                      onClick={toggleMobileSearchBar}
                      aria-expanded={mobileSearchBarOpen}
                      aria-controls='mobile-search-bar'
                      aria-label={mobileSearchBarOpen ? 'Close search bar' : 'Open search bar'}
                    >
                      <MdSearch />
                    </Link>
                  </MobileSearchIconContainer>
                  <MobileNavContainer marginLeft={1}>
                    <Link
                      href='#'
                      tracking={{ label: 'header_toggle_mobile_menu' }}
                      onClick={toggleMobileMenu}
                      aria-expanded={mobileMenuOpen}
                      aria-controls='mobile-search-menu'
                      aria-label={mobileMenuOpen ? 'Close main navigation menu' : 'Open main navigation'}
                    >
                      {mobileMenuOpen && <MdClose />}
                      {!mobileMenuOpen && <MdMenu />}
                    </Link>
                  </MobileNavContainer>
                </Box>
              </Box>
            </Container>
          </Bar>
          <TransitionGroup>
            {mobileSearchBarOpen &&
              <CSSTransition
                key='mobile-search-bar'
                timeout={300}
                classNames='mobile-search-bar'
              >
                <MobileSearchBar
                  ref={mobileSearchBarRef}
                  aria-labelledby='mobile-search-bar'
                  ariaLabel='Search bar'
                >
                  <Container maxWidth='xs'>
                    <SearchField onSearch={() => setMobileSearchBarOpen(false)} />
                  </Container>
                </MobileSearchBar>
              </CSSTransition>
            }
          </TransitionGroup>
          <BarOffset />
          <Location>
            {({ location }) => (
              <Fragment>
                {renderPageTitle(navigation, location.pathname)}
                <div>
                  <Navigation className={`position-${!renderPageTitle(navigation, location.pathname) ? 'fixed' : navigationPosition}`} ref={navigationRef} aria-label='Main'>
                    <Container maxWidth='xl'>
                      <Box>
                        <TabsContainer maxWidth='100%'>
                          <Tabs
                            value={getActiveIndex({ navigation, path: location.pathname })}
                            indicatorColor='primary'
                            textColor='primary'
                            variant='scrollable'
                            scrollButtons='auto'
                          >
                            {navigation.map(({ label, path }) => (
                              <Tab
                                label={label}
                                key={path}
                                href={path}
                                tracking={{ category: 'tabs_navigation', label: path }}
                                component={forwardRef((props, ref) => <Link {...props} {...ref} />)}
                                aria-label={label}
                              />
                            ))}
                          </Tabs>
                        </TabsContainer>
                      </Box>
                    </Container>
                  </Navigation>
                </div>
                <NavigationFixedCompensator
                  className={`${!renderPageTitle(navigation, location.pathname) ? 'active' : navigationPosition === 'fixed' ? 'active' : ''}`}
                />
                <TransitionGroup>
                  {mobileMenuOpen &&
                    <CSSTransition
                      key='mobile-menu'
                      timeout={400}
                      classNames='mobile-menu'
                    >
                      <MobileMenu
                        aria-labelledby='mobile-search-menu'
                        ariaLabel='Main menu'
                        role='dialog'
                        id='mobile-menu'
                      >
                        <MobileMenuInner>
                          <MobileMenuScrollContainer>
                            <MobileLogo>
                              <Link href='/' aria-label={content.main_title_aria_label} tracking={{ label: 'header_close_mobile_menu' }} onClick={() => setMobileMenuOpen(false)}>
                                <Column>
                                  <img alt='Cardano Logo' aria-hidden='true' src={CardanoLogo} />
                                </Column>
                                <MobileSiteTitle marginLeft={1}>
                                  <span>{content.main_title}</span>
                                </MobileSiteTitle>
                              </Link>
                            </MobileLogo>
                            {renderMobileNavLinks(navigation, location.pathname)}
                          </MobileMenuScrollContainer>
                        </MobileMenuInner>
                      </MobileMenu>
                    </CSSTransition>
                  }
                </TransitionGroup>
              </Fragment>
            )}
          </Location>
        </div>
      )}
    />
  )
}
