import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '../Link'
import Loader from '../Loader'
import { ThemeConsumer } from '../../state'

const Container = styled.span`
  > a {
    background-color: ${({ theme }) => theme.colors.interactive};
    color: ${({ theme }) => theme.colors.buttonColor};
    border: none;
    border-radius: 0.2rem;
    letter-spacing: 0.1em;
    padding: 0.6rem 1.8rem;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;
    display: inline-block;

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.buttonColor};
      background-color: ${({ theme }) => theme.colors.interactiveHighlight};
    }

    &.secondary {
      background-color: ${({ theme }) => theme.colors.secondaryButtonBackground};
      color: ${({ theme }) => theme.colors.secondaryButtonColor};

      &:hover,
      &:focus {
        background-color: ${({ theme }) => theme.colors.secondaryButtonBackgroundHighlight};
        color: ${({ theme }) => theme.colors.secondaryButtonColor};
      }
    }

    &.outline {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.secondaryText};
      border: 0.1rem solid ${({ theme }) => theme.colors.secondaryText};

      &:hover,
      &:focus {
        border-color: ${({ theme }) => theme.colors.text};
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }
`

const Button = (props) => {
  if (!props.href && !props.onClick) throw new Error('Button must either have onClick or href prop')
  const getLoaderColor = (colors) => {
    if (props.type === 'primary') return colors.textInverted
    return colors.text
  }

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <Container className='text-transform-uppercase'>
          <Link
            target={props.target}
            className={props.type}
            href={props.href || '#'}
            {...props}
          >
            {props.loading && <Loader size={1.6} color={getLoaderColor(theme.colors)} />}
            {!props.loading && props.children}
          </Link>
        </Container>
      )}
    </ThemeConsumer>
  )
}

Button.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]).isRequired,
  onClick: PropTypes.func,
  href: PropTypes.string,
  type: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline'
  ]),
  target: PropTypes.string,
  loading: PropTypes.bool
}

Button.defaultProps = {
  type: 'primary',
  loading: false
}

export default Button
