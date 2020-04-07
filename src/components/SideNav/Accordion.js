import React, { useState, Fragment } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '../Link'
import NavigationTree from './NavigationTree'
import { FiChevronRight } from 'react-icons/fi'

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  .dropDownHeading {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (min-width: ${({ theme }) => theme.dimensions.mobileBreakpoint}px) {
      justify-content: space-between;
    }
    a svg {
      min-width: 14px;
    }
  }

  .dropdown__content {
    overflow: auto;
    transition: max-height 0.6s ease;
  }

  .expandableContent-enter {
    max-height:0px;
  }

  .expandableContent-enter.expandableContent-enter-active {
    max-height: 100rem;
    transition: max-height 500ms ease-in;
  }

  .expandableContent-leave {
    max-height: 100rem;
  }

  .expandableContent-leave.expandableContent-leave-active {
    max-height:0px;
    transition: max-height 300ms ease;
  }

  .dropDownArrow {
    transform:rotate(0);
    transition: all 300ms ease;
  }

  .dropDownArrow.down {
    transform:rotate(90deg);
    transition: all 300ms ease;
  }
`

const Accordion = ({ item: { path, title, children, hasContent }, lang, currentPathname }) => {
  const isActive = () => {
    const fullPath = lang ? `/${lang}${path}` : path
    return currentPathname.substring(0, fullPath.length) === fullPath
  }

  const [expanded, setExpanded] = useState(isActive())

  const onClick = (e) => {
    if (hasContent) return
    e.preventDefault()
    return !isActive() && setExpanded(!expanded)
  }

  return (
    <Dropdown>
      <Link
        className='dropDownHeading horizontal'
        activeClassName='active'
        partiallyActive
        href={`/${lang}${path}`}
        onClick={onClick}
      >
        <div>
          {title}
        </div>
        <FiChevronRight className={`dropDownArrow ${expanded ? 'down' : ''}`} />
      </Link>
      <ReactCSSTransitionGroup
        component={Fragment}
        transitionName='expandableContent'
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {expanded &&
          <div
            className='dropdown__content'
          >
            <NavigationTree
              items={children}
              path={path}
              lang={lang}
              currentPathname={currentPathname}
              isRoot={false}
            />
          </div>
        }
      </ReactCSSTransitionGroup>
    </Dropdown>
  )
}

Accordion.propTypes = {
  item: PropTypes.shape({
    children: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    hasContent: PropTypes.bool.isRequired
  }),
  lang: PropTypes.string.isRequired,
  currentPathname: PropTypes.string.isRequired
}

export default Accordion
