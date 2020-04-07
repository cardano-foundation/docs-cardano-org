import config from '../src/config'

// We control this through package.json scripts
export const isProduction = () => process.env.NODE_ENV === 'production'
// BRANCH environment variable is defined on Netlify's build servers
export const getBranch = () => process.env.HEAD

export const getLanguageSelectWidget = ({ name = 'lang', label = 'Language', required } = {}) => ({
  label,
  name,
  required,
  widget: 'select',
  options: Object.keys(config.availableLanguages).map(lang => ({
    label: `${config.availableLanguages[lang].label} ${config.availableLanguages[lang].flag || ''}`,
    value: lang
  })),
  default: Object.keys(config.availableLanguages)[0]
})
