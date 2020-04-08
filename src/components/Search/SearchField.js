/* eslint-disable */
import React, { useState } from 'react'
import styled from 'styled-components'
import { FiSearch } from 'react-icons/fi'
import { navigate } from 'gatsby'
import { SearchConsumer, LanguageConsumer } from '../../state'

const Form = styled.form`
  width: 100%;
  display: block;
`

const Input = styled.input`
  width: 80%;
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
  width: 20%;
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

const SearchField = () => {
  const onFormSubmit = (search, lang, setSearch) => (e) => {
    e.preventDefault()
    setSearch('')
    navigate(`/${lang}/search/?query=${encodeURIComponent(search)}&page=1`)
  }

  return (
    <LanguageConsumer>
      {({ lang }) => (
        <SearchConsumer>
          {({ search, setSearch }) => (
            <Form
              onSubmit={onFormSubmit(search, lang, setSearch)}
            >
              <Input
                type='text'
                name='search-field'
                placeholder='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Submit type='submit'>
                <FiSearch />
              </Submit>
            </Form>
          )}
        </SearchConsumer>
      )}
    </LanguageConsumer>
  )
}

export default SearchField
