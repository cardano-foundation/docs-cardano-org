import React, { createContext, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { ThemeProvider as MaterialUIThemeProvider, StylesProvider } from '@material-ui/styles'
import PropTypes from 'prop-types'
import themes from '../config/themes'
import { getLocalStorageValue, setLocalStorageValue } from '../helpers/localStorage'

const ThemeContext = createContext()
const Consumer = ThemeContext.Consumer

function getInitialTheme () {
  const localStorageTheme = getLocalStorageValue('theme')
  return (localStorageTheme && themes[localStorageTheme])
    ? localStorageTheme
    : Object.keys(themes)[0]
}

const Provider = ({ children }) => {
  const [ theme, updateTheme ] = useState(getInitialTheme())

  const setTheme = theme => {
    if (!Object.keys(themes).includes(theme)) throw new Error(`Theme ${theme} does not exist`)
    setLocalStorageValue('theme', theme)
    updateTheme(theme)
  }
  console.log('theme', themes[theme])
  return (
    <ThemeContext.Provider value={{ themeString: theme, theme: themes[theme], setTheme }}>
      <StylesProvider>
        <MaterialUIThemeProvider theme={themes[theme].mui}>
          <StyledThemeProvider theme={{ ...themes[theme].mui, label: themes[theme].label, colors: themes[theme].colors, dimensions: themes[theme].dimensions, codeTheme: themes[theme].codeTheme, images: themes[theme].images }}>
            {children}
          </StyledThemeProvider>
        </MaterialUIThemeProvider>
      </StylesProvider>
    </ThemeContext.Provider>
  )
}

Provider.propTypes = {
  children: PropTypes.any
}

export {
  Provider,
  Consumer
}
