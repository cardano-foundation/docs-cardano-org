import { isProduction, getBranch } from './helpers'

const backend = {
  name: isProduction() ? 'git-gateway' : 'test-repo'
}

if (isProduction()) backend.branch = getBranch()

export default backend
