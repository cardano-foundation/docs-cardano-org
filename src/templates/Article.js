import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { LanguageConsumer } from '../state'
import Markdown from '../components/Markdown'
import FullWidthSection from '../components/FullWidthSection'
import SideNav from '../components/SideNav'
import PageTitle from '../components/PageTitle'
import { SearchField } from '../components/Search'
import { navigate } from 'gatsby'

const NavCol = styled.nav`
  @media(min-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    border-right: 1px solid ${({ theme }) => theme.colors.subtleAccent};
  }
  flex: 1;
`
const ContentCol = styled.article`
  flex: 3;
  padding: 4rem;
`

const ContentWrap = styled.main`
  display: flex;
  @media(max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    flex-direction: column-reverse;
  }
`

const SearchWrap = styled.aside`
  padding: 4rem 3rem 3rem 0;
  @media(max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    display:flex;
    justify-content:center;
    padding:3rem 0;
  }
`

const Article = ({ pageContext }) => {
  console.log('Article', pageContext)

  const onSubmit = (lang) => (value) => {
    navigate(`/${lang}/search/?query=${encodeURIComponent(value)}`)
  }

  return (
    <LanguageConsumer>
      {({ lang }) => (
        <Fragment>
          <PageTitle title={pageContext.navigationContext.title} />
          <FullWidthSection>
            <ContentWrap>
              {pageContext.navigationContext.children.length > 0 &&
                <NavCol>
                  <SearchWrap className='search-input'>
                    <SearchField onSubmit={onSubmit(lang)} lang={lang} />
                  </SearchWrap>
                  <SideNav items={pageContext.navigationContext.children} path={`/${pageContext.navigationContext.key}`} />
                </NavCol>
              }
              <ContentCol>
                <Markdown source={pageContext.content} />
              </ContentCol>
            </ContentWrap>
          </FullWidthSection>
        </Fragment>
      )}
    </LanguageConsumer>
  )
}

Article.propTypes = {
  pageContext: PropTypes.shape({
    content: PropTypes.string.isRequired,
    navigationContext: PropTypes.object.isRequired
  }).isRequired
}

export default Article
