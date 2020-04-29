import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { analytics } from '@input-output-hk/front-end-core-libraries'
import Language from '@input-output-hk/front-end-core-components/components/Language'
import GlobalContentQuery from '../queries/GlobalContentQuery'

const StyledMenuItem = styled(MenuItem)`
  display: block;
  width: 100%;
  padding: 0.8rem 2rem;
`

const TriggerButton = styled(Button)`
  padding: 0.9rem 1.8rem;
  text-transform: none;
  border-radius: 0.5rem;
  border: 0.1rem solid ${({ theme }) => theme.palette.text.primary};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-right: 1rem;
  }
`

export default () => {
  const [ anchorEl, setAnchorEl ] = useState(null)
  const getCurrentLanguage = (lang, availableLanguages) => {
    const language = availableLanguages.filter(({ key }) => key === lang).shift()
    return language.label
  }

  const onClose = () => setAnchorEl(null)

  return (
    <GlobalContentQuery
      render={globalContent => (
        <Language.Consumer>
          {({ key: lang, availableLanguages, setLang }) => (
            <Fragment>
              <TriggerButton
                onClick={e => {
                  e.preventDefault()
                  analytics.click({ category: 'toggle_language_selector', event: e })
                  setAnchorEl(e.currentTarget)
                }}
                aria-label={globalContent.select_language}
              >
                {getCurrentLanguage(lang, availableLanguages)}
              </TriggerButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={onClose}
              >
                {availableLanguages.map(language => (
                  <StyledMenuItem
                    key={language.key}
                    component='button'
                    onClick={e => {
                      e.preventDefault()
                      analytics.click({ category: 'language_selector', label: language.key, event: e })
                      setLang(language.key)
                      onClose()
                    }}
                    aria-label={language.label}
                  >
                    {language.label}
                  </StyledMenuItem>
                ))}
              </Menu>
            </Fragment>
          )}
        </Language.Consumer>
      )}
    />
  )
}
