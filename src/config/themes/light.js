import dark from './dark'
import TinyColor from '@ctrl/tinycolor'
import IOHKSymbol from '../../../resources/images/light/iohk-symbol.png'
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { createMuiTheme } from '@material-ui/core'

const colors = {}
Object.keys(dark.colors).map(key => {
  const color = new TinyColor(dark.colors[key])
  color.r = 255 - color.r
  color.g = 255 - color.g
  color.b = 255 - color.b
  colors[key] = color.toRgbString()
})

export default {
  mui: createMuiTheme({
    typography: {
      fontFamily: ['Open Sans', 'Arial', 'sans-serif'].join(','),
      fontSize: 14,
      htmlFontSize: 10,
      h1: {
        fontSize: '4.5rem',
        fontSize: `calc(16px + 2.5vw)`, // eslint-disable-line
        textTransform: 'uppercase',
        fontWeight: '700',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: '1',
        letterSpacing: '2px',
        color: '#ffffff'
      },
      h2: {
        fontSize: '4rem'
      },
      h3: {
        fontSize: '2rem',
        textTransform: 'uppercase',
        fontWeight: '700'
      },
      h4: {
        fontSize: '1.9rem',
        textTransform: 'uppercase'
      },
      h5: {
        fontSize: '1.8rem',
        textTransform: 'uppercase',
        fontWeight: '700'
      },
      h6: {
        fontSize: '1.6rem',
        fontWeight: '700'
      },
      body1: {},
      body2: {
        fontSize: '1.4rem'
      }
    },
    spacing: factor => `${factor}rem`,
    overrides: {
      MuiButton: {
        root: {
          borderRadius: '3rem',
          textTransform: 'uppercase',
          fontWeight: '600'
        },
        containedPrimary: {
          color: 'primary.main'
        },
        outlinedPrimary: {
          '&:hover': {
            borderWidth: '0.2rem'
          },
          borderWidth: '0.2rem'
        }
      },
      MuiExpansionPanel: {
        rounded: {
          border: 'none',
          background: 'none',
          boxShadow: 'none'
        }
      },
      MuiExpansionPanelSummary: {
        root: {
          border: 'none',
          background: 'none',
          boxShadow: 'none',
          padding: 'none'
        }
      }
    }
  }),
  label: 'light',
  colors: {
    ...colors,
    primary: '#ffffff',
    primaryHighlight: '#f0f0f0',
    alertBackground: '#ffffff',
    alertForeground: '#000000',
    subtle: 'rgba(0, 0, 0, 0.05)',
    subtleAccent: 'rgba(0, 0, 0, 0.25)'
  },
  codeTheme: vs,
  dimensions: { ...dark.dimensions },
  images: {
    IOHKSymbol,
    Logo: IOHKSymbol
  }
}
