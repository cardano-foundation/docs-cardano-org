import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

const SearchContext = createContext()
const Consumer = SearchContext.Consumer

const Provider = ({ children }) => {
  const [ search, setSearch ] = useState('')

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

Provider.propTypes = {
  children: PropTypes.node.isRequired
}

export default {
  Consumer,
  Provider
}
