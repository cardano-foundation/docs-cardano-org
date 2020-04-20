import backend from './backend'
import collections from './collections'
import { getBranch } from './helpers'

const init = window.initCMS
const config = {
  load_config_file: false,
  backend,
  media_library: {
    name: 'uploadcare',
    config: {
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY
    }
  },
  logo_url: 'https://ucarecdn.com/0a28215f-a3f0-40e2-ac7e-d7dc93288d16/-/resize/150/-/progressive/yes/',
  show_preview_links: true,
  collections
}

if (getBranch() === 'staging') config.publish_mode = 'editorial_workflow'

console.log('CMS config', config)

init({ config })
