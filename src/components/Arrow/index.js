import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IoMdPlay } from 'react-icons/io'

const defaultRotation = 'down'
const rotations = {
  up: 270,
  right: 0,
  down: 90,
  left: 180
}

const Container = styled.div`
  transform: rotate(${({ rotation }) => rotation}deg);
  display: inline-block;
  transition: transform 0.2s ease-in-out;
  transform-origin: center;
  line-height: 1rem;

  svg {
    fill: ${({ shouldFill }) => shouldFill ? 'currentColor' : 'transparent'};
    stroke-width: 5rem;
  }
`

const getRotation = ({ up, down, left, right }) => {
  if (up) return rotations.up
  if (left) return rotations.left
  if (right) return rotations.right
  if (down) return rotations.down
  return rotations[defaultRotation]
}

const Arrow = ({ up, down, right, left, fill }) => (
  <Container rotation={getRotation({ up, down, left, right })} shouldFill={fill}>
    <IoMdPlay />
  </Container>
)

Arrow.propTypes = {
  up: PropTypes.bool,
  down: PropTypes.bool,
  right: PropTypes.bool,
  left: PropTypes.bool,
  fill: PropTypes.bool
}

export default Arrow
