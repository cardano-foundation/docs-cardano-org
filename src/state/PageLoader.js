import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { autoCapture } from '../helpers/analytics'
import { LOADING } from '../constants/analytics'

const PageLoaderContext = createContext()
const Consumer = PageLoaderContext.Consumer

let isPageLoading = false

let subscribers = []
function setPageLoading (loading) {
  isPageLoading = loading
  subscribers.map((s) => s(isPageLoading))
}

function subscribe (cb) {
  unsubscribe(cb)
  subscribers.push(cb)
  cb(isPageLoading)
}

function unsubscribe (cb) {
  const index = subscribers.indexOf(cb)
  if (index >= 0) subscribers = subscribers.splice(index, 1)
}

const Provider = ({ children }) => {
  const [ loading, setPageLoading ] = useState(isPageLoading)

  const subscriber = (isPageLoading) => {
    if (loading !== isPageLoading) autoCapture({ category: LOADING, label: `${isPageLoading}`, action: 'set_page_loading' })
    setPageLoading(isPageLoading)
  }

  useEffect(() => {
    subscribe(subscriber)
    return () => {
      unsubscribe(subscriber)
    }
  }, [])

  return (
    <PageLoaderContext.Provider value={{ loading }}>
      {children}
    </PageLoaderContext.Provider>
  )
}

Provider.propTypes = {
  children: PropTypes.any
}

export {
  Provider,
  Consumer,
  setPageLoading
}
