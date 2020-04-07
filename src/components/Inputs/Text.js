import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FaExclamationTriangle } from 'react-icons/fa'

const Container = styled.div`
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};

  > label {
    display: block;
    margin-bottom: 0.6rem;
    cursor: pointer;
  }

  > input {
    padding: 0.4rem 0.6rem;
    width: 100%;
    max-width: 35rem;
    border: 0.1rem solid ${({ error, theme }) => error ? theme.colors.fail : theme.colors.pageRule};
    background-color: ${({ disabled, theme }) => disabled ? theme.colors.pageRule : 'transparent'};

    &[type="number"] {
      max-width: 12rem;
    }
  }

  > p {
    color: ${({ theme }) => theme.colors.fail};

    span {
      vertical-align: middle;
    }
  }
`

const getInputId = (name) => {
  return `text-${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`
}

const Text = ({ error, value, onChange, label, name, type, inputProps }) => (
  <Container disabled={inputProps.disabled} error={!!error}>
    <label htmlFor={getInputId(name)}>{inputProps.required && '*'}{label}</label>
    {error && <p><span><FaExclamationTriangle /></span> {error}</p>}
    <input type={type} id={getInputId(name)} value={value} onChange={onChange} {...inputProps} />
  </Container>
)

Text.propTypes = {
  error: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  inputProps: PropTypes.object
}

Text.defaultProps = {
  value: '',
  type: 'text',
  inputProps: {}
}

export default Text
