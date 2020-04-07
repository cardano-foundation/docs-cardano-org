/* eslint-disable */
import React, { useState } from 'react'
import styled from 'styled-components'
import { FiSearch } from 'react-icons/fi'

const Form = styled.form`
  width: 100%;
  display: block;
  @media screen and (max-width: ${({ theme }) => (theme.dimensions.screenSizes.large - 100)}px) {
    min-width:10rem;
    max-width:16rem;
  }
`

const Input = styled.input`
  width: 85%;
  @media screen and (min-width: ${({ theme }) => theme.dimensions.screenSizes.large}px) {
    width: 88%;
  }
  @media screen and (max-width: ${({ theme }) => (theme.dimensions.screenSizes.large - 100)}px) {
    width: 75%;
  }
  border:0.1rem solid ${({ theme }) => theme.colors.secondaryText};
  background:transparent;
  height: 3.8rem;
  padding: 0 2rem;
  border-radius: 1.9rem 0 0 1.9rem;
  vertical-align: middle;
  color: ${({ theme }) => theme.colors.text};
  &:focus{
    background:white;
    color:black;
    outline:none;
  }
`

const Submit = styled.button`
  width:15%;
  @media screen and (min-width: ${({ theme }) => theme.dimensions.screenSizes.large}px) {
    width: 12%;
  }
  @media screen and (max-width: ${({ theme }) => (theme.dimensions.screenSizes.large - 100)}px) {
    width: 25%;
  }
  vertical-align: middle;
  height: 3.8rem;
  border:0.1rem solid ${({ theme }) => theme.colors.secondaryText};
  border-left:0;
  background-color:transparent;
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
  transition: opacity 0.2s ease-in-out, background-color 0.2s ease-in-out;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  border-radius: 0 1.9rem 1.9rem 0;
  position: relative;
`

const SearchField = ({ initialValue = '', onSubmit }) => {
  const [value, setValue] = useState(initialValue)

  const onFormSubmit = (e) => {
    e.preventDefault()
    onSubmit(value)
  }

  return (
    <Form
      method='get'
      onSubmit={onFormSubmit}
    >
      <Input
        type='text'
        name='search-field'
        placeholder='Search'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Submit type='submit'>
        <FiSearch />
      </Submit>
    </Form>
  )
}

export default SearchField
