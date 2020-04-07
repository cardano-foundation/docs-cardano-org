import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import DesktopNavigation from '../components/Header/DesktopNavigation'
import FullWidthSection from '../components/FullWidthSection'
import Button from '../components/Button'
import styled from 'styled-components'
import { LanguageConsumer } from '../state'

const HeadingWrap = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.subtleAccent};
`

const NavWrap = styled.div`
width:100%;
  display: flex;
  align-items: center;
  flex-direction:column;
  h1 {
    margin: 3rem 0;
  }
  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    flex-flow: wrap;
    > div {
      display: none;
    }
  }
`

const Title = styled.div`
  width:100%;
  h1 {
    span {
      margin: 0 0.4rem;
      position: relative;
    }
  }
  margin: 0;
  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    flex: 1 100%;
  }
`

const PageContent = styled.div`
  padding: 3rem 0;
  ${({ theme }) => theme.colors.secondaryText};
`

const HomepageSection = styled.section`
  max-width:90vw;
  width:120rem;
  margin:0 auto;
`

const HeroSection = styled.section`
  * {
    margin: 0;
  }
  max-width:90vw;
  width:60rem;
  margin:0 auto;
  h2 {
    padding-top:8rem;
  }
  span {
    display: inline-block;
    margin: 4rem 0;
  }
`

const CTASection = styled.div`
  display:flex;
  align-content: center;
  justify-content: space-between;
  @media screen and (max-width: ${({ theme }) => theme.dimensions.screenSizes.small}px) {
    flex-direction:column;
  }
  a {
    display:block
  }
`

const Query = ({ render }) => (
  <LanguageConsumer>
    {({ lang }) => (
      <StaticQuery
        query={graphql`
          query {
            allFile(filter:{relativePath:{glob:"content/pages/home/*.md"}}) {
              nodes {
                relativePath
                childMarkdownRemark {
                  html
                  frontmatter {
                    content {
                      title
                      description
                      subtitle
                      hero {
                        cta
                        link
                      }
                      callOutOne {
                        cta
                        link
                      }
                      callOutTwo {
                        cta
                        link
                      }
                      callOutThree {
                        cta
                        link
                      }
                    }
                  }
                }
              }
            }
          }
        `}
        render={({ allFile }) => {
          const content = allFile.nodes.filter(node => node.relativePath === `content/pages/home/home-${lang}.md`).shift()
          if (!content) throw new Error(`No content found for Home page using language ${lang}`)
          return render(content.childMarkdownRemark)
        }}
      />
    )}
  </LanguageConsumer>
)

Query.propTypes = {
  render: PropTypes.func.isRequired
}

export default () => (
  <Fragment>
    <Query
      render={({ frontmatter, html }) => (
        <Fragment>
          <HeadingWrap>
            <FullWidthSection>
              <NavWrap>
                <Title>
                  <h1>
                    <span data-text={frontmatter.content.title.toUpperCase()}>{frontmatter.content.title.toUpperCase()}</span>
                  </h1>
                </Title>
                <DesktopNavigation />
              </NavWrap>
            </FullWidthSection>
          </HeadingWrap>
          <FullWidthSection>
            <HomepageSection>
              <HeroSection>
                <h2>{frontmatter.content.hero.cta}</h2>
                <Button size='large' href='/'>Explore the network</Button>
              </HeroSection>
              <PageContent dangerouslySetInnerHTML={{ __html: html }} />
              <CTASection>
                <a href={frontmatter.content.callOutOne.link}>
                  <h3>{frontmatter.content.callOutOne.cta}</h3>
                </a>
                <a href={frontmatter.content.callOutTwo.link}>
                  <h3>{frontmatter.content.callOutTwo.cta}</h3>
                </a>
                <a href={frontmatter.content.callOutThree.link}>
                  <h3>{frontmatter.content.callOutThree.cta}</h3>
                </a>
              </CTASection>
            </HomepageSection>
          </FullWidthSection>
        </Fragment>
      )}
    />
  </Fragment>
)
