import backend from './backend'
import collections from './collections'
import { getBranch } from './helpers'

const init = window.initCMS
const config = {
  load_config_file: false,
  backend,
  media_folder: 'static/images/uploads',
  public_folder: '/images/uploads',
  logo_url: '/images/cardano-roadmap.png',
  show_preview_links: true,
  collections
}

if (getBranch() === 'staging') {
  config.publish_mode = 'editorial_workflow'
}

console.log('CMS config', config)

init({ config })
