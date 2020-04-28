import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FiSearch } from 'react-icons/fi'
import { navigate } from 'gatsby'
import Language from '@input-output-hk/front-end-core-components/components/Language'
import { analytics } from '@input-output-hk/front-end-core-libraries'
import Search from '../state/Search'

const Form = styled.form`
  width: 100%;
  display: block;
`

const Input = styled.input`
  width: 80%;
  border: 0.1rem solid ${({ theme }) => theme.palette.text.primary}};
  background: transparent;
  height: 3.8rem;
  padding: 0 2rem;
  border-radius: 1.9rem 0 0 1.9rem;
  vertical-align: middle;
  color: ${({ theme }) => theme.palette.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  &:focus{
    background: ${({ theme }) => theme.palette.common.white};
    color: ${({ theme }) => theme.palette.common.black};
    outline: none;

    &::placeholder {
      color: ${({ theme }) => theme.palette.common.black};
    }
  }
`

const Submit = styled.button`
  width: 20%;
  vertical-align: middle;
  height: 3.8rem;
  border: 0.1rem solid ${({ theme }) => theme.palette.text.primary};
  border-left: 0;
  background-color: transparent;
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
  transition: opacity 0.2s ease-in-out, background-color 0.2s ease-in-out;
  color: ${({ theme }) => theme.palette.text.primary};
  font-weight: 600;
  border-radius: 0 1.9rem 1.9rem 0;
  position: relative;
`

const SearchField = ({ onSearch }) => {
  const onFormSubmit = (search, lang, setSearch) => (e) => {
    e.preventDefault()
    analytics.capture({ category: 'form', action: 'submit_search', label: search })
    onSearch && onSearch(search)
    setSearch('')
    navigate(`/${lang}/search/?query=${encodeURIComponent(search)}&page=1`)
  }

  return (
    <Language.Consumer>
      {({ key: lang }) => (
        <Search.Consumer>
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
              <Submit
                type='submit'
                onClick={(e) => analytics.click({ category: 'form', label: 'search_submit', event: e })}
              >
                <FiSearch />
              </Submit>
            </Form>
          )}
        </Search.Consumer>
      )}
    </Language.Consumer>
  )
}

SearchField.propTypes = {
  onSearch: PropTypes.func
}

export default SearchField
