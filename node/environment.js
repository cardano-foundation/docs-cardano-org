module.exports.isProduction = () => process.env.HEAD === 'master' || process.env.NODE_ENV === 'production'
