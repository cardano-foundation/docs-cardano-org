import React, { Fragment } from 'react'
import styled from 'styled-components'
import MobileNavigation from './MobileNavigation'
import Logo from './Logo'
import { ThemeConsumer } from '../../state'
import LanguagePicker from '../../components/PickerContainer/LanguagePicker'
import ThemePicker from '../../components/PickerContainer/ThemePicker'
// import { Typography } from '@material-ui/core'

const Header = styled.header`
  min-height: 8rem;
  position: relative;
  z-index: 2;
  margin: 0rem auto 0;
  width: 100%;
  max-width: ${({ theme }) => theme.dimensions.contentWidth};
  display: flex;
  align-items: center;
`

const HeaderTitleLogo = styled.div`
  z-index: 2;
  flex-direction: row;
`

const PickerComponent = styled.ul`
  flex: 2;
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    display: none;
  }
`

export default () => (
  <ThemeConsumer>
    {({ theme }) => (
      <Fragment>
        <MobileNavigation className='hide-on-desktop' />
        <Header>
          <HeaderTitleLogo>
            <Logo />
            {/* <Typography variant='h4' color='primary'>
              Material-UI Version
            </Typography> */}
          </HeaderTitleLogo>
          <PickerComponent>
            <li>
              <LanguagePicker />
            </li>
            <li>
              <ThemePicker />
            </li>
          </PickerComponent>
        </Header>
      </Fragment>
    )}
  </ThemeConsumer>
)
