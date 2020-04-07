import React, { Fragment } from 'react'
import Select from '../Inputs/Select'
import { LanguageConsumer, ThemeConsumer } from '../../state'
import config from '../../config'
import MediaQuery from 'react-responsive'
import Query from './Query'

export default () => (
  <Query
    render={({ select_language: selectLanguage }) => (
      <ThemeConsumer>
        {({ theme }) => (
          <LanguageConsumer>
            {({ lang, setLang }) => (
              <Fragment>
                <MediaQuery query={`(max-width: ${theme.dimensions.mobileBreakpoint - 1}px)`}>
                  <Select
                    value={lang}
                    options={
                      Object.keys(config.availableLanguages)
                        .map(language => ({
                          key: language,
                          value: language,
                          label: (
                            <span className='text-align-center display-block'>
                              <span title={config.availableLanguages[language].label}>{config.availableLanguages[language].flag}</span>
                            </span>
                          ),
                          title: config.availableLanguages[language].label
                        }))
                    }
                    onChange={lang => setLang(lang)}
                    showArrow={false}
                    name='mobile_language_picker'
                    title='Select language'
                  />
                </MediaQuery>
                <MediaQuery query={`(min-width: ${theme.dimensions.mobileBreakpoint}px)`}>
                  <Select
                    value={lang}
                    options={
                      Object.keys(config.availableLanguages)
                        .map(language => ({
                          key: language,
                          value: language,
                          label: (
                            <Fragment>
                              <span aria-hidden>{config.availableLanguages[language].flag}</span>
                              <span className='text-transform-capitalize margin-left-1'>{config.availableLanguages[language].label}</span>
                            </Fragment>
                          ),
                          title: config.availableLanguages[language].label
                        }))
                    }
                    onChange={lang => setLang(lang)}
                    name='desktop_language_picker'
                    title={selectLanguage}
                  />
                </MediaQuery>
              </Fragment>
            )}
          </LanguageConsumer>
        )}
      </ThemeConsumer>
    )}
  />
)
