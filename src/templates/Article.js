import React, { Fragment, useRef, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Location } from '@reach/router'
import Markdown from '@input-output-hk/front-end-core-components/components/Markdown'
import Footer from '@input-output-hk/front-end-site-components/components/Footer'
import Theme from '@input-output-hk/front-end-core-components/components/Theme'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import TinyColor from '@ctrl/tinycolor'
import { FaChevronRight, FaChevronDown, FaEllipsisH, FaChevronUp, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import Link from '@input-output-hk/front-end-core-components/components/Link'
import { FIXED_HEADER_OFFSET } from '../constants'
import GlobalContentQuery from '../queries/GlobalContentQuery'

const PageContent = styled.div`
  display: flex;
  margin-bottom: 12rem;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 6rem;
  }
`

const SideNavigationContainer = styled(Box)`
  padding: 2rem 2rem 2rem 0;
  flex: 1;
  border-right: 0.1rem solid ${({ theme }) => new TinyColor(theme.palette.text.primary).setAlpha(0.2).toString()};
  min-height: ${({ minHeight }) => minHeight / 10 + 4}rem;

  ${({ theme }) => theme.breakpoints.down('md')} {
    flex: 1.4;
  }

  &.position-bottom {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;

    &.position-bottom {
      display: none;
    }
  }
`

const MainContent = styled(Box)`
  padding-left: 4rem;

  &.no-nav {
    padding-left: 0;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-left: 0;
  }
`

const Accordion = styled.div`
  max-height: 0;
  overflow: hidden;

  &.expanded {
    max-height: none;
  }

  > ul {
    padding-top: 0.5rem;
  }
`

const Nav = styled.ul`
  list-style: none;
  margin: 0;
  max-width: ${({ maxWidth }) => maxWidth === null ? 'none' : `${maxWidth / 10}rem`};
  width: 100%;
  
  &.position-top {
    position: static;
  }

  &.position-fixed {
    position: fixed;
    top: ${(FIXED_HEADER_OFFSET + 20) / 10}rem;
  }

  li {
    margin: 1rem 0;

    p {
      font-weight: 600;
    }

    a {
      &.active {
        font-weight: 600;
        letter-spacing: -0.06rem;
      }
    }

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }

    ul {
      margin-left: 1rem;
      padding-left: 1rem;
      border-left: 0.1rem solid ${({ theme }) => new TinyColor(theme.palette.text.primary).setAlpha(0.2).toString()};
    }
  }
`

const AccordionToggle = styled(Link)`
  position: relative;
  padding-right: 2rem;
  display: block;

  &.has-no-content {
    color: ${({ theme }) => theme.palette.text.primary};

    &:hover {
      color: ${({ theme }) => theme.palette.text.primary};
    }
  }

  &.active {
    font-weight: 600;
  }
`

const MarkdownContent = styled.div`
  word-break: break-word;
  max-width: 80rem;
`

const MobileInlineNavigation = styled.div`
  padding: 1rem 0 0 2rem;
  border-left: 0.2rem solid ${({ theme }) => theme.palette.primary.main};
  max-width: 40rem;

  > div {
    max-height: 10rem;
    overflow: hidden;
  }

  &.open > div {
    max-height: none;
    overflow: auto;
  }

  > a {
    display: inline-block;
    margin-top: 1rem;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: none;
  }
`

const ReportAnIssueLink = styled(Link)`
  display: flex;
`

const LastUpdated = styled.div`
  p {
    margin: 0;
  }
`

const ExternalLink = styled(Link)`
  display: inline-block;
`

const NavigationTree = ({ items, lang, path, currentPathname, isRoot = true, position, setPosition, minHeight, setMinHeight, autoScroll = true }) => {
  const rootRef = useRef(null)
  const [ maxWidth, setMaxWidth ] = useState(null)
  const [ expanded, setExpanded ] = useState(getDefaultExpanded())

  function isActive (path) {
    const resolvedPath = lang ? `/${lang}${path}` : path
    if (currentPathname.substring(0, resolvedPath.length) === resolvedPath) return true
    return false
  }

  function getDefaultExpanded () {
    const expanded = {}
    const itemsWithChildren = items.filter(({ children }) => children.length > 0)
    itemsWithChildren.forEach(item => {
      expanded[item.path] = isActive(item.path)
    })

    return expanded
  }

  const updateMinHeight = useCallback(() => {
    const { bottom, top } = rootRef.current.getBoundingClientRect()
    const newMinHeight = Math.abs(top - bottom)
    if (minHeight !== newMinHeight) setMinHeight(newMinHeight)
  }, [ minHeight, rootRef ])

  const updateMaxWidth = useCallback(() => {
    const { left, right } = rootRef.current.parentElement.getBoundingClientRect()
    const newMaxWidth = Math.abs(right - left) - 20
    if (maxWidth !== newMaxWidth) setMaxWidth(newMaxWidth)
  }, [ maxWidth, rootRef ])

  const toggleAccordion = (item) => (e) => {
    if (item.hasContent) return
    e.preventDefault()
    if (isActive(item.path)) return
    setExpanded({
      ...expanded,
      [item.path]: !expanded[item.path]
    })
  }

  const onScroll = useCallback(() => {
    const { top, bottom } = rootRef.current.parentElement.getBoundingClientRect()
    const { bottom: navBottom, top: navTop } = rootRef.current.getBoundingClientRect()
    if (position === 'top' && top <= 0 + FIXED_HEADER_OFFSET) {
      setPosition('fixed')
    } else if (position !== 'top' && top > 0 + FIXED_HEADER_OFFSET) {
      setPosition('top')
    } else if (position !== 'bottom' && navBottom >= bottom - 20) {
      setPosition('bottom')
    } else if (position === 'bottom' && navTop >= 0 + FIXED_HEADER_OFFSET) {
      setPosition('fixed')
    }
  }, [ position, rootRef, minHeight ])

  useEffect(() => {
    if (isRoot && rootRef.current && autoScroll) {
      updateMinHeight()
      updateMaxWidth()
      window.addEventListener('resize', updateMinHeight)
      window.addEventListener('resize', updateMaxWidth)
      window.addEventListener('scroll', onScroll)
      window.addEventListener('touchmove', onScroll)
    }

    return () => {
      if (isRoot && rootRef.current && autoScroll) {
        window.removeEventListener('resize', updateMinHeight)
        window.removeEventListener('resize', updateMaxWidth)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('touchmove', onScroll)
      }
    }
  }, [ isRoot, rootRef, position, expanded, autoScroll ])

  return (
    <Nav key={path} ref={rootRef} className={isRoot ? `position-${position}` : ''} maxWidth={maxWidth}>
      {items.map((item) => (
        <li key={item.path}>
          {item.children.length === 0 && !item.externalHref &&
            <Link
              href={`${item.path}`}
              activeClassName='active'
              title={item.title}
              partiallyActive
            >
              {item.title}
            </Link>
          }
          {item.externalHref &&
            <ExternalLink
              href={`${item.externalHref}`}
              title={item.title}
            >
              <Box display='flex'>
                <Box display='flex' flexDirection='column' justifyContent='center'>
                  {item.title}
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='center' marginLeft={1}>
                  <FaExternalLinkAlt />
                </Box>
              </Box>
            </ExternalLink>
          }
          {item.children.length > 0 && !item.externalHref &&
            <Fragment>
              <AccordionToggle
                href={item.path}
                className={item.hasContent ? '' : 'has-no-content'}
                onClick={toggleAccordion(item)}
                activeClassName='active'
                partiallyActive
              >
                <Box display='flex'>
                  <Box flex={1} justifyContent='center' flexDirection='column' display='flex'>
                    {item.title}
                  </Box>
                  <Box marginLeft={0.8} justifyContent='center' flexDirection='column' display='flex'>
                    {expanded[item.path] ? <FaChevronDown /> : <FaChevronRight />}
                  </Box>
                </Box>
              </AccordionToggle>
              <Accordion className={expanded[item.path] ? 'expanded' : ''}>
                <NavigationTree
                  items={item.children}
                  path={item.path}
                  lang={lang}
                  currentPathname={currentPathname}
                  isRoot={false}
                  position={position}
                  minHeight={minHeight}
                  setMinHeight={setMinHeight}
                  setPosition={setPosition}
                  updateHeight={updateMinHeight}
                />
              </Accordion>
            </Fragment>
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
  path: PropTypes.string.isRequired,
  isRoot: PropTypes.bool,
  position: PropTypes.oneOf([ 'top', 'fixed', 'bottom' ]),
  setPosition: PropTypes.func,
  minHeight: PropTypes.number,
  setMinHeight: PropTypes.func,
  autoScroll: PropTypes.bool
}

const Article = ({ pageContext }) => {
  const [ position, setPosition ] = useState('top')
  const [ minHeight, setMinHeight ] = useState(null)
  const [ mobileTopNavigationOpen, setMobileTopNavigationOpen ] = useState(false)
  const [ mobileBottomNavigationOpen, setMobileBottomNavigationOpen ] = useState(false)

  function getReportIssueHref ({ pathname, query, hash }) {
    const baseHref = 'https://github.com/cardano-foundation/docs-cardano-org/issues/new?assignees=&labels=content&template=content-issue.md&title='
    return `${baseHref}${encodeURIComponent(`Invalid content ${pathname}${query || ''}${hash || ''}`)}`
  }

  return (
    <GlobalContentQuery
      render={(content) => (
        <Fragment>
          <Container maxWidth='xl'>
            <Location>
              {({ location }) => (
                <PageContent>
                  {pageContext.navigationContext.children.length > 0 &&
                    <SideNavigationContainer minHeight={minHeight || 0} className={`position-${position}`}>
                      <NavigationTree
                        lang={pageContext.lang}
                        items={pageContext.navigationContext.children}
                        path={`/${pageContext.navigationContext.key}`}
                        currentPathname={location.pathname}
                        position={position}
                        setPosition={setPosition}
                        minHeight={minHeight}
                        setMinHeight={setMinHeight}
                      />
                    </SideNavigationContainer>
                  }
                  <MainContent className={pageContext.navigationContext.children.length === 0 ? 'no-nav' : ''} flex={4}>
                    {pageContext.navigationContext.children.length > 0 &&
                      <MobileInlineNavigation className={mobileTopNavigationOpen ? 'open' : ''}>
                        <div>
                          <NavigationTree
                            lang={pageContext.lang}
                            items={pageContext.navigationContext.children}
                            path={`/${pageContext.navigationContext.key}`}
                            currentPathname={location.pathname}
                            autoScroll={false}
                          />
                        </div>
                        <Link
                          href='#'
                          onClick={(e) => {
                            e.preventDefault()
                            setMobileTopNavigationOpen(!mobileTopNavigationOpen)
                          }}
                        >
                          {mobileTopNavigationOpen && <FaChevronUp />}
                          {!mobileTopNavigationOpen && <FaEllipsisH />}
                        </Link>
                      </MobileInlineNavigation>
                    }
                    <MarkdownContent>
                      <Markdown source={pageContext.content} />
                    </MarkdownContent>
                    <Box marginTop={2} marginBottom={2}>
                      {pageContext.lastUpdated &&
                        <LastUpdated>
                          <p><small><em>{content.last_updated}: {pageContext.lastUpdated}</em></small></p>
                        </LastUpdated>
                      }
                      <Box display='flex'>
                        <ReportAnIssueLink
                          href={getReportIssueHref(location)}
                        >
                          <Box display='flex' marginRight={1} flexDirection='column' justifyContent='center'>
                            <FaGithub />
                          </Box>
                          <Box display='flex' flexDirection='column' justifyContent='center'>
                            <p>{content.report_an_issue}</p>
                          </Box>
                        </ReportAnIssueLink>
                      </Box>
                    </Box>
                    {pageContext.navigationContext.children.length > 0 &&
                      <MobileInlineNavigation className={mobileBottomNavigationOpen ? 'open' : ''}>
                        <div>
                          <NavigationTree
                            lang={pageContext.lang}
                            items={pageContext.navigationContext.children}
                            path={`/${pageContext.navigationContext.key}`}
                            currentPathname={location.pathname}
                            autoScroll={false}
                          />
                        </div>
                        <Link
                          href='#'
                          onClick={(e) => {
                            e.preventDefault()
                            setMobileBottomNavigationOpen(!mobileBottomNavigationOpen)
                          }}
                        >
                          {mobileBottomNavigationOpen && <FaChevronUp />}
                          {!mobileBottomNavigationOpen && <FaEllipsisH />}
                        </Link>
                      </MobileInlineNavigation>
                    }
                  </MainContent>
                </PageContent>
              )}
            </Location>
            <Theme.Consumer>
              {({ theme }) => (
                <Footer theme={theme.palette.type} variant='cardano' />
              )}
            </Theme.Consumer>
          </Container>
        </Fragment>
      )}
    />
  )
}

Article.propTypes = {
  pageContext: PropTypes.shape({
    content: PropTypes.string.isRequired,
    navigationContext: PropTypes.object.isRequired,
    lastUpdated: PropTypes.string,
    lang: PropTypes.string.isRequired
  }).isRequired
}

export default Article
