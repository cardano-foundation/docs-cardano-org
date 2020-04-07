import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FaExclamationTriangle } from 'react-icons/fa'

const Container = styled.div`
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};

  > label {
    display: block;
    margin-bottom: 0.6rem;
  }

  > p {
    color: ${({ theme }) => theme.colors.fail};

    span {
      vertical-align: middle;
    }
  }
`

const Options = styled.div`
  width: 100%;
  max-width: 35rem;

  > div {
    margin: 1rem 0;
    display: flex;
    align-items: center;

    > div {
      width: 2.4rem;
      height: 2.4rem;

      input {
        width: 0;
        height: 0;
        opacity: 0;

        &:checked {
          outline: none;
        }

        &:focus {
          outline: none;

          + span {
            box-shadow: 0 0 0.3rem 0.2rem ${({ theme }) => theme.colors.outline};
          }
        }
      }

      > span {
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 50%;
        border: 0.1rem solid ${({ theme }) => theme.colors.pageRule};
        display: inline-block;
        position: relative;
        cursor: pointer;

        > span {
          display: inline-block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          background-color: ${({ theme }) => theme.colors.success};
        }
      }
    }

    label {
      margin-left: 1rem;
      cursor: pointer;
    }
  }
`

const getInputId = (value, name) => {
  return `checkbox-${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '')}`
}

const CheckBox = ({ inputProps, error, name, label, onChange, options, selected }) => (
  <Container disabled={inputProps.disabled} error={!!error}>
    <label htmlFor={name}>{inputProps.required && '*'}{label}</label>
    {error && <p><span><FaExclamationTriangle /></span> {error}</p>}
    <Options>
      {options.map(option => (
        <div key={option.value}>
          <div>
            <input type='checkbox' id={getInputId(option.value, name)} checked={selected.includes(option.value)} onChange={onChange} value={option.value} />
            <span aria-hidden onClick={() => onChange({ target: { value: option.value } })}>
              {selected.includes(option.value) && <span />}
            </span>
          </div>
          <label htmlFor={getInputId(option.value, name)}>
            {option.label}
          </label>
        </div>
      ))}
    </Options>
  </Container>
)

CheckBox.propTypes = {
  error: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  inputProps: PropTypes.object
}

CheckBox.defaultProps = {
  inputProps: {}
}

export default CheckBox
