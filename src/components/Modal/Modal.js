import React, { Component, Fragment } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import styled, { keyframes } from 'styled-components'
import { IoMdClose } from 'react-icons/io'
import TinyColor from '@ctrl/tinycolor'
import { getBody, addEventListener, removeEventListener, hideScrollBar, showScrollBar } from '../../helpers/dom'
import { getHashParam, setHashParam } from '../../helpers/url'
import { modalView } from '../../helpers/analytics'
import Link from '../Link'

const getModalBorderColor = theme => {
  const color = new TinyColor(theme.colors.primaryHighlight)
  color.setAlpha(0.5)
  return color.toRgbString()
}

const scaleIn = keyframes`
  0% {
    transform: scale(0.03, 0) translate(-50%, -50%);
  }

  50% {
    transform: scale(0.03, 1) translate(-50%, -50%);
  }

  100% {
    transform: scale(1, 1) translate(-50%, -50%);
  }
`

const scaleOut = keyframes`
  0% {
    transform: scale(1, 1) translate(-50%, -50%);
  }

  50% {
    transform: scale(0.03, 1) translate(-50%, -50%);
  }

  100% {
    transform: scale(0.03, 0) translate(-50%, -50%);
  }
`

const ModalBackgroundScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background-color: transparent;
`

const ModalContainer = styled.div`
  .modal-content-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: 0 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    max-height: ${({ fullScreen }) => fullScreen ? 'none' : '50rem'};
    max-width: ${({ fullScreen }) => fullScreen ? 'none' : '50rem'};
    background-color: ${({ theme }) => theme.colors.primary};
    overflow: hidden;

    @media screen and (max-height: 800px) {
      max-height: ${({ fullScreen }) => fullScreen ? 'none' : '80rem'};
    }

    &:before,
    &:after {
      content: '';
      display: block;
      height: 1.5rem;
      width: 100%;
      position: absolute;
      background-color: ${({ theme }) => getModalBorderColor(theme)};
      z-index: 1;
    }

    &:before {
      top: 0;
    }

    &:after {
      bottom: 0;
    }

    .modal-content-inner-wrapper {
      position: absolute;
      z-index: 1;
      top: -1.5rem;
      bottom: -1.5rem;
      width: 100%;
      border: 0 solid ${({ theme }) => getModalBorderColor(theme)};
      border-left-width: 1.5rem;
      border-right-width: 1.5rem;
      margin-top: 3rem;
    }
  }

  .modal-content {
    transition: opacity 500ms ease-in-out;
    opacity: 1;
    height: 100%;
    overflow: scroll;
    padding-right: ${({ fullScreen }) => fullScreen ? 0 : 5}rem;

    @media screen and (max-height: 800px) {
      padding-right: 0;
      padding-top: 6rem;
    }
  }

  .modal-transition-leave {
    transform: scale(1) translate(-50%, -50%);

    .modal-content {
      opacity: 0;
    }
  }

  .modal-transition-enter {
    transform: scale(0) translate(-50%, -50%);

    .modal-content {
      opacity: 0;
    }
  }

  .modal-transition-enter-active {
    animation: ${scaleIn} 500ms ease-in-out;
    animation-iteration-count: 1;
  }

  .modal-transition-leave-active {
    animation: ${scaleOut} 600ms ease-in-out;
    animation-delay: 500ms;
    animation-iteration-count: 1;
  }
`

const CloseContainer = styled.div`
  position: absolute;
  right: 0;
  z-index: 1;
  width: ${({ fullScreen }) => fullScreen ? 15 : 8}rem;
  height: ${({ fullScreen }) => fullScreen ? 15 : 8}rem;
  border-radius: 7.5rem;
  transform: translate(50%, -40%);
  background-color: ${({ theme, fullScreen }) => fullScreen ? theme.colors.primaryHighlight : 'transparent'};

  a {
    color: ${({ theme }) => theme.colors.text};
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 4rem;
    transform: translate(-100%, -10%);
  }
`

export default class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    // Modal name for tracking
    name: PropTypes.string.isRequired,
    fullScreen: PropTypes.bool
  }

  static defaultProps = {
    fullScreen: true
  }

  constructor (props) {
    super(props)
    this.state = { renderModal: false, isVisible: getHashParam('modal') === props.name }
  }

  onClose = (e) => {
    e.preventDefault()
    setHashParam('modal', '')
  }

  renderCloseComponent () {
    return (
      <CloseContainer fullScreen={this.props.fullScreen}>
        <Link href='#' onClick={this.onClose} tracking={{ label: `modal_close_${this.props.name}` }}>
          <IoMdClose />
        </Link>
      </CloseContainer>
    )
  }

  trackView () {
    modalView(this.props.name)
  }

  onHashChange = () => {
    if (getHashParam('modal') === this.props.name && !this.state.isVisible) this.setState({ isVisible: true })
    if (getHashParam('modal') !== this.props.name && this.state.isVisible) this.setState({ isVisible: false })
  }

  componentDidMount () {
    this.setState({ renderModal: true })
    addEventListener('hashchange', this.onHashChange)
    if (this.state.isVisible) this.trackView()
  }

  componentWillUnmount () {
    removeEventListener('hashchange', this.onHashChange)
  }

  componentDidUpdate (_, prevState) {
    if (this.state.isVisible && !prevState.isVisible) this.trackView()
    if (!prevState.isVisible && this.state.isVisible) {
      hideScrollBar()
    } else if (prevState.isVisible && !this.state.isVisible) {
      showScrollBar()
    }
  }

  render () {
    if (!this.state.renderModal) return null
    return createPortal((
      <Fragment>
        {!this.props.fullScreen && this.state.isVisible &&
          <ModalBackgroundScreen onClick={this.onClose} />
        }
        <ModalContainer fullScreen={this.props.fullScreen}>
          <ReactCSSTransitionGroup
            transitionName='modal-transition'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={1000}
          >
            {this.state.isVisible &&
              <div className='modal-content-wrapper' key='modal-content-wrapper'>
                <div className='modal-content-inner-wrapper'>
                  {this.renderCloseComponent()}
                  <div className='modal-content'>
                    {this.props.children}
                  </div>
                </div>
              </div>
            }
          </ReactCSSTransitionGroup>
        </ModalContainer>
      </Fragment>
    ), getBody())
  }
}
