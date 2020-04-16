import React from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Layout from '../components/Layout'
import IndexPageQuery from '../queries/IndexPageQuery'

export default () => (
  <IndexPageQuery
    render={(content) => (
      <Layout>
        <Container maxWidth='xl'>
          <Box marginTop={6} marginBottom={10}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p>{content.default_content}</p>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Layout>
    )}
  />
)
