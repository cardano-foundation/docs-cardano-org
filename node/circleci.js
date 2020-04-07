const circleci = module.exports = {}
const fetch = require('node-fetch')

const baseURL = 'https://circleci.com/api/v1.1'
circleci.triggerBuild = async (branch) => {
  console.log(`Triggering CircleCI build on ${branch} for ${process.env.CIRCLE_PROJECT_USERNAME}/${process.env.CIRCLE_PROJECT_REPONAME}`)
  // https://circleci.com/docs/api/#trigger-a-new-build-by-project-preview
  const endpoint = `/project/github/${process.env.CIRCLE_PROJECT_USERNAME}/${process.env.CIRCLE_PROJECT_REPONAME}/build?circle-token=${process.env.CIRCLECI_TOKEN}`
  const result = await fetch(`${baseURL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branch })
  })

  const JSONResult = await result.json()
  console.log('CircleCI trigger build result', JSONResult)
  return JSONResult
}
