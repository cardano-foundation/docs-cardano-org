import * as themes from '@input-output-hk/front-end-themes'
import config from './config'

export function getThemes () {
  return config.themes.map(key => ({ key, config: themes[key] }))
}
