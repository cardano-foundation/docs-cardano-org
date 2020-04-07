import TinyColor from '@ctrl/tinycolor'
import logger from './logger'

const makeTransparent = (color, alpha) => {
  try {
    const c = new TinyColor(color)
    c.setAlpha(alpha)
    return c.toRgbString()
  } catch (error) {
    logger.error({
      description: 'error making color transparent',
      args: [ color, alpha ],
      error
    })
    return '#000000'
  }
}

const toRGB = (color) => new TinyColor(color).toRgb()

const toCMYK = (color) => {
  const tinyColor = new TinyColor(color)
  const rgb = tinyColor.toRgb()
  const max = Math.max(rgb.r, rgb.g, rgb.b)
  const k = 1 - (max / 255) || 0
  const c = (1 - (rgb.r / 255) - k) / (1 - k) || 0
  const m = (1 - (rgb.g / 255) - k) / (1 - k) || 0
  const y = (1 - (rgb.b / 255) - k) / (1 - k) || 0
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  }
}

const darken = (color, amount) => new TinyColor(color).darken(amount).toRgbString()
const lighten = (color, amount) => new TinyColor(color).lighten(amount).toRgbString()

export {
  makeTransparent,
  toCMYK,
  toRGB,
  darken,
  lighten
}
