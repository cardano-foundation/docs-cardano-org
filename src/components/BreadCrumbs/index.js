import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from '../Link'

const BreadCrumbs = ({ crumbs }) => (
  <p>
    {crumbs.map((crumb, index) => (
      <Fragment key={crumb.path}>
        {crumb.active &&
          <span>{crumb.label}</span>
        }
        {!crumb.active &&
          <Link href={crumb.path}>
            {crumb.label}
          </Link>
        }
        {index < crumbs.length - 1 &&
          <span> > </span>
        }
      </Fragment>
    ))}
  </p>
)

BreadCrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    active: PropTypes.bool
  })).isRequired
}

export default BreadCrumbs
