import React from 'react'
import PropTypes from 'prop-types'
import { setHashParam } from '../../helpers/url'
import Link from '../Link'

export const openModal = name => setHashParam('modal', name)

const ModalTrigger = (props) => {
  const filteredProps = { ...props }
  const exclude = [ 'href', 'onClick', 'tracking' ]
  exclude.forEach(p => delete filteredProps[p])
  return (
    <Link
      {...filteredProps}
      href='#'
      onClick={(e) => {
        e.preventDefault()
        openModal(props.name)
      }}
      tracking={{ label: `open_modal_${props.name}` }}
    >
      {props.children}
    </Link>
  )
}

ModalTrigger.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired
}

export default ModalTrigger
