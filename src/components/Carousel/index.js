import React, { createRef, Component, Children } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { addEventListener, removeEventListener } from '../../helpers/dom'
import Arrow from '../Arrow'
import { makeTransparent } from '../../helpers/color'

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`

const ScrollContainer = styled.div`
  width: ${({ containerWidth, itemCount }) => itemCount * containerWidth}px;
  position: relative;
  left: 50%;
  transform: translateX(-${({ containerWidth, itemCount }) => (itemCount / 2) * containerWidth}px);

  &.left {
    transform: translateX(-${({ containerWidth, itemCount }) => (itemCount / 2 - 0.7) * containerWidth}px);
    transition: transform 1s ease-in-out;

    .item-outer {
      &:nth-of-type(${({ itemCount }) => Math.floor(itemCount / 2)}) {
        .item-inner {
          transition: transform 1s ease-in-out, opacity 1s ease-in-out;
          transform: scale(1);
          opacity: 1;
        }
      }

      &:nth-of-type(${({ itemCount }) => Math.ceil(itemCount / 2)}) {
        .item-inner {
          transition: transform 1s ease-in-out, opacity 1s ease-in-out;
          transform: scale(0.8);
          opacity: 0.6;
        }
      }
    }
  }

  &.right {
    transform: translateX(-${({ containerWidth, itemCount }) => (itemCount / 2 + 0.7) * containerWidth}px);
    transition: transform 1s ease-in-out;

    .item-outer {
      &:nth-of-type(${({ itemCount }) => Math.ceil(itemCount / 2) + 1}) {
        .item-inner {
          transition: transform 1s ease-in-out, opacity 1s ease-in-out;
          transform: scale(1);          
          opacity: 1;
        }
      }

      &:nth-of-type(${({ itemCount }) => Math.ceil(itemCount / 2)}) {
        .item-inner {
          transition: transform 1s ease-in-out, opacity 1s ease-in-out;
          transform: scale(0.8);
          opacity: 0.6;
        }
      }
    }
  }

  .item-outer {
    &:nth-of-type(${({ itemCount }) => Math.ceil(itemCount / 2)}) {
      .item-inner {
        transform: scale(1);
        opacity: 1;
      }
    }
  }
`

const ItemOuter = styled.div`
  display: inline-block;
  box-sizing: border-box;
  vertical-align: middle;
  width: ${({ containerWidth }) => 0.7 * containerWidth}px;
`

const ItemInner = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(0.8);
  opacity: 0.6;

  > * {
    flex-grow: 1;
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
`

const Navigate = styled.a`
  z-index: 1;
  position: absolute;
  ${({ left, right }) => {
    if (left) return `left: 0;`
    if (right) return `right: 0;`
  }}
  top: 0;
  bottom: 0;
  width: 10%;
  color: ${({ theme }) => theme.colors.interactive};
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 4rem;
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    transition: transform 1s ease-in-out;
    background-color: rgba(0, 0, 0, 0.3);
  ${({ left, right, theme, navigationBackgroundColor }) => {
    if (left) return `background: linear-gradient(to right, ${navigationBackgroundColor || theme.colors.primary} 0%, ${makeTransparent(navigationBackgroundColor || theme.colors.primary, 0)} 100%);`
    if (right) return `background: linear-gradient(to left, ${navigationBackgroundColor || theme.colors.primary} 0%, ${makeTransparent(navigationBackgroundColor || theme.colors.primary, 0)} 100%);`
  }}
  }

  &:hover {
    color: ${({ theme }) => theme.colors.interactiveHighlight};

    &:before {
      ${({ left, right }) => left ? `transform: translateX(-50%);` : right ? `transform: translateX(50%);` : ''}
    }

    > div {
      animation: ${pulse} 1.3s ease-in-out;
      animation-iteration-count: infinite;
      transition: transform 0.8s ease-in-out;
    }
  }

  > div {
    animation: none;
  }
`

export default class Carousel extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ]).isRequired,
    initialActiveIndex: PropTypes.number,
    navigationBackgroundColor: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.containerRef = createRef()
    const items = this.getAllItems()
    this.state = {
      containerWidth: null,
      activeIndex: props.initialActiveIndex && items[props.initialActiveIndex] ? props.initialActiveIndex : 0,
      animateClass: null,
      items
    }
  }

  /**
   * Gets all child items, if child items length is less than 5 it is doubled i.e.
   * [ Child1, Child2 ] -> [ Child1, Child2, Child1, Child2, Child1, Child2 ]
   * [ Child1, Child2, Child3, Child4 ] -> [ Child1, Child2, Child3, Child4, Child1, Child2, Child3, Child4 ]
   * [ Child1, Child2, Child3, Child4, Child5 ] -> [ Child1, Child2, Child3, Child4, Child5 ]
   *
   * This is so we can render all items which can be visible at any point in the animation stage
   */
  getAllItems () {
    const childrenArray = Children.toArray(this.props.children)
    const items = [ ...childrenArray ]
    while (items.length < 5) {
      items.push(...childrenArray)
    }

    return items
  }

  /**
   * Gets a subset of the child items to render to the carousel. Returns 5 items
   * with the active item in the middle of the array
   */
  getRenderableItems () {
    const { items, activeIndex } = this.state
    const renderableItems = [ { item: items[activeIndex], index: activeIndex } ]
    for (let i = 1; i <= 2; i++) {
      let lowerIndex = activeIndex - i
      let upperIndex = activeIndex + i
      if (lowerIndex < 0) lowerIndex = items.length + lowerIndex
      if (upperIndex > items.length - 1) upperIndex = upperIndex - items.length
      renderableItems.unshift({ item: items[lowerIndex], index: lowerIndex })
      renderableItems.push({ item: items[upperIndex], index: upperIndex })
    }

    return renderableItems
  }

  /**
   * The container size is tracked in order to resize the items and scroll container
   * for responsiveness
   */
  onResize = () => {
    this.containerRef.current && this.setState({ containerWidth: this.containerRef.current.offsetWidth })
  }

  componentDidMount () {
    this._isMounted = true
    this.onResize()
    addEventListener('resize', this.onResize)
  }

  componentWillUnmount () {
    this._isMounted = false
    removeEventListener('resize', this.onResize)
    clearTimeout(this.animateTimeout)
  }

  /**
   * Called on init and whenever the children props changes
   */
  updateItems () {
    this.setState({ items: this.getAllItems() })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.children !== this.props.children) this.updateItems()
  }

  /**
   * Event handler for navigating left and right
   */
  navigate = (direction) => (e) => {
    e.preventDefault()
    // If we are already animating do nothing
    if (this.state.animateClass) return
    this.setState({ animateClass: direction })
    this.animateTimeout = setTimeout(() => {
      let newActiveIndex
      if (direction === 'left') newActiveIndex = this.state.activeIndex === 0 ? this.state.items.length - 1 : this.state.activeIndex - 1
      if (direction === 'right') newActiveIndex = this.state.activeIndex === this.state.items.length - 1 ? 0 : this.state.activeIndex + 1
      this.setState({ animateClass: null, activeIndex: newActiveIndex })
    }, 1000)
  }

  render () {
    const renderableItems = this.getRenderableItems()
    return (
      <Container ref={this.containerRef}>
        <Navigate href='#' left navigationBackgroundColor={this.props.navigationBackgroundColor} onClick={this.navigate('left')}>
          <div>
            <Arrow left fill />
          </div>
        </Navigate>
        <Navigate href='#' right navigationBackgroundColor={this.props.navigationBackgroundColor} onClick={this.navigate('right')}>
          <div>
            <Arrow right fill />
          </div>
        </Navigate>
        {this.state.containerWidth !== null &&
          <ScrollContainer containerWidth={this.state.containerWidth} itemCount={renderableItems.length} className={this.state.animateClass}>
            {renderableItems.map(({ item, index }) => (
              <ItemOuter className='text-align-center item-outer' containerWidth={this.state.containerWidth} key={index} aria-hidden={index !== Math.floor(renderableItems.length / 2)}>
                <ItemInner className={[ 'item-inner' ]}>
                  {item}
                </ItemInner>
              </ItemOuter>
            ))}
          </ScrollContainer>
        }
      </Container>
    )
  }
}
