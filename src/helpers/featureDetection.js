import { getCanvas } from './dom'

const window = global.window || {}

let canvas
const getGLContext = () => {
  if (!canvas) canvas = getCanvas()
  const context = canvas.getContext('webgl')
  if (!canvas) return canvas.getContext('experimental-webgl')
  return context
}

const hasWebGLRenderingContext = () => !!window.WebGLRenderingContext
export const supportsWebGL = () => {
  if (!hasWebGLRenderingContext()) return false
  return !!getGLContext()
}

const getSupportedWebGLExtensions = () => supportsWebGL() ? getGLContext().getSupportedExtensions() : []
export const webGLSupportsExtension = (extension) => getSupportedWebGLExtensions().includes(extension)
