import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Layout from '../components/Layout'
import styled, { keyframes, css } from 'styled-components'
import { LanguageConsumer } from '../state'

function generateRandomDimension () {
  return `${Math.round(Math.random() * 150) / 10}rem`
}

function generateGlitchKeyframes (n) {
  let frames = []
  for (let i = 0; i <= n; i++) {
    const frame = css`${i / n * 100}% { clip: rect(${generateRandomDimension()}, 999.9rem, ${generateRandomDimension()}, 0); }`
    frames = [ ...frames, frame ]
  }

  return frames
}

const GlitchPrimary = keyframes`
  ${generateGlitchKeyframes(30)}
`

const GlitchSecondary = keyframes`
  ${generateGlitchKeyframes(12)}
`

const Info = styled.p`
  ${({ theme }) => theme.colors.secondaryText};
`

const Blink = keyframes`
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  60% {
    opacity: 1;
  }

  80% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
`

const Title = styled.div`
  h1 {
    span {
      margin: 0 0.4rem;
      position: relative;

      &.blink {
        animation: ${Blink} 1s linear infinite;
      }

      &.glitch {
        &:before,
        &:after {
          content: attr(data-text);
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        &:before {
          left: 0.2rem;
          text-shadow: -0.2rem 0 red;
          clip: rect(2.4rem, 55rem, 9rem, 0);
          animation: ${GlitchPrimary} 3s infinite linear alternate-reverse;
        }

        &:after {
          left: -0.2.rem;
          text-shadow: -0.2rem 0 blue;
          clip: rect(8.5rem, 55rem, 14rem, 0);
          animation: ${GlitchSecondary} 2.5s infinite linear alternate-reverse;
        }
      }
    }
  }
`

const Query = ({ render }) => (
  <LanguageConsumer>
    {({ lang }) => (
      <StaticQuery
        query={graphql`
          query {
            allFile(filter:{relativePath:{glob:"content/pages/404/*.md"}}) {
              nodes {
                relativePath
                childMarkdownRemark {
                  frontmatter {
                    content {
                      title
                      description
                      subtitle
                    }
                  }
                }
              }
            }
          }
        `}
        render={({ allFile }) => {
          const content = allFile.nodes.filter(node => node.relativePath === `content/pages/404/404-${lang}.md`).shift()
          if (!content) throw new Error(`No content found for 404 page using language ${lang}`)
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
  <Layout
    headData={{
      meta: [
        {
          name: 'robots',
          content: 'noindex,nofollow'
        }
      ]
    }}
  >
    <Query
      render={({ frontmatter }) => (
        <Fragment>
          <Title className='text-align-center'>
            <h1>
              <span className='glitch' data-text={frontmatter.content.title.toUpperCase()}>{frontmatter.content.title.toUpperCase()}</span>
              <span className='blink'> _ </span>
              <span className='glitch' data-text='404'>404</span>
            </h1>
            <h2>{frontmatter.content.subtitle}</h2>
          </Title>
          <Info>
            {frontmatter.content.description}
          </Info>
        </Fragment>
      )}
    />
  </Layout>
)
