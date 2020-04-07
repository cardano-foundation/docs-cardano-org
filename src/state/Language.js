import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import config from '../config'
import * as moment from 'moment'
import { getURIPath, languageSetInURL, isLanguageSupported } from '../helpers/url'
import { getLocalStorageValue, setLocalStorageValue } from '../helpers/localStorage'
import { getNavigatorLanguage } from '../helpers/navigator'
import { autoCapture } from '../helpers/analytics'
import { LANGUAGE } from '../constants/analytics'
import { navigate } from 'gatsby'

const LanguageContext = createContext()
const Consumer = LanguageContext.Consumer

function getUrlLang () {
  const [ urlLang ] = getURIPath().split('/').splice(1)
  return urlLang
}

function getDefaultLanguage () {
  const urlLang = getUrlLang()
  // Use URL language where available
  if (isLanguageSupported(urlLang)) return urlLang
  // Fallback to local storage or default config
  const localStorageLang = getLocalStorageValue('lang')
  // Users browser language
  const navigatorLanguage = getNavigatorLanguage().substring(0, 2)
  // Use local storage first as they have already visited the site
  if (isLanguageSupported(localStorageLang)) return localStorageLang
  // Use the users browser language if it supported by the site
  if (isLanguageSupported(navigatorLanguage)) return navigatorLanguage
  // Fall back to the first available language in the config
  return Object.keys(config.availableLanguages)[0]
}

const resolveLanguage = (lang) => {
  if (config.alternativeLanguages[lang]) return config.alternativeLanguages[lang]
  return lang
}

const Provider = ({ children }) => {
  const [ lang, updateLang ] = useState(resolveLanguage(getDefaultLanguage()))
  const setLang = (language, redirect = true) => {
    if (!config.availableLanguages[language]) throw new Error(`Invalid language ${language}`)
    const pathParts = getURIPath().split('/').splice(1)
    if (languageSetInURL()) {
      pathParts.splice(0, 1, language)
    } else {
      pathParts.unshift(language)
    }

    setLocalStorageValue('lang', language)
    moment.locale(language)
    updateLang(language)
    if (lang !== language) autoCapture({ category: LANGUAGE, label: language, action: 'updated_language' })
    if (redirect) navigate(`/${language}/`)
  }

  useEffect(() => {
    setLang(lang, false)
  }, [])

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        availableLocales: Object.keys(config.availableLanguages).map(key => config.availableLanguages[key].locale),
        locale: config.availableLanguages[lang].locale
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

Provider.propTypes = {
  children: PropTypes.any
}

export {
  Provider,
  Consumer
}
