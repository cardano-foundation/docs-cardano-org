import React, { useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import Language from '@input-output-hk/front-end-core-components/components/Language'
import NotFoundPage from '../pages/404'

const FallbackPage = ({ routePath, path, lang }) => {
  const [ missingParams, setMissingParams ] = useState(false)

  useEffect(() => {
    const pattern = new RegExp(`^(/${lang})?${routePath.replace(/:[^/]+/g, '[^/]+')}`)
    if (!path.match(pattern)) {
      setMissingParams(true)
    } else {
      setMissingParams(false)
    }
  }, [ path ])

  return (
    <Fragment>
      {missingParams &&
        <NotFoundPage />
      }
    </Fragment>
  )
}

FallbackPage.propTypes = {
  routePath: PropTypes.string.isRequired,
  path: PropTypes.string,
  lang: PropTypes.string.isRequired
}

const Fallback = ({ pageContext: { routePath } }) => (
  <Language.Consumer>
    {({ key: lang }) => (
      <Location>
        {({ location }) => (
          <FallbackPage routePath={routePath} path={location.pathname} lang={lang} />
        )}
      </Location>
    )}
  </Language.Consumer>
)

Fallback.propTypes = {
  pageContext: PropTypes.shape({
    routePath: PropTypes.string.isRequired
  }).isRequired
}

export default Fallback
