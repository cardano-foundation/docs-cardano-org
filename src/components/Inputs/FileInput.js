import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FaExclamationTriangle, FaDownload } from 'react-icons/fa'

const Container = styled.div`
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  position: relative;

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

  > input {
    width: 0;
    height: 0;
    position: absolute;
    z-index: -1;

    &:focus {
      outline: none;

      + div > label {
        box-shadow: 0 0 0.3rem 0.2rem ${({ theme }) => theme.colors.outline};
      }
    }
  }

  > div {
    > label {
      cursor: pointer;
      border-radius: 0.2rem;
      letter-spacing: 0.1em;
      padding: 0.6rem 1.8rem;
      font-weight: 600;
      background-color: ${({ theme }) => theme.colors.secondaryButtonBackground};
      color: ${({ theme }) => theme.colors.secondaryButtonColor};
      text-transform: uppercase;

      > span {
        margin-left: 0.8rem;
      }
    }
  }
`

const Files = styled.div`
  span {
    display: block;
    margin: 1rem 0;
  }
`

const getInputId = (name) => {
  return `file-${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`
}

const FileInput = ({ inputProps, error, label, name, onChange }) => {
  const [ files, setFiles ] = useState([])
  const onFileChange = (e) => {
    const newFiles = []
    for (let i = 0; i < e.target.files.length; i++) {
      newFiles.push(e.target.files[i].name)
    }

    setFiles(newFiles)
    onChange(e)
  }

  return (
    <Container disabled={inputProps.disabled} error={!!error}>
      <label htmlFor={getInputId(name)}>{inputProps.required && '*'}{label}</label>
      {error && <p><span><FaExclamationTriangle /></span> {error}</p>}
      <input type='file' id={getInputId(name)} onChange={onFileChange} />
      <div aria-hidden>
        <label htmlFor={getInputId(name)}>
          <FaDownload /><span>Choose file</span>
        </label>
      </div>
      {files.length > 0 &&
        <Files>
          {files.map((file, index) => (
            <span key={`${file}_${index}`}>{file}</span>
          ))}
        </Files>
      }
    </Container>
  )
}

FileInput.propTypes = {
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  inputProps: PropTypes.object
}

export default FileInput
