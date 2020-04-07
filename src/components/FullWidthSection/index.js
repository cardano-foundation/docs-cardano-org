import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  width: 100vw;
  left: 50%;
  margin-left: -50vw;
  background: ${({ background, theme }) => background || theme.colors.subtle};
`

const InnerContainer = styled.div`
  max-width: ${({ theme }) => theme.dimensions.contentWidth};
  display: block;
  margin: 0 auto;
`

const FullWidthSection = ({ children, background, fullWidthContent }) => (
  <Container background={background}>
    {!fullWidthContent &&
      <InnerContainer>
        {children}
      </InnerContainer>
    }
    {fullWidthContent && children}
  </Container>
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
