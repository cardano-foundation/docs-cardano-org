import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { MdClose } from 'react-icons/md'
import Link from '../Link'
import Button from '../Button'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { getBody, hideScrollBar, showScrollBar } from '../../helpers/dom'
import { autoCapture } from '../../helpers/analytics'
import { ALERT } from '../../constants/analytics'

const scaleIn = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.03, 0);
  }

  50% {
    transform: translate(-50%, -50%) scale(0.03, 1);
  }

  100% {
    transform: translate(-50%, -50%) scale(1, 1);
  }
`

const scaleOut = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1, 1);
  }

  50% {
    transform: translate(-50%, -50%) scale(0.03, 1);
  }

  100% {
    transform: translate(-50%, -50%) scale(0.03, 0);
  }
`

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;

  &.alert-enter {
    > div.background {
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }

    > div.foreground {
      transform: translate(-50%, -50%) scale(0);

      .title span,
      .body,
      .buttons {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        transition-delay: 0.5s;
      }
    }
  }

  &.alert-enter-active {
    > div.background {
      opacity: 0.4;
    }

    > div.foreground {
      animation: ${scaleIn} 500ms ease-in-out;
      animation-iteration-count: 1;
      transform: translate(-50%, -50%) scale(1);

      .title span,
      .body,
      .buttons {
        opacity: 1;
      }
    }
  }

  &.alert-leave {
    > div.background {
      opacity: 0.4;
      transition: opacity 0.5s ease-in-out;
    }

    > div.foreground {
      transform: translate(-50%, -50%) scale(1);

      .title span,
      .body,
      .buttons {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
      }
    }
  }

  &.alert-leave-active {
    > div.background {
      opacity: 0;
    }

    > div.foreground {
      animation: ${scaleOut} 500ms ease-in-out;
      animation-iteration-count: 1;
      animation-delay: 0.3s;

      .title span,
      .body,
      .buttons {
        opacity: 0;
      }
    }
  }
`

const Background = styled.div`
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.textInverted};
`

const Foreground = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  width: 100%;
  max-width: 38rem;
  background-color: ${({ theme }) => theme.colors.alertBackground};
  color: ${({ theme }) => theme.colors.alertForeground};
  z-index: 11;
  box-shadow: 0.2rem 0.2rem 0.6rem ${({ theme }) => theme.colors.alertForeground};
`

const Title = styled.h2`
  border-bottom: 0.1rem solid ${({ theme }) => theme.colors.pageRule};
  width: 100%;
  display: block;
  padding: 1rem 4rem;
`

const Body = styled.div`
  padding: 1rem 1.6rem;
`

const Close = styled.div`
  position: absolute;
  top: 1rem;
  right: 1.6rem;
  font-size: 2.8rem;
`

const Buttons = styled.div`
  border-top: 0.1rem solid ${({ theme }) => theme.colors.pageRule};
  padding: 1rem 1.6rem;
  margin-top: 1.66rem;

  > span {
    margin-right: 1rem;

    &:last-of-type {
      margin-right: 0;
    }
  }
`

const Alert = ({ title, children, onDismiss, buttons, isVisible, name }) => {
  useEffect(() => {
    if (isVisible) {
      autoCapture({ category: ALERT, action: 'view_alert', label: name })
      hideScrollBar()
    } else if (!isVisible) {
      showScrollBar()
    }
  }, [ isVisible ])

  if (!getBody()) return null
  return createPortal((
    <ReactCSSTransitionGroup
      transitionName='alert'
      transitionEnterTimeout={800}
      transitionLeaveTimeout={780}
    >
      {isVisible &&
        <Wrapper>
          <Background className='background' />
          <Foreground className='foreground'>
            <Title className='title text-align-center'><span>{title}</span></Title>
            {onDismiss &&
              <Close>
                <Link href='#' onClick={onDismiss}><MdClose /></Link>
              </Close>
            }
            <Body className='body'>{children}</Body>
            <Buttons className='buttons text-align-right'>
              {buttons.map(button => (
                <Button
                  type={button.type}
                  onClick={button.onClick}
                  key={button.key}
                >
                  {button.label}
                </Button>
              ))}
            </Buttons>
          </Foreground>
        </Wrapper>
      }
    </ReactCSSTransitionGroup>
  ), getBody())
}

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onDismiss: PropTypes.func,
  buttons: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.oneOf([ 'primary', 'secondary', 'outline' ]).isRequired
  })).isRequired,
  isVisible: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired
}

export default Alert
