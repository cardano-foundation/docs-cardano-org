import 'whatwg-fetch'
import App from './src/App'
import Root from './src/Root'
import { setPageLoading } from './src/state/PageLoader'
import { pageView, timing, autoCapture } from './src/helpers/analytics'
import { languageSetInURL } from './src/helpers/url'
import { RENDER_TIMING, NAVIGATE_TIMING, UX } from './src/constants/analytics'

export const wrapPageElement = App
export const wrapRootElement = Root

let entryTime
const prefetchTimings = {}
const routeUpdateTimings = {}

export const onClientEntry = () => {
  entryTime = Date.now()
}

export const onInitialClientRender = () => {
  const renderTime = Date.now() - entryTime
  if (entryTime) timing({ category: RENDER_TIMING, label: 'Initial site render time', value: renderTime, variable: 'initial_render' })
  setPageLoading(false)
}

const getTimingKey = location => `${location.pathname}`

export const onRouteUpdate = ({ location, prevLocation }) => {
  const startTime = routeUpdateTimings[getTimingKey(location)]
  if (startTime) {
    const navigationTime = Date.now() - startTime
    timing({ category: NAVIGATE_TIMING, label: prevLocation ? 'navigate' : 'initial_load', value: navigationTime, variable: location.pathname })
  }

  // The site will always redirect to a language prefix. If we track unprefixed URL's the bounce
  // rate data will be incorrect, therefore we should only track the prefixed pages
  if (languageSetInURL()) pageView(location.pathname)
  setPageLoading(false)
}

export const onRouteUpdateDelayed = ({ location }) => {
  setPageLoading(true)
  autoCapture({ category: UX, label: location.pathname, action: 'route_update_delayed' })
}

export const onPreRouteUpdate = ({ location }) => {
  routeUpdateTimings[getTimingKey(location)] = Date.now()
}

export const onPrefetchPathname = ({ pathname }) => {
  prefetchTimings[pathname] = Date.now()
}

export const onPostPrefetchPathname = ({ pathname }) => {
  const startTime = routeUpdateTimings[pathname]
  if (startTime) timing({ category: NAVIGATE_TIMING, label: 'prefetch', value: Date.now() - startTime, variable: pathname })
}
