import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { Location } from '@reach/router'
import { analytics } from '@input-output-hk/front-end-core-libraries'

const AdminRedirector = ({ hash }) => {
  function adminRedirect () {
    const hashParams = hash.replace(/^#\/?/, '').split('&').map(p => p.split('='))
    const tokenParams = [ 'invite_token', 'access_token' ]
    const hasToken = hashParams.filter(p => tokenParams.includes(p[0])).length > 0
    if (hasToken) {
      analytics.autoCapture({ category: analytics.constants.REDIRECT, action: 'redirect_to_admin' })
      navigate(`/admin/${hash}`)
    }
  }

  useEffect(() => {
    adminRedirect()
  }, [])

  return null
}

AdminRedirector.propTypes = {
  hash: PropTypes.string.isRequired
}

const Root = ({ element }) => (
  <Location>
    {({ location }) => (
      <Fragment>
        <AdminRedirector hash={location.hash || ''} />
        {element}
      </Fragment>
    )}
  </Location>
)

Root.propTypes = {
  element: PropTypes.node.isRequired
}

export default Root
