import React, { forwardRef } from 'react'
import Query from './Query'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Link from '../Link'

function getActiveIndex ({ items, path }) {
  let activeIndex = false
  let index = 0
  while (activeIndex === false && index < items.length) {
    const nextItem = items[index]
    const nextItemResolvedPath = `/${nextItem.path.replace(/^\//, '').replace(/\/$/, '').split('/').slice(0, 2).join('/')}/`
    if (nextItemResolvedPath === path || path.substring(0, nextItemResolvedPath.length) === nextItemResolvedPath) activeIndex = index
    index++
  }

  return activeIndex
}

const DesktopNavigation = ({ path }) => (
  <Query
    render={items => (
      <Box maxWidth='100%'>
        <Tabs
          value={getActiveIndex({ items, path })}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='on'
          aria-label='scrollable auto tabs example'
        >
          {items.map(({ label, path }) => (
            <Tab
              label={label}
              aria-controls={`scrollable-auto-tabpanel-${label.toLowerCase().replace(/ /g, '-')}`}
              key={path}
              href={path}
              component={forwardRef((props, ref) => <Link {...props} {...ref} />)}
            />
          ))}
        </Tabs>
      </Box>
    )}
  />
)

DesktopNavigation.propTypes = {
  path: PropTypes.string.isRequired
}

export default () => (
  <Location>
    {({ location }) => (
      <DesktopNavigation path={location.pathname} />
    )}
  </Location>
)
