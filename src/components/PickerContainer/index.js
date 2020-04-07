import React, { Fragment } from 'react'
import LanguagePicker from './LanguagePicker'
import ThemePicker from './ThemePicker'
import { ThemeConsumer } from '../../state'

const PickerContainer = () => (
  <ThemeConsumer>
    {({ theme }) => (
      <Fragment>
        <ThemePicker />
        <LanguagePicker />
      </Fragment>
    )}
  </ThemeConsumer>
)

export default PickerContainer
