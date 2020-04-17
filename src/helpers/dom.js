const noop = () => {}
const window = global.window || { document: { createElement: noop, dispatchEvent: noop, getElementsByTagName: noop }, addEventListener: noop, removeEventListener: noop, scrollX: 0, scrollY: 0, scrollTo: noop }

export const hideScrollBar = () => {
  const html = (window.document.getElementsByTagName('html') || [])[0]
  if (!html || !html.style) return
  html.style.overflow = 'hidden'
}

export const showScrollBar = () => {
  const html = (window.document.getElementsByTagName('html') || [])[0]
  if (!html || !html.style) return
  html.style.overflow = 'auto'
}

export const getBody = () => window.document.body
export const getInnerWidth = () => window.innerWidth
export const getInnerHeight = () => window.innerHeight
export const addEventListener = (event, cb) => window.addEventListener(event, cb)
export const removeEventListener = (event, cb) => window.removeEventListener(event, cb)
export const getScrollOffset = () => ({ x: window.pageXOffset, y: window.pageYOffset })
export const scrollTo = ({ x, y }) => window.scrollTo(x, y)
export const getCanvas = () => window.document.createElement('canvas')
export const getDocumentHeight = () => {
  if (!window.document.getElementsByTagName) return null
  const html = window.document.getElementsByTagName('html')[0]
  const body = window.document.getElementsByTagName('body')[0]
  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
}

export const getDocumentWidth = () => {
  if (!window.document.getElementsByTagName) return null
  const html = window.document.getElementsByTagName('html')[0]
  const body = window.document.getElementsByTagName('body')[0]
  return Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
}

export const triggerEvent = ({ type, bubbles = true, cancelable = false, data = {} }) => {
  if (window.document.createEvent) {
    const event = window.document.createEvent('CustomEvent')
    event.initCustomEvent(type, bubbles, cancelable, data)
    window.document.dispatchEvent(event)
  } else if (typeof window.CustomEvent === 'function') {
    const event = new window.CustomEvent(type, { bubbles, cancelable })
    event.data = data
    window.document.dispatchEvent(event)
  }
}
