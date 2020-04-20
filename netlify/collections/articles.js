import config from '../../src/config'
import { getAllArticlesWidget } from '../helpers'
const buildCollection = language => {
  return {
    name: `articles-${language}`,
    label: `Articles (${language})`,
    folder: `resources/content/articles/${language}`,
    slug: `{{slug}}-${language}`,
    create: true,
    delete: true,
    fields: [
      getAllArticlesWidget(language, {
        required: false,
        multiple: false,
        name: 'parent',
        label: 'Parent article',
        hint: 'Does this article reside under another article?'
      }),
      {
        label: 'Title',
        name: 'title',
        widget: 'string',
        required: true
      },
      {
        label: 'Order',
        name: 'order',
        widget: 'number',
        min: 1,
        default: 1,
        hint:
          'The position of this article relative to its siblings. (Lower numbers first)'
      },
      {
        label: 'External link',
        name: 'external_href',
        widget: 'string',
        default: '',
        required: false,
        hint: 'Link to an external resource instead of providing content. The link will slot into the navigation.'
      },
      {
        label: 'Body',
        name: 'body',
        widget: 'markdown',
        required: false,
        hint: 'If no body is provided, then title appears as a \'heading\''
      }
    ]
  }
}

export default config.availableLanguages.map(({ key }) => buildCollection(key))
