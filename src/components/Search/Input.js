import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ThemeConsumer, LanguageConsumer } from '../../state'
import { navigate } from 'gatsby'

const Wrap = styled.div`

`

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
  &:focus{
    outline:none;
  }
  @media screen and (max-width: ${({ theme }) => theme.dimensions.screenSizes.small}px) {
    width: 100%;
    border-radius: 1.9rem;
    display: block;
    margin-bottom: 1rem;
  }
`

const Submit = styled.button`
  width:10%;
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

const onSubmit = (value, lang) => {
  navigate('/' + lang + '/search/?s=' + value)
}

const SearchField = ({ value, onChange, label, submitLabel, error, success }) => (
  <LanguageConsumer>
    {({ lang }) => (
      <ThemeConsumer>
        {({ theme }) => (
          <Wrap>
            <Form
              method='get'
              onSubmit={e => {
                e.preventDefault()
                onSubmit(value, lang)
              }}
            >
              <Input
                value={value}
                type='text'
                name='s'
                placeholder={label}
                onChange={onChange}
              />
              <Submit type='submit'>
                {submitLabel}
              </Submit>
            </Form>
          </Wrap>
        )}
      </ThemeConsumer>
    )}
  </LanguageConsumer>
)

SearchField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  submitLabel: PropTypes.node.isRequired,
  error: PropTypes.string,
  success: PropTypes.string
}

export default SearchField
