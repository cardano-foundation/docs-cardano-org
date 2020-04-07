import React, { Fragment, useEffect } from 'react'
import './bootstrap'
import PropTypes from 'prop-types'
import parseURL from 'url-parse'
import { getHref, setHref } from './helpers/url'
import { autoCapture } from './helpers/analytics'
import { REDIRECT } from './constants/analytics'

function adminRedirect () {
  const { protocol, slashes, host, hash } = parseURL(getHref())
  const hashParams = hash.replace(/^#\/?/, '').split('&').map(p => p.split('='))
  const tokenParams = [ 'invite_token', 'access_token' ]
  const hasToken = hashParams.filter(p => tokenParams.includes(p[0])).length > 0
  if (hasToken) {
    autoCapture({ category: REDIRECT, action: 'redirect_to_admin' })
    setHref(`${protocol}${slashes && '//'}${host}/admin/${hash}`)
  }
}

const AdminRedirector = () => {
  useEffect(() => {
    adminRedirect()
  }, [])

  return null
}

const Root = ({ element }) => (
  <Fragment>
    <AdminRedirector />
    {element}
  </Fragment>
)

Root.propTypes = {
  element: PropTypes.node.isRequired
}

export default Root
