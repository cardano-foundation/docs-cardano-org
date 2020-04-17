import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import { Consumer as ScreenSizeConsumer } from '../state/ScreenSize'

const Outer = styled.div`
  position: relative;
  width: 100vw;
  left: 50%;
  margin-left: -50vw;
  background: ${({ background, theme }) => background || theme.colors.subtle};
  background-size:contain;
`

const FullWidthSection = ({ children, background, fullWidthContent }) => (
  <ScreenSizeConsumer>
    {({ screenSize, screenWidth }) => (
      <Outer background={background}>
        {!fullWidthContent &&
          <Container maxWidth={(screenWidth > 2048) ? 'xl' : 'lg'}>
            {children}
          </Container>
        }
        {fullWidthContent && children}
      </Outer>
    )}
  </ScreenSizeConsumer>
)

FullWidthSection.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  background: PropTypes.string,
  fullWidthContent: PropTypes.bool
}

FullWidthSection.defaultProps = {
  fullWidthContent: false
}

export default FullWidthSection
