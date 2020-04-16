import React from 'react'
import Container from '@material-ui/core/Container'
import Layout from '../components/Layout'
import NotFoundPageQuery from '../queries/NotFoundPageQuery'

export default () => (
  <NotFoundPageQuery
    render={(content) => (
      <Layout>
        <Container maxWidth='lg'>
          <h1>{content.title}</h1>
        </Container>
      </Layout>
    )}
  />
)
