import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { makeTransparent } from '../helpers/color'

const Container = styled.div`
  width: 100%;
  padding: 5rem;
  background-color: ${({ theme }) => theme.colors.secondary.light};
  color: ${({ theme }) => theme.colors.primary.contrastText};
  text-align: center;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    border-top: 1px solid ${({ theme }) => theme.colors.info.light};
    width: 12rem;
    color: ${({ theme }) => theme.colors.primary.contrastText};
  }
`

const Triangle = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  border-width: 2.6rem 1.5rem 0 1.5rem;
  border-color: ${({ theme }) => theme.colors.info.light} transparent transparent transparent;
  border-style: solid;
  width: 0;
  height: 0;

  &:after {
    content: '';
    border-width: 2.4rem 1.3rem 0 1.3rem;
    border-color: ${({ theme }) => theme.colors.secondary.dark} transparent transparent transparent;
    border-style: solid;
    transform: translate(-50%, -2.5rem);
    left: 50%;
    position: absolute;
  }
`

const Body = styled.div`
  color: ${({ theme }) => makeTransparent(theme.colors.primary.contrastText, 0.5)};
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
