import React, { createRef } from 'react'
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

  > p {
    color: ${({ theme }) => theme.colors.fail};

    span {
      vertical-align: middle;
    }
  }
`

const InputContainer = styled.div`
  > input {
    position: relative;
    padding: 0.4rem 0.6rem;
    width: 100%;
    max-width: 4rem;
    border: 0.1rem solid ${({ error, theme }) => error ? theme.colors.fail : theme.colors.pageRule};
    text-align: center;

    &:last-of-type {
      max-width: 5rem;
    }
  }

  > span {
    margin: 0 0.6rem;
  }
`

const getInputId = (name, type) => {
  return `date-${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}}-${type}`
}

const getLabelFor = (name, day, month) => {
  let type = 'year'
  if (!day) type = 'day'
  if (day && !month) type = 'month'
  return `date-${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}}-${type}`
}

const DateInput = ({ error, value, onChange, label, name, inputProps }) => {
  const monthRef = createRef()
  const yearRef = createRef()
  const getDay = () => value.split('-')[0]
  const getMonth = () => value.split('-')[1] || ''
  const getYear = () => value.split('-')[2] || ''

  const onDayChange = (e) => {
    const day = e.target.value
    if (day.match(/[^\d]/g) || day.length > 2) return
    if (day.length === 2 && parseInt(day) <= 31) monthRef.current.focus()
    const date = [ day, getMonth(), getYear() ].join('-')
    onChange({ target: { value: date } })
  }

  const onMonthChange = (e) => {
    const month = e.target.value
    if (month.match(/[^\d]/g) || month.length > 2) return
    if (month.length === 2 && parseInt(month) <= 12) yearRef.current.focus()
    const date = [ getDay(), month, getYear() ].join('-')
    onChange({ target: { value: date } })
  }

  const onYearChange = (e) => {
    const year = e.target.value
    if (year.match(/[^\d]/g) || year.length > 4) return
    const date = [ getDay(), getMonth(), year ].join('-')
    onChange({ target: { value: date } })
  }

  return (
    <Container disabled={inputProps.disabled} error={!!error}>
      <label htmlFor={getLabelFor(name, getDay(), getMonth())}>{inputProps.required && '*'}{label}</label>
      {error && <p><span><FaExclamationTriangle /></span> {error}</p>}
      <InputContainer error={!!error}>
        <input placeholder='DD' aria-label='DD' id={getInputId(name, 'day')} value={getDay()} onChange={onDayChange} {...inputProps} />
        <span>/</span>
        <input placeholder='MM' aria-label='MM' id={getInputId(name, 'month')} ref={monthRef} value={getMonth()} onChange={onMonthChange} {...inputProps} />
        <span>/</span>
        <input placeholder='YYYY' aria-label='YYYY' ref={yearRef} value={getYear()} onChange={onYearChange} {...inputProps} />
      </InputContainer>
    </Container>
  )
}

DateInput.propTypes = {
  error: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  inputProps: PropTypes.object
}

DateInput.defaultProps = {
  value: '',
  inputProps: {}
}

export default DateInput
