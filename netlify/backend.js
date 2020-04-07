import { isProduction, getBranch } from './helpers'

const backend = {
  name: isProduction() ? 'git-gateway' : 'test-repo'
}

if (isProduction()) {
  backend.branch = getBranch()
  backend.accept_roles = [
    'admin',
    'editor'
  ]
}

export default backend
