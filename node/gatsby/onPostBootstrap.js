const path = require('path')
const fs = require('fs')
const { getSitemap } = require('./sitemap')

module.exports = () => {
  let siteMapString = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">URLS</urlset>`
  siteMapString = siteMapString.replace('URLS', getSitemap().map(path => `<url><loc>${process.env.GATSBY_URL}${path}</loc></url>`).join(''))
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, '../../public/sitemap.xml'), siteMapString, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
