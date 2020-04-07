const data = {}

module.exports.set = (key, value) => (data[key] = value)
module.exports.get = (key) => data[key]
