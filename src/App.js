import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Provider as ReactGridProvider } from '@input-output-hk/react-grid'
import {
  ThemeProvider,
  ThemeConsumer,
  LanguageProvider,
  PageLoaderProvider,
  ScreenSizeProvider
} from './state'
import Header from './components/Header'
import Footer from './components/Footer'
import GlobalStyles from './GlobalStyles'

const App = ({ element }) => (
  <ThemeProvider>
    <ThemeConsumer>
      {({ theme }) => (
        <ScreenSizeProvider screenSizes={theme.dimensions.screenSizes}>
          <ReactGridProvider
            screenSizes={{
              xl: theme.dimensions.screenSizes.extraLarge,
              lg: theme.dimensions.screenSizes.large,
              md: theme.dimensions.screenSizes.medium,
              sm: theme.dimensions.screenSizes.small
            }}
          >
            <Fragment>
              <GlobalStyles />
              <LanguageProvider>
                <PageLoaderProvider>
                  <Fragment>
                    <Header />
                    {element}
                    <Footer />
                  </Fragment>
                </PageLoaderProvider>
              </LanguageProvider>
            </Fragment>
          </ReactGridProvider>
        </ScreenSizeProvider>
      )}
    </ThemeConsumer>
  </ThemeProvider>
)

App.propTypes = {
  element: PropTypes.node.isRequired
}

export default App
