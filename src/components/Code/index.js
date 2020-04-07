import React from 'react'
import PropTypes from 'prop-types'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { ThemeConsumer } from '../../state'

const Code = (props) => (
  <ThemeConsumer>
    {({ theme }) => (
      <div>
        <SyntaxHighlighter language={props.language} style={theme.codeTheme} customStyle={{ padding: '2rem', borderRadius: '0.8rem' }}>
          {props.value}
        </SyntaxHighlighter>
      </div>
    )}
  </ThemeConsumer>
)

Code.propTypes = {
  language: PropTypes.string,
  value: PropTypes.string
}

export default Code
