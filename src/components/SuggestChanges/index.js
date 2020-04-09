import React from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { FaGithub } from 'react-icons/fa'
import Link from '../Link'

const CONTENT_ISSUE_HREF = 'https://github.com/cardano-foundation/docs-cardano-org/issues/new?assignees=&labels=content&template=content-issue.md&title='

const SuggestChanges = ({ pathname, query = '', hash = '' }) => (
  <Link href={`${CONTENT_ISSUE_HREF}${encodeURIComponent(`Invalid content ${pathname}${query}${hash}`)}`}>
    Report an issue <FaGithub />
  </Link>
)

SuggestChanges.propTypes = {
  pathname: PropTypes.string,
  query: PropTypes.string,
  hash: PropTypes.string
}

export default () => (
  <Location>
    {({ location }) => (
      <SuggestChanges {...location} />
    )}
  </Location>
)
