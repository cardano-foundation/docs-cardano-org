import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: ${({ size }) => size}rem;
  height: ${({ size }) => size}rem;

  > div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${({ size }) => size * 0.8}rem;
    height: ${({ size }) => size * 0.8}rem;
    margin: ${({ size }) => size * 0.1}rem;
    border: ${({ size }) => size * 0.1}rem solid ${({ theme }) => theme.colors.interactive};
    border-radius: 50%;
    animation: ${Spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({ theme }) => theme.colors.interactive} transparent transparent transparent;

    &:nth-child(1) {
      animation-delay: -0.45s;
    }

    &:nth-child(2) {
      animation-delay: -0.3s;
    }

    &:nth-child(3) {
      animation-delay: -0.15s;
    }
  }
`

const Loader = ({ size }) => (
  <Container size={size}>
    <div />
    <div />
    <div />
    <div />
  </Container>
)

Loader.propTypes = {
  size: PropTypes.number
}

Loader.defaultProps = {
  size: 10
}

export default Loader
