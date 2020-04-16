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
  options: config.availableLanguages.map(({ key, label, flag }) => ({
    label: `${label} ${flag || ''}`,
    value: key
  })),
  default: config.availableLanguages[0].key
})

export const getAllArticlesWidget = (
  language,
  { name = 'article', label = 'Article', required, multiple, hint } = {}
) => ({
  label,
  name,
  required,
  multiple,
  hint,
  widget: 'select',
  options: JSON.parse(process.env.IOHK_AVAILABLE_ARTICLES)[language].map(
    article => ({
      label: article.label,
      value: article.value
    })
  )
})
