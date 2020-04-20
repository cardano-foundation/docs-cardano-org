import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import MuiContainer from '@material-ui/core/Container'

const StyledContainer = styled(MuiContainer)`
  @media screen and (min-width: 2048px) {
    max-width: 1920px;
  }
`

const Container = ({ children }) => (
  <StyledContainer maxWidth='lg'>
    {children}
  </StyledContainer>
)

Container.propTypes = {
  children: PropTypes.node
}

export default Container
