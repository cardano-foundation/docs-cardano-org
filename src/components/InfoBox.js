import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import TinyColor from '@ctrl/tinycolor'

const Container = styled.div`
  width: 100%;
  padding: 5rem;
  background:${({ theme }) => new TinyColor(theme.palette.secondary.light).setAlpha(0.8).toString()};
  color: ${({ theme }) => theme.palette.secondary.contrastText};
  text-align: center;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    border-top: 0.1rem solid ${({ theme }) => theme.palette.info.light};
    width: 12rem;
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }
`

const Triangle = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  border-width: 2.6rem 1.5rem 0 1.5rem;
  border-color: ${({ theme }) => theme.palette.info.light} transparent transparent transparent;
  border-style: solid;
  width: 0;
  height: 0;

  &:after {
    content: '';
    border-width: 2.4rem 1.3rem 0 1.3rem;
    border-color: ${({ theme }) => theme.palette.secondary.dark} transparent transparent transparent;
    border-style: solid;
    transform: translate(-50%, -2.5rem);
    left: 50%;
    position: absolute;
  }
`

const Body = styled.div`
  color: ${({ theme }) => new TinyColor(theme.palette.primary.contrastText).setAlpha(0.75).toString()};
`

const InfoBox = ({ title, children }) => (
  <Container>
    <Triangle />
    {title &&
      <h3>{title}</h3>
    }
    <Body>
      {children}
    </Body>
  </Container>
)

InfoBox.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
}

export default InfoBox
