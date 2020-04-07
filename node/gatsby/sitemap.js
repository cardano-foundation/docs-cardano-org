const sitemap = []

module.exports.getSitemap = () => sitemap
module.exports.addToSitemap = (path) => {
  if (!sitemap.includes(path)) sitemap.push(path)
}
