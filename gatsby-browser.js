import 'whatwg-fetch'
import { analytics } from '@input-output-hk/front-end-core-libraries'
import App from './src/App'
import Root from './src/Root'
import config from './src/config'

// Setup analytics if GA tracking id is present in config
if (config.ga && config.ga.trackingID) analytics.initialize(config.ga.trackingID, { titleCase: false })

export const wrapPageElement = App
export const wrapRootElement = Root

let entryTime
const prefetchTimings = {}
const routeUpdateTimings = {}

// https://www.gatsbyjs.org/docs/browser-apis/#onClientEntry
export const onClientEntry = () => {
  entryTime = Date.now()
}

// https://www.gatsbyjs.org/docs/browser-apis/#onInitialClientRender
export const onInitialClientRender = () => {
  const renderTime = Date.now() - entryTime
  if (entryTime) analytics.timing({ category: analytics.constants.RENDER_TIMING, label: 'Initial site render time', value: renderTime, variable: 'initial_render' })
}

const getTimingKey = location => `${location.pathname}`

// https://www.gatsbyjs.org/docs/browser-apis/#onRouteUpdate
export const onRouteUpdate = ({ location, prevLocation }) => {
  const startTime = routeUpdateTimings[getTimingKey(location)]
  if (startTime) {
    const navigationTime = Date.now() - startTime
    analytics.timing({ category: analytics.constants.NAVIGATE_TIMING, label: prevLocation ? 'navigate' : 'initial_load', value: navigationTime, variable: location.pathname })
  }

  analytics.pageView(location.pathname)
}

// https://www.gatsbyjs.org/docs/browser-apis/#onRouteUpdateDelayed
export const onRouteUpdateDelayed = ({ location }) => {
  analytics.autoCapture({ category: analytics.constants.UX, label: location.pathname, action: 'route_update_delayed' })
}

// https://www.gatsbyjs.org/docs/browser-apis/#onPreRouteUpdate
export const onPreRouteUpdate = ({ location }) => {
  routeUpdateTimings[getTimingKey(location)] = Date.now()
}

// https://www.gatsbyjs.org/docs/browser-apis/#onPrefetchPathname
export const onPrefetchPathname = ({ pathname }) => {
  prefetchTimings[pathname] = Date.now()
}

// https://www.gatsbyjs.org/docs/browser-apis/#onPostPrefetchPathname
export const onPostPrefetchPathname = ({ pathname }) => {
  const startTime = routeUpdateTimings[pathname]
  if (startTime) analytics.timing({ category: analytics.constants.NAVIGATE_TIMING, label: 'prefetch', value: Date.now() - startTime, variable: pathname })
}
