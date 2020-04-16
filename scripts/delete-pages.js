const fs = require('fs')
const path = require('path')
const config = require('../node/config')
const { deleteEmptyDirectory, getResolvedPath, getQueryName, getMetaDataFilename, getNetlifyImport } = require('./helpers')

const paths = process.argv.slice(2)

function deleteNetlifyPage (normalizedPath) {
  const [ resolvedPath ] = getResolvedPath(normalizedPath, 'home')
  const fullPath = path.join(__dirname, '..', 'netlify', 'collections', 'pages', `${resolvedPath}.js`)
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile) {
    console.log(`Netlify collection for page ${resolvedPath}.js does not exist`)
    return
  }

  fs.unlinkSync(fullPath)
  deleteEmptyDirectory(fullPath)
  console.log(`Netlify collection for page ${resolvedPath}.js deleted`)

  const indexPath = path.join(__dirname, '..', 'netlify', 'collections', 'pages', 'index.js')
  const indexContent = fs.readFileSync(indexPath, { encoding: 'utf8' })
  const [ importName, importPath ] = getNetlifyImport(resolvedPath)
  const newIndexContent = indexContent
    .replace(new RegExp(`import\\s${importName}\\sfrom\\s'${importPath}'\\n`), '')
    .replace(new RegExp(`,?[\\s]+${importName}(,|\\n)`), (_, endDelimiter) => {
      if (endDelimiter === ',') return ','
      return `\n`
    })

  fs.writeFileSync(indexPath, newIndexContent, { encoding: 'utf8' })
  console.log('Netlify collection pages/index.js updated')
}

function deleteMarkdown (normalizedPath) {
  const contentRelativePath = path.join('resources', 'content', 'pages')
  const [ markdownRelativePath ] = getResolvedPath(normalizedPath)

  config.availableLanguages.forEach(language => {
    const markdownFileRelativePath = path.join(contentRelativePath, markdownRelativePath, `${markdownRelativePath.split(path.sep).join('-')}-${language.key}.md`)
    const markdownFilePath = path.join(__dirname, '..', markdownFileRelativePath)

    if (!fs.existsSync(markdownFilePath) || !fs.statSync(markdownFilePath).isFile) {
      console.log(`Markdown file for page ${markdownFileRelativePath} does not exist`)
    } else {
      fs.unlinkSync(markdownFilePath)
      deleteEmptyDirectory(markdownFilePath)
      console.log(`Markdown file deleted ${markdownFileRelativePath}`)
    }
  })
}

function deleteQuery (normalizedPath) {
  const queryName = getQueryName(normalizedPath)
  const queryRelativePath = path.join('src', 'queries', `${queryName}PageQuery.js`)

  const fullPath = path.join(__dirname, '..', queryRelativePath)
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile) {
    console.log(`Query file for page ${fullPath} does not exist`)
  } else {
    fs.unlinkSync(fullPath)
    console.log(`Query file deleted ${fullPath}`)
  }
}

function deleteMeta (normalizedPath) {
  const metaDataName = getMetaDataFilename(normalizedPath)
  const metaRelativePath = path.join('resources', 'content', 'meta')
  config.availableLanguages.forEach(language => {
    const localizedMetaFileName = `${metaDataName}-${language.key}.md`
    const metaFileRelativePath = path.join(metaRelativePath, localizedMetaFileName)

    const fullPath = path.join(__dirname, '..', metaFileRelativePath)
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile) {
      console.log(`Meta data file for page ${fullPath} does not exist`)
    } else {
      fs.unlinkSync(fullPath)
      console.log(`Meta data file deleted ${fullPath}`)
    }
  })
}

function deletePage (normalizedPath) {
  const [ pageRelativePath ] = getResolvedPath(normalizedPath)

  const fullPath = path.join(__dirname, '..', 'src', 'pages', `${pageRelativePath}.js`)
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile) {
    console.log(`Page file for page ${fullPath} does not exist`)
  } else {
    fs.unlinkSync(fullPath)
    deleteEmptyDirectory(fullPath)
    console.log(`Page file deleted ${fullPath}`)
  }
}

paths.forEach(path => {
  console.log(`Deleting page ${path}`)
  const normalizedPath = path.replace(/^\//, '').replace(/\/$/, '')
  deleteNetlifyPage(normalizedPath)
  deleteMarkdown(normalizedPath)
  deleteQuery(normalizedPath)
  deleteMeta(normalizedPath)
  deletePage(normalizedPath)
})
