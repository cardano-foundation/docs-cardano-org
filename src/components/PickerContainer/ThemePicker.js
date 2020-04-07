import React from 'react'
import { ThemeConsumer } from '../../state'
import styled from 'styled-components'
import { WiDaySunny, WiNightClear } from 'react-icons/wi'
import config from '../../config'
import Link from '../Link'

const Container = styled.div`
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
    margin-left: 2rem;
  }
  a {
    color: ${({ theme }) => theme.colors.text};
    font-size: 3rem;
    opacity: 0.6;
    @media screen and (max-width: ${config.mobileHeaderBreakPoint - 1}px) {
      font-size: 2rem;
    }
  }
`

const themes = ['light', 'dark']

const ThemePicker = () => {
  const onClick = (themeString, setTheme) => e => {
    e.preventDefault()
    setTheme(themes[+!themes.indexOf(themeString)])
  }

  return (
    <Container>
      <ThemeConsumer>
        {({ themeString, setTheme }) => (
          <Link href='#' onClick={onClick(themeString, setTheme)} aria-hidden>
            {themeString === 'light' && <WiNightClear />}
            {themeString === 'dark' && <WiDaySunny />}
          </Link>
        )}
      </ThemeConsumer>
    </Container>
  )
}

export default ThemePicker
