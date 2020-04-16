const fs = require('fs')
const path = require('path')
const { createDirectory } = require('./helpers')

function copyTours () {
  const vsCodeToursDirectory = path.join(__dirname, '..', '.vscode', 'tours')
  const toursDirectory = path.join(__dirname, '..', 'vscode-tours')
  const tours = fs.readdirSync(toursDirectory)
  tours.forEach(tour => {
    const tourPath = path.join(toursDirectory, tour)
    const content = fs.readFileSync(tourPath, { encoding: 'utf-8' })
    const vsCodeTourPath = path.join(vsCodeToursDirectory, tour)

    if (fs.existsSync(vsCodeTourPath) && fs.statSync(vsCodeTourPath).isFile) fs.unlinkSync(vsCodeTourPath)
    createDirectory(vsCodeTourPath)
    fs.writeFileSync(vsCodeTourPath, content, { encoding: 'utf-8' })
  })
}

function setupVSCodeSettings () {
  const vsCodeSettingsPath = path.join(__dirname, '..', '.vscode', 'settings.json')
  if (!fs.existsSync(vsCodeSettingsPath) || !fs.statSync(vsCodeSettingsPath).isFile) fs.writeFileSync(vsCodeSettingsPath, '{}', { encoding: 'utf-8' })
}

copyTours()
setupVSCodeSettings()
