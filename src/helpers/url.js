import { triggerEvent } from './dom'
import config from '../config'

const window = global.window || { location: { pathname: '/', href: '', origin: '', hash: '', hostname: '', search: '' }, history: {} }

export const getURIPath = () => window.location.pathname
export const getURIPathWithoutLang = (lang, path) => (path || getURIPath()).replace(new RegExp(`^\\/${lang}`), '')
export const languageSetInURL = (url = null) => !!config.availableLanguages[(url || getURIPath()).split('/').splice(1)[0]]
export const isLanguageSupported = (lang) => lang && (config.availableLanguages[lang] || config.alternativeLanguages[lang])
export const getHref = () => window.location.href
export const setHref = href => (window.location.href = href)
export const isRelative = url => !url.match(/^(\/\/|https?:\/\/|mailto:)/)
export const isPath = url => !!url.match(/^(\/|\/[^\\/].*)$/)
export const isFile = url => !!url.match(/.*\/?[^.]+\..*?$/)
export const getSearch = () => window.location.search
export const getHash = () => window.location.hash
export const getHostname = () => window.location.hostname
export const isActive = (path, lang) => getURIPathWithoutLang(lang).substring(0, path.length) === path

export const getSearchParam = (search, key) => {
  const params = (search || '').replace(/^\?/, '').split('&')
  while (params.length > 0) {
    const [ k, v ] = params.shift().split('=')
    if (k === key) return decodeURIComponent(v)
  }

  return null
}
const getHashParams = () => {
  const currentHash = getHash().replace(/^#/, '')
  const params = currentHash.split('&').map(p => ({ [p.split('=')[0]]: p.split('=')[1] }))
  let paramsObj = {}
  params.forEach(p => (paramsObj = { ...paramsObj, ...p }))
  return paramsObj
}

export const setHashParam = (key, value) => {
  const params = getHashParams()
  if (!value) {
    delete params[key]
  } else {
    params[key] = value
  }

  const paramStrings = Object.keys(params).map(k => params[k] && k ? `${k}=${params[k]}` : '').filter(v => !!v)
  if (paramStrings.length > 0) {
    if (window.history.pushState) {
      window.history.pushState(null, null, `#${paramStrings.join('&')}`)
      triggerEvent({ type: 'hashchange' })
    } else {
      window.location.hash = `#${paramStrings.join('&')}`
    }
  } else {
    if (window.history.pushState) {
      window.history.pushState(null, null, '#')
      triggerEvent({ type: 'hashchange' })
    } else {
      window.location.hash = ''
    }
  }
}

export const getHashParam = key => {
  return getHashParams()[key] || ''
}
