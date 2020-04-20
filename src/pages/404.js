import React from 'react'
import styled from 'styled-components'
import Markdown from '@input-output-hk/front-end-core-components/components/Markdown'
import Container from '../components/Container'
import Layout from '../components/Layout'
import NotFoundPageQuery from '../queries/NotFoundPageQuery'

const Wrapper = styled.div`
  text-align: center;
  padding: 4rem 0;
`

export default () => (
  <NotFoundPageQuery
    render={(content) => (
      <Layout>
        <Container>
          <Wrapper>
            <h1>{content.title}</h1>
            <Markdown source={content.body_content} />
          </Wrapper>
        </Container>
      </Layout>
    )}
  />
)
