import React, { forwardRef } from 'react'
import Query from './Query'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Link from '../Link'

const DesktopNavigation = ({ path }) => (
  <Query
    render={items => (
      <Box maxWidth='100vw'>
        <Tabs
          value={items.filter(item => item.path === path).shift() ? path : false}
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
              value={path}
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
