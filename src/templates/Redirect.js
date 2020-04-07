import React, { useEffect } from 'react'
import { navigate } from 'gatsby'
import PropTypes from 'prop-types'
import { isRelative, setHref } from '../helpers/url'
import Layout from '../components/Layout'

const Redirect = ({ pageContext }) => {
  useEffect(() => {
    console.log('rendering redirect')
    if (isRelative(pageContext.to)) {
      setTimeout(() => navigate(pageContext.to), 600)
    } else {
      setHref(pageContext.to)
    }
  }, [])

  return (
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
      <p>Redirecting ...</p>
    </Layout>
  )
}

Redirect.propTypes = {
  pageContext: PropTypes.shape({
    to: PropTypes.string.isRequired
  }).isRequired
}

export default Redirect
