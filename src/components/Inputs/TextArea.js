import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};

  > label {
    display: block;
    margin-bottom: 0.6rem;
    cursor: pointer;
  }

  > textarea {
    padding: 0.4rem 0.6rem;
    width: 100%;
    width: 35rem;
    max-width: 100%;
    border: 0.1rem solid ${({ error, theme }) => error ? theme.colors.fail : theme.colors.pageRule};
    background-color: ${({ disabled, theme }) => disabled ? theme.colors.pageRule : 'transparent'};
  }

  > p {
    color: ${({ theme }) => theme.colors.fail};

    span {
      vertical-align: middle;
    }
  }
`

const getInputId = (name) => {
  return `textarea-${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`
}

const TextArea = ({ error, value, onChange, label, name, inputProps }) => (
  <Container disabled={inputProps.disabled} error={!!error}>
    <label htmlFor={getInputId(name)}>{inputProps.required && '*'}{label}</label>
    {error && <p>{error}</p>}
    <textarea id={getInputId(name)} value={value} onChange={onChange} rows={12} {...inputProps} />
  </Container>
)

TextArea.propTypes = {
  error: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  inputProps: PropTypes.object
}

TextArea.defaultProps = {
  value: '',
  inputProps: {}
}

export default TextArea
