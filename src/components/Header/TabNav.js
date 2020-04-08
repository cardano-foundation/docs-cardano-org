/* eslint-disable */
import React, { useState, Fragment, forwardRef, createRef } from 'react'
import styled from 'styled-components'
import Query from './Query'
import Link from '../Link'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'


function isActive(path, currentPathname) {
  let rootPath = path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .split('/').slice(0, 2).join('/')

  rootPath = `/${rootPath}/`
  return currentPathname.substring(0, rootPath.length) === rootPath
}

function getPath(path) {
  let rootPath = path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .split('/').slice(0, 2).join('/')

  rootPath = `/${rootPath}/`
  return rootPath
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${labelTransform(index)}`,
    'aria-controls': `scrollable-auto-tabpanel-${labelTransform(index)}`,
  };
}

function labelTransform(label) {
  return label.toLowerCase().replace(/ /g, '-')
}

const RenderTab = tabItemData => {
  const ref = createRef()

  const TabLink = forwardRef((props, ref) => <Link {...props} {...ref}/> )

  return (
    <Tab 
      label={tabItemData.label} 
      {...a11yProps(tabItemData.label)} 
      key={tabItemData.path} 
      href={tabItemData.path} 
      component={TabLink} 
      className={isActive(tabItemData.path, location.pathname) ? 'active' : ''}
      value={getPath(tabItemData.path)}
    />
  )
}

const TabNav = ({ tabItems, selectedTab, onChange }) => {

  return (
    <Fragment>
      <AppBar 
        position='static' 
        color='default'
        component='div'
      >
        <Tabs
          value={selectedTab}
          onChange={onChange}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='on'
          aria-label='scrollable auto tabs example'
        >
          {tabItems.map(RenderTab)}
        </Tabs>
      </AppBar>
    </Fragment>
  )
}

TabNav.propTypes = {
  className: PropTypes.string
}

export default TabNav
