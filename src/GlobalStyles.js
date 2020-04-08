import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  html {
    max-width: 100%;
    overflow-x: hidden;
    background-color: ${({ theme }) => theme.colors.primary};
    box-sizing: border-box;
    font-size: 62.5%;

    @media screen and (min-width: 2048px) {
      font-size: 68%;
    }
  }

  *, *:before, *:after {
    box-sizing:inherit;
  }

  hr {
    height: 0.1rem;
    color: ${({ theme }) => theme.colors.pageRule};
    background-color: ${({ theme }) => theme.colors.pageRule};;
    border: none;
  }

  body,
  .title-text {
    color: ${({ theme }) => theme.colors.text};
  }

  .sub-title-text,
  small {
    color: ${({ theme }) => theme.colors.secondaryText};
  }

  body {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    -ms-overflow-style: -ms-autohiding-scrollbar;
    min-height: 100vh;
}

  ul, ol {
    list-style-position: inside;
    margin-left:0;
    padding: 0;
  }

  a {
    outline-width: 0.5rem;
    color: ${({ theme }) => theme.colors.interactive};
    transition: color 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
      outline-width: 0.5rem;
      color: ${({ theme }) => theme.colors.interactiveHighlight};
    }
  }

  pre, code {
    white-space: pre-wrap !important;       /* css-3 */
    white-space: -moz-pre-wrap !important;  /* Mozilla, since 1999 */
    white-space: -pre-wrap !important;      /* Opera 4-6 */
    white-space: -o-pre-wrap !important;    /* Opera 7 */
    word-wrap: break-word !important;       /* Internet Explorer 5.5+ */
    letter-spacing: 0.1rem;
  }

  .active {
    color: ${({ theme }) => theme.colors.interactiveHighlight};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  @media screen and (max-width: 800px) {
    h1 {
      font-size: 2.4rem;
    }

    h2 {
      font-size: 2.2rem;
    }
  }

  .text-align-center {
    text-align: center;
  }

  .text-align-left {
    text-align: left;
  }

  .text-align-right {
    text-align: right;
  }

  .text-align-justify {
    text-align: justify;
  }

  .text-transform-uppercase {
    text-transform: uppercase;
  }

  .text-transform-lowercase {
    text-transform: lowercase;
  }

  .text-transform-capitalize {
    text-transform: capitalize;
  }

  .display-block {
    display: block;
  }

  .display-inline {
    display: inline;
  }

  .display-inline-block {
    display: inline-block;
  }

  .ml-5 {
    margin-left: 5rem;
  }

  ${'' /**
    Example:

    .margin-top-1 // margin top of 1rem
    .padding-left-4 // padding left of 4rem

    Only supports from 0 to 5 rem
  */}
  ${() => {
    const spacings = []
    for (let i = 0; i <= 5; i++) {
      const positions = ['top', 'right', 'bottom', 'left']
      positions.forEach(pos => {
        spacings.push(`
          .padding-${pos}-${i} {
            padding-${pos}: ${i * 1}rem;
          }

          .margin-${pos}-${i} {
            margin-${pos}: ${i * 1}rem;
          }
        `)
      })
    }

    return spacings.join('')
  }}

  .max-width-100 {
    max-width: 100%;
  }

  .horizontal {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`
