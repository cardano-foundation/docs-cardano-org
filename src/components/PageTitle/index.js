import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FullWidthSection from '../../components/FullWidthSection'
import DesktopNavigation from '../../components/Header/DesktopNavigation'

const HeadingWrap = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.subtleAccent};
`

const Heading = styled.h1`
  font-size:200%;
  margin: 0;
  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    flex: 1 100%;
  }
`

const NavWrap = styled.div`
  display: flex;
  flex-direction:column;
  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    flex-flow: wrap;
    > div {
      display: none;
    }
  }
`

const PageTitle = ({ title }) => (
  <HeadingWrap>
    <FullWidthSection>
      <NavWrap>
        <Heading className='text-transform-capitalize padding-bottom-3 padding-top-3'>
          {title}
        </Heading>
        <DesktopNavigation />
      </NavWrap>
    </FullWidthSection>
  </HeadingWrap>
)

PageTitle.propTypes = {
  title: PropTypes.string.isRequired
}

export default PageTitle
