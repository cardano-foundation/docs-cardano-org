import React from 'react'
import styled from 'styled-components'
import { ThemeConsumer } from '../../state'
import Link from '../Link'

const Wrap = styled.div`
  display: inline-block;
  text-transform: uppercase;

  img,
  strong {
    vertical-align: middle;
  }
  img {
    width: 3.5rem;
    margin: 0 2rem 0 0;
  }
  strong {
    display: inline-block;
    color: ${({ theme }) => theme.colors.heading};
  }
`

const Logo = () => (
  <ThemeConsumer>
    {({ theme }) => (
      <Wrap>
        <Link href='/'>
          <img src={theme.images.Logo} alt='Logo' />
          <strong>Cardano Documentation</strong>
        </Link>
      </Wrap>
    )}
  </ThemeConsumer>
)

export default Logo
