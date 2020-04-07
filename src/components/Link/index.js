import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import { isRelative, isPath, languageSetInURL, isFile } from '../../helpers/url'
import { click } from '../../helpers/analytics'
import { INTERNAL_LINK, EXTERNAL_LINK } from '../../constants/analytics'
import { LanguageConsumer } from '../../state'

const getHref = (href, useLang, lang) => {
  return useLang && !languageSetInURL(href)
    ? `/${lang}${href}`
    : href
}

const Link = (props) => {
  const isRelativeLink = isRelative(props.href)
  const isPathLink = isPath(props.href)
  const isFileLink = isFile(props.href)
  const onClick = (e) => {
    click({ category: isRelativeLink ? INTERNAL_LINK : EXTERNAL_LINK, label: props.tracking.label || props.href, event: e })
    props.onClick && props.onClick(e)
  }

  const linkProps = { ...props }
  const unsupportedProps = [ 'children', 'onClick', 'secondary', 'tracking', 'useLang', 'activeClassName', 'loading' ]
  unsupportedProps.forEach(prop => delete linkProps[prop])

  if (isRelativeLink && isPathLink && !isFileLink) {
    return (
      <LanguageConsumer>
        {({ lang }) => (
          <GatsbyLink
            to={getHref(props.href, props.useLang, lang)}
            {...linkProps}
            onClick={onClick}
            activeClassName={props.activeClassName}
          >
            {props.children}
          </GatsbyLink>
        )}
      </LanguageConsumer>
    )
  } else {
    return (
      <a
        target={!isRelativeLink ? '_blank' : ''}
        rel={!isRelativeLink ? 'noopener' : ''}
        {...linkProps}
        onClick={onClick}
      >
        {props.children}
      </a>
    )
  }
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
  tracking: PropTypes.shape({
    label: PropTypes.string
  }),
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  // Prefix language for paths with missing lang
  useLang: PropTypes.bool
}

Link.defaultProps = {
  tracking: {},
  useLang: true
}

export default Link
