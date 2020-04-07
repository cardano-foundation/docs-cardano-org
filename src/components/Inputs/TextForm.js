import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Form = styled.form`
  width: 100%;
  display: block;
`

const Input = styled.input`
  width: 70%;
  border: none;
  height: 3.8rem;
  padding: 0 2rem;
  border-radius: 1.9rem 0 0 1.9rem;
  vertical-align: middle;
  color: ${({ error, theme }) => error ? theme.colors.error : 'initial'};

  @media screen and (max-width: ${({ theme }) => theme.dimensions.screenSizes.small}px) {
    width: 100%;
    border-radius: 1.9rem;
    display: block;
    margin-bottom: 1rem;
  }
`

const Submit = styled.button`
  width: 30%;
  vertical-align: middle;
  height: 3.8rem;
  border: none;
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.primary : theme.colors.interactive};
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
  transition: opacity 0.2s ease-in-out, background-color 0.2s ease-in-out;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  border-radius: 0 1.9rem 1.9rem 0;
  position: relative;

  @media screen and (max-width: ${({ theme }) => theme.dimensions.screenSizes.small}px) {
    border-radius: 1.9rem;
    display: block;
    margin: 0 auto;
    width: auto;
    min-width: 20rem;
    padding: 0 4rem;
  }
`

const FormError = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-weight: 600;
  margin-top: 0.8rem;
`

const FormSuccess = styled.div`
  color: ${({ theme }) => theme.colors.success};
  font-weight: 600;
  margin-top: 0.8rem;
`

const TextForm = ({ value, onChange, onSubmit, label, submitLabel, inputType, error, success, disabled }) => (
  <Form onSubmit={e => {
    e.preventDefault()
    onSubmit()
  }}>
    <Input
      value={value}
      type={inputType}
      onChange={e => {
        e.preventDefault()
        onChange(e.target.value)
      }}
      placeholder={label}
      error={!!error}
    />
    <Submit disabled={disabled || value.length === 0 || error} type='submit'>
      {submitLabel}
    </Submit>
    {error &&
      <FormError>
        <p>{error}</p>
      </FormError>
    }
    {success &&
      <FormSuccess>
        <p>{success}</p>
      </FormSuccess>
    }
  </Form>
)

TextForm.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  submitLabel: PropTypes.node.isRequired,
  inputType: PropTypes.string,
  error: PropTypes.string,
  success: PropTypes.string
}

TextForm.defaultProps = {
  inputType: 'text'
}

export default TextForm
