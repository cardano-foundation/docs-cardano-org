import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Footer from '@input-output-hk/front-end-site-components/components/Footer'
import Theme from '@input-output-hk/front-end-core-components/components/Theme'
import Container from '@material-ui/core/Container'
import { Consumer as ScreenSizeConsumer } from '../state/ScreenSize'

const StyledMain = styled.main`
  position: relative;
  z-index: 1;
  margin: 0 auto;
  width: 100%;
`

const Main = ({ children }) => (
  <ScreenSizeConsumer>
    {({ screenSize, screenWidth }) => (
      <Fragment>
        <StyledMain>
          {children}
        </StyledMain>
        <Container maxWidth={(screenWidth > 2048) ? 'xl' : 'lg'}>
          <Theme.Consumer>
            {({ theme }) => (
              <Footer theme={theme.palette.type} variant='cardano' />
            )}
          </Theme.Consumer>
        </Container>
      </Fragment>
    )}
  </ScreenSizeConsumer>
)

Main.propTypes = {
  children: PropTypes.node.isRequired
}

export default Main
