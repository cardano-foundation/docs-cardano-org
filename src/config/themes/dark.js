import IOHKSymbol from '../../../resources/images/dark/iohk-symbol-inverted.png'
import Cardano from '../../../resources/images/dark/card-logo.svg'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { createMuiTheme } from '@material-ui/core'

export default {
  mui: createMuiTheme({
    palette: {
      primary: {
        main: 'rgba(63, 224, 226, 0.7)'
      },
      secondary: {
        main: '#f69ab2'
      },
      background: {
        default: '#121326',
        alternative: '#1E1F31'
      },
      text: {
        primary: 'rgba(255, 255, 255, 0.7)',
        secondary: 'rgba(255, 255, 255, 0.7)',
        dark: 'rgba(0, 0, 0, 0.8)'
      },
      type: 'dark'
    },
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
  label: 'dark',
  colors: {
    primary: '#131325',
    primaryHighlight: '#4f4f7c',
    subtle: 'rgba(255, 255, 255, 0.1)',
    subtleAccent: 'rgba(255, 255, 255, 0.25)',
    secondary: 'rgba(83, 87, 135, 0.95)',
    interactive: 'rgba(63, 224, 226, 0.7)',
    interactiveHighlight: 'rgba(63, 224, 226, 1)',
    text: '#ffffff',
    secondaryText: '#afafaf',
    textInverted: '#000000',
    buttonColor: '#ffffff',
    secondaryButtonBackground: '#444444',
    secondaryButtonColor: '#ffffff',
    secondaryButtonBackgroundHighlight: '#555555',
    pageRule: '#36395d',
    alertBackground: '#ffffff',
    alertForeground: '#000000',
    fail: '#eb2256',
    success: '#2cbb69',
    outline: '#4D90FE',
    active: '#ffffff'
  },
  dimensions: {
    contentWidth: '85vw',
    contentGutterSize: '2rem',
    mobileBreakpoint: 800,
    screenSizes: {
      small: 576,
      medium: 768,
      large: 992,
      extraLarge: 1200
    }
  },
  codeTheme: darcula,
  images: {
    IOHKSymbol,
    Cardano,
    Logo: Cardano
  }
}
