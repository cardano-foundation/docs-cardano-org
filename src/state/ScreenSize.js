import React, { useState, useEffect, createContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { addEventListener, removeEventListener, getInnerWidth } from '../helpers/dom'

const ScreenSizeContext = createContext()
const Consumer = ScreenSizeContext.Consumer

const Provider = ({ children, screenSizes }) => {
  const getSortedScreenSizes = () => {
    const sizes = Object.values(screenSizes)
    const sortedSizes = sizes.slice()
    sortedSizes.sort()
    const keys = Object.keys(screenSizes)
    const screenSizesReversed = {}
    sortedSizes.forEach(size => {
      screenSizesReversed[size] = keys[sizes.indexOf(size)]
    })

    return screenSizesReversed
  }

  const sortedScreenSizes = getSortedScreenSizes()
  const [ screenSize, setScreenSize ] = useState(null)
  const getWidth = () => {
    let width
    const innerWidth = getInnerWidth()
    const sizes = Object.keys(sortedScreenSizes).reverse()
    while (!width && sizes.length > 0) {
      const size = sizes.shift()
      if (innerWidth >= size) width = sortedScreenSizes[size]
      if (sizes.length === 0 && innerWidth && innerWidth < size) width = -1
    }

    return width || Object.values(sortedScreenSizes).pop()
  }

  const onResize = useCallback(() => {
    const width = getWidth()
    if (screenSize !== width) setScreenSize(width)
  }, [ setScreenSize, screenSize, sortedScreenSizes ])

  useEffect(() => {
    if (screenSize === null) onResize()
    removeEventListener('resize', onResize)
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [ screenSize, setScreenSize, sortedScreenSizes ])

  const getScreenSizes = () => {
    const sizes = { '-1': -1 }
    Object.values(sortedScreenSizes).forEach((size, index) => {
      sizes[size] = index
    })

    return sizes
  }

  return (
    <ScreenSizeContext.Provider value={{
      screenSize: getScreenSizes()[screenSize || Object.values(sortedScreenSizes).pop()],
      screenSizes: getScreenSizes()
    }}>
      {children}
    </ScreenSizeContext.Provider>
  )
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
  screenSizes: PropTypes.object
}

export {
  Consumer,
  Provider
}
