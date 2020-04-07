module.exports.isProduction = () => process.env.CIRCLECI === 'true' && process.env.CIRCLE_BRANCH === 'master'
